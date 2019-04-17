const fs = require("fs-extra")
const path = require("path")
const dir = __dirname + "/template/"
const base = process.cwd()

const rimraf = dir_path => {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(function(entry) {
      var entry_path = path.join(dir_path, entry)
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path)
      } else {
        fs.unlinkSync(entry_path)
      }
    })
    fs.rmdirSync(dir_path)
  }
}

const walk = (p, fileCallback, errCallback) => {
  fs.readdir(p, (err, files) => {
    if (err) {
      errCallback(err)
      return
    }

    files.forEach(file => {
      const fullPath = path.join(p, file)
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath, fileCallback)
      } else {
        fileCallback(fullPath)
      }
    })
  })
}

module.exports = (api, opts) => {
  try {
    if (opts.deleteSrc) {
      rimraf(path.join(base, "src"))
    }
    let filename = path.join(base, "webpack.lib.conf.js")
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename)
    }
  } catch (error) {}

  api.extendPackage({
    dependencies: {},
    devDependencies: {
      "@types/clipboard": "^2.0.1",
      "@types/highlight.js": "^9.12.3",
      "@types/js-cookie": "^2.2.1",
      "@types/lodash.debounce": "^4.0.5",
      "@types/node": "^11.9.4",
      "@vue/cli-plugin-babel": "^3.4.0",
      "@vue/cli-plugin-typescript": "^3.4.0",
      "@vue/cli-service": "^3.4.0",
      "add-asset-html-webpack-plugin": "^3.1.3",
      clipboard: "^2.0.4",
      "compression-webpack-plugin": "^2.0.0",
      del: "^3.0.0",
      "flagwind-core": "^1.1.0",
      "friendly-errors-webpack-plugin": "^1.7.0",
      iview: "^3.2.2",
      less: "^3.9.0",
      "less-loader": "^4.1.0",
      "lodash.debounce": "^4.0.8",
      "raw-loader": "^1.0.0",
      sass: "^1.17.0",
      "sass-loader": "^7.1.0",
      shelljs: "^0.8.3",
      "style-loader": "^0.23.1",
      "style-resources-loader": "^1.2.1",
      "ts-loader": "^5.3.3",
      tslint: "^5.13.1",
      "tslint-config-flagwind": "^1.0.1",
      "tslint-loader": "^3.5.4",
      typedoc: "^0.14.2",
      typescript: "^3.3.3",
      vue: "^2.6.7",
      "vue-class-component": "^7.0.1",
      "vue-cli-plugin-style-resources-loader": "^0.1.3",
      "vue-property-decorator": "^7.3.0",
      "vue-router": "^3.0.2",
      "vue-template-compiler": "^2.5.21",
      vuex: "^3.1.0",
      "webpack-cli": "^3.2.3"
    },
    scripts: {
      "dist:build":
        "vue-cli-service build --target lib --name index src/index.ts",
      "dist:types": "tsc -d --emitDeclarationOnly --declarationDir dist/types",
      "dist:clean": "node ./node_modules/rimraf/bin.js ./dist",
      dist: "npm run dist:clean && npm run dist:build && npm run dist:types",
      lint: "vue-cli-service lint"
    }
  })

  api.render("./template")

  let templates = []
  const fileCallback = path => {
    const simplePath = path.replace(dir, "")
    templates.push(simplePath)
  }
  const errCallback = err => console.log("Receive err:" + err)

  walk(dir, fileCallback, errCallback)

  api.postProcessFiles(files => {
    const fileList = Object.keys(files)
    const srcFileList = fileList.filter(file => /^src\\/.test(file))
    const originals = srcFileList.filter(
      file => !templates.includes(file) && !/^src\/legacy\ /.test(file)
    )

    originals.forEach(file => {
      const currentPath = api.resolve(file)
      const newPath = currentPath.replace("/src/", "/src/legacy/")
      fs.move(currentPath, newPath)
    })
  })
}
