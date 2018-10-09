# Laravel Mix Shins

This extension provides support for generating API documentation from
Open Api Specification yaml file.

It uses:

1. [widdershins](https://github.com/Mermade/widdershins)
1. [shins](https://github.com/Mermade/shins)

## Usage


First, install the extension.

```shell
npm install laravel-mix-shins
```

Then, require it within your webpack.mix.js file, like so:

```js
let mix = require('laravel-mix');
require('laravel-mix-shins');

mix.shins('docs/api.yml', 'docs', {
    saveMarkdown: true,
    shins: {},
    widdershins: {
        tocSummary: true,
        language_tabs: [
            {shell: 'SHELL'},
        ]
    }
});
```

### Options

- `widdershins` - all available options for [widdershins](https://github.com/Mermade/widdershins)
- `shins` - all available options for [shins](https://github.com/Mermade/shins)
- `saveMarkdown` - should be saved generated markdown file (default `true`)

