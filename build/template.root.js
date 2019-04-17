const fs = require("fs-extra");
const tools = require("./template.tools");

module.exports = function gengerateRoot(pkg) {
    const pluginName = "vue-cli-plugin-" + pkg.name;

    try {
        console.info(`生成${pluginName}插件 根目录文件 开始`)
        tools.copyFile('./build/template/index.js', `./${pluginName}/index.js`);
        tools.copyFile('./build/template/prompts.js', `./${pluginName}/prompts.js`);
        tools.copyFile('./build/template/README.md', `./${pluginName}/README.md`, (data) => {
            data = tools.replaceAll("#{pluginName}", pluginName, data);
            data = tools.replaceAll("#{pluginSimpleName}", pkg.name, data);
            return data;
        });
        tools.copyFile('./build/template/package.json', `./${pluginName}/package.json`, (data) => {
            data = tools.replaceAll("#{pluginName}", pluginName, data);
            data = tools.replaceAll("#{pluginSimpleName}", pkg.name, data);
            data = tools.replaceAll("#{version}", pkg.version, data);
            return data;
        });

        console.info(`生成${pluginName}插件 根目录文件 完成`)
    } catch (err) {
        console.error(err)
    }
}
