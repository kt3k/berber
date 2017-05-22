# berber v1.0.6

BADGES HERE

> Static site generator generator on top of gulp ecosystem

Berber is a tool for creating your own **static site generator cli** with the combination of gulp plugins and/or gulp compatible transforms. There are lots of nice gulp plugins and utilities on npm, so most of transformations / transpilations / bundlings of static resources which are necessary for various kind of demands can be done by the existing plugins and modules. You can build your own static site generator for your specific demands with these abundant ecosystem and can automate lots of your build configuration tasks for static site building.

With berber, you can build static site generator with 2 main commands `build` and `serve`.Suppose your tool's name is `foobar`, then your command works as development server when called like `foobar serve`. It outputs static resources when called like `foobar build`. What you need to set up with berber is only your build pipelines using `berber.asset(paths)` method.

```js
const { asset } = require('berber')

asset('source/**/*.md').pipe(marked())
```

The above script works as cli. When called with `build` command like `script.js build`, then it outputs static resources to `build/` directory. When you want configure the output directory, then call `berber.dest(dest)` method:

```js
const { dest } = require('berber')

dest('output')
```

When you want to this output path configurable by the user of your command, then bind to `config` event on `berber` object:

```js
const berber = require('berber')
const { asset, dest } = berber

berber.on('config', config => {
  const dest = config.dest || 'build'

  dest(dest)

  asset(...).pipe(...)
})
```

Here `asset()` chains to `.pipe` method. This `.pipe` call defines your pipeline for the assets. You can chain arbitrary number of pipes.

```js
const frontMatter = require('gulp-front-matter')
const marked = require('gulp-marked')
const layout1 = require('layout1')

berber.asset('source/**/*.md')
  .pipe(frontMatter({ property: 'data' })
  .pipe(marked())
  .pipe(layout1.nunjucks(path.join(__dirname, 'src/layout.njk'))
```

The above transforms the markdown files at `source/**/*.md` by 3 transforms; extracting frontmatters, transforming them to htmls and wrapping them with the nunjucks template `src/layout.njk`. This is similar to what `middleman` does to markdown files.

You can even define different kinds of starting points:

```js
berber.asset(paths.markdowns).pipe(...)
berber.asset(paths.css).pipe(...)
berber.asset(paths.js).pipe(...)
```

The above example transforms markdowns, stylesheets and javascripts with different pipelines for each resource.

# :cd: Install

Install via npm:

    npm i berber

First create your script like below:

```js
const path = require('path')
const berber = require('berber')

berber.on('config', config => {
  const source = config.source || 'source'
  const dest = config.dest || 'source'

  berber.asset(path.join(source, '**/*.md'))
    .pipe(marked())
    .pipe(yourAwesomeTransform())

  berber.dest(dest)
})

berber.name('foobar')
```

With the above settings, your tool's name is `foobar` and when the user of this script invokes it, it looks up the config file of the name `foobar.yml` `foobar.json` or `foobar.js`. (If you want to change the name of the config file from your tool's name, then use `berber.configName(name)` method.)

Then set the above script to `bin` property in your `package.json`.

```json
{
  ...
  "bin": {
    "foobar": "index.js"
  },
  ...
}
```

Then publish it to npm and your command works like the below:

```
./node_modules/.bin/foobar build # => builds your site
./node_modules/.bin/foobar serve # => serves your site with builtin dev server
```

That's it.

# Example

For an actual example, see [domaindoc][domaindoc]'s source code. [domaindoc][domaindoc] is a static site generator for building documentation site of domain models of your software.

# License

MIT

[domaindoc]: https://github.com/kt3k/domaindoc
