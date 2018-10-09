const FilesCollection = require('laravel-mix/src/FileCollection');
const fs = require('fs');
const path = require('path');
const converter = require('widdershins');
const yaml = require('js-yaml');
const Promise = require('bluebird');
const shins = require('shins');

class Plugin {

    constructor(data) {
        this.data = data;
        this.assets = [];
    }

    /**
     * Apply the plugin.
     *
     * @param {Object} compiler
     */
    apply(compiler) {
        compiler.plugin('emit', async (compilation, callback) => {
            compilation.fileDependencies.push(path.resolve(this.data.from));
            try {
                await this.run();
            } catch (err) {
                compilation.errors.push(err);
            }
            callback();
        });

        compiler.plugin('done', (stats) => {
            this.assets.forEach(asset => {
                Mix.manifest.add(asset.pathFromPublic());

                // Update the Webpack assets list for better terminal output.
                stats.compilation.assets[asset.pathFromPublic()] = {
                    size: () => asset.size(),
                    emitted: true
                };
            });
        })
    }


    async run() {
        this.loadApi();
        await this.toMarkdown();
        await this.render();
    }

    loadApi() {
        const {from} = this.data;
        const file = fs.readFileSync(path.resolve(from), 'utf8');
        this.api = yaml.safeLoad(file, {json: true});
        return this;
    }

    async toMarkdown() {
        this.markdown = await Promise.promisify(converter.convert)(this.api, this.data.options.widdershins);
        if (this.data.options.saveMarkdown) {
            fs.writeFileSync(this.getFilePath('md'), this.markdown, 'utf8');
            this.assets.push(new File(this.getFilePath('md')));
        }

    }

    async render() {
        this.html = await Promise.promisify(shins.render)(this.markdown, this.data.options.shins);
        fs.writeFileSync(this.getFilePath('html'), this.html, 'utf8');
        this.assets.push(new File(this.getFilePath('html')));
    }

    getFilePath(extension) {
        const file = path.basename(this.data.from, '.yml');
        return path.resolve(this.data.to + '/' + file + '.' + extension);
    }
}

module.exports = Plugin;