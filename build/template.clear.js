const fs = require("fs-extra");
const tools = require("./template.tools");
const pkg = require("../package.json");


const pluginName = "vue-cli-plugin-" + pkg.name;

tools.rimraf("./" + pluginName);
