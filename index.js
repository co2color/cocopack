const fs = require('node:fs')
const path = require('node:path')
const resolve = require('resolve').sync
const detective = require('detective')


const config = {
  entry: './src/test.js',
  output: 'bundle.js',
}
let ID = 0
function createModuleObject(filepath) {
  //获取文件的 源码
  const source = fs.readFileSync(filepath, 'utf-8')
  //通过 detective 这个库 生成文件依赖 AST 
  const requires = detective(source)
  const id = ID++

  return { id, filepath, source, requires }
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

function pack(modules) {
  const modulesSource = modules.map(module =>
    `${module.id}: {
      factory: (module, require) => {
        ${module.source}
      },
      map: ${JSON.stringify(module.map)}
    }`,
  ).join()


  return `(modules => {
    const require = id => {
      const { factory, map } = modules[id]
      const localRequire = name => require(map[name])
      const module = { exports: {} }

      factory(module, localRequire)

      return module.exports
    }

    require(0)
  })({ ${modulesSource} })`
}


function getEntryFilePath() {
  let entryPathName = config.entry ? config.entry : 'index.js'
  let entryPath = path.join(__dirname, entryPathName)
  return entryPath
}

function getOutputFilePath() {
  let outputPathName = config.output ? config.output : 'bundle.js'
  let outputPath = path.join(__dirname, './dist', outputPathName)
  return outputPath
}

function output(data) {
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist')
  }
  fs.writeFileSync(getOutputFilePath(), data, { 'flag': 'w+' })
}

(function start() {
  let outputSource = pack(getModules(getEntryFilePath()))
  output(outputSource)
})()