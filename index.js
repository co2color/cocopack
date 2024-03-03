/* eslint-disable no-undef */
const detective = require('detective')
// const resolve = require('resolve').sync
const fs = require('fs')
import { join } from 'path'
import { fileURLToPath } from 'url'

const config = {
  'entry': './test/index.js',
  'output': 'bundle.js'
}

let ID = 0
function createModuleObject(filepath) {
  // 获取文件的 源码
  const source = fs.readFileSync(filepath, 'utf-8')
  // 生成文件依赖 AST 
  const requires = detective(source)
  const id = ID++

  return { id, filepath, source, requires }
}


function getEntryFilePath() {
  let entryPathName = config.entry ? config.entry : 'index.js'
  let entryPath = join(fileURLToPath(import.meta.url), entryPathName)
  return entryPath
}


function getModules(entry) {
  const rootModule = createModuleObject(entry)
  const modules = [rootModule]

  // Iterate over the modules, even when new 
  // ones are being added
  for (const module of modules) {
    module.map = {} // Where we will keep the module maps

    module.requires.forEach(dependency => {
      const basedir = path.dirname(module.filepath)
      const dependencyPath = resolve(dependency, { basedir })

      const dependencyObject = createModuleObject(dependencyPath)

      module.map[dependency] = dependencyObject.id
      modules.push(dependencyObject)
    })
  }

  return modules
}
