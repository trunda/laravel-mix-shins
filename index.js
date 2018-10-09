const mix = require('laravel-mix');
const Plugin = require('./plugin');

class Shins {
    dependencies() {
        return ['shins', 'widdershins', 'js-yaml', 'bluebird']
    }

    register(from = './docs/api.yml', to = './docs', options = {}) {
        options = Object.assign({}, {
            saveMarkdown: true,
            widdershins: {},
            shins: {}
        }, options);

        options.shins.inline = true;
        options.shins.unsafe = true;
        options.widdershins.verbose = false;

        this.data = { from, to, options };
    }

    webpackPlugins() {
        return new Plugin(this.data);
    }
}

mix.extend('shins', new Shins());
