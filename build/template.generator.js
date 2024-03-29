const fs = require("fs-extra");
const path = require("path");
const tools = require("./template.tools");


module.exports = function generatorIndexJS(pkg) {

    const pluginName = "vue-cli-plugin-" + pkg.name;
    var dependencies = JSON.stringify(pkg.dependencies, null, 2);
    var devDependencies = JSON.stringify(pkg.devDependencies, null, 2);
    var scripts = JSON.stringify(pkg.scripts, null, 2);


    try {

        console.info(`生成${pluginName}插件 generator 开始`)

        tools.copyDir("./src", `./${pluginName}/generator/template/src`, newFile => {

            if (newFile.indexOf("_") >= 0) {
                newFile = newFile.replace("_", "__")
            }
            return newFile
        });

        fs.copySync('./public', `./${pluginName}/generator/template/public`);
        tools.copyFile('./public/index.html', `./${pluginName}/generator/template/public/index.html`, (data) => {
            data = tools.replaceAll("%", "%%", data);
            return data;
        });
     
        // tools.copyFile('./babel.config.js', `./${pluginName}/generator/template/babel.config.js`);
        tools.copyFile('./tsconfig.json', `./${pluginName}/generator/template/tsconfig.json`);
        tools.copyFile('./tslint.json', `./${pluginName}/generator/template/tslint.json`);

        tools.copyFile('./vue.config.js', `./${pluginName}/generator/template/vue.config.js`);


        tools.copyFile('./.editorconfig', `./${pluginName}/generator/template/.editorconfig`);

        tools.copyFile('./build/template/generator/index.js', `./${pluginName}/generator/index.js`, (data) => {
            data = tools.replaceAll("\"#{dependencies}\"", dependencies, data);
            data = tools.replaceAll("\"#{devDependencies}\"", devDependencies, data);
            data = tools.replaceAll("\"#{scripts}\"", scripts, data);
            return tools.formatJS(data);
        });

        console.info(`生成${pluginName}插件 generator 完成`)
    } catch (err) {
        console.error(err)
    }
}
