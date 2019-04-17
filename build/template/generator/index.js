const fs = require("fs-extra")
const path = require("path")
const dir = __dirname + '/template/'
const base = process.cwd();

const rimraf = (dir_path) => {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function (entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
};

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
            rimraf(path.join(base, 'src'));
        }
        let filename = path.join(base, 'webpack.lib.conf.js')
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename);
        }

    } catch (error) {

    }

    api.extendPackage({
        dependencies: "#{dependencies}",
        devDependencies: "#{devDependencies}",
        scripts: "#{scripts}"
    });

    api.render('./template');

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
        const originals = srcFileList.filter(file => !templates.includes(file) && !/^src\/legacy\ /.test(file))

        originals.forEach(file => {
            const currentPath = api.resolve(file)
            const newPath = currentPath.replace('/src/', '/src/legacy/')
            fs.move(currentPath, newPath)
        })
    })

}
