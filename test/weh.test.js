const test = require('ava')
const vfile = require('vfile')
const weh = require('../lib/weh')

test('works correctly', async t => {
  const plugin = () => {
    return files => files.map(file => {
      file.contents = 'haha test'
      return file
    })
  }

  const res = await weh(site => {
    site.config({
      source: 'test/sample',
      no_write: true
    })

    site.use(plugin)
    return site
  })

  t.log(res.files)
  t.log(res.files.map(f => f.basename))
  t.is(res.files.find(f => f.basename === 'test.md').contents, 'haha test')
})

test('correctly runs in integration mode', async t => {
  const plugin = () => {
    return files => {
      return files.map(file => Object.assign(file, {contents: 'test2'}))
    }
  }

  const files = [
    vfile({ path: 'a', contents: 'aaa' })
  ]

  const res = await weh.integration(site => {
    site.use(plugin)
    return site
  }, files)

  t.is(res.files[0].contents, 'test2')
})
