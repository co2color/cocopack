// const detective = require('detective')
// const resolve = require('resolve').sync
// const fs = require('fs')
import { join } from 'path'
import { fileURLToPath } from 'url'

const config = {
  'entry': './test/index.js',
  'output': 'bundle.js'
}

function getEntryFilePath() {
  let entryPathName = config.entry ? config.entry : 'index.js'
  let entryPath = join(fileURLToPath(import.meta.url), entryPathName)
  return entryPath
}
getEntryFilePath()
