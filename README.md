# berber v1.4.0

[![CircleCI](https://circleci.com/gh/kt3k/berber.svg?style=svg)](https://circleci.com/gh/kt3k/berber)
[![codecov](https://codecov.io/gh/kt3k/berber/branch/master/graph/badge.svg)](https://codecov.io/gh/kt3k/berber)
[![Greenkeeper badge](https://badges.greenkeeper.io/kt3k/berber.svg)](https://greenkeeper.io/)

> Static site generator generator on top of gulp ecosystem

Berber is a tool for creating your own **static site generator cli** with the combination of gulp plugins and/or gulp compatible transforms. There are lots of nice gulp plugins and utilities on npm, so most of transformations / transpilations / bundlings of static resources which are necessary for various kind of demands can be done by the existing plugins and modules. You can build your own static site generator for your specific demands with these abundant ecosystem and can automate lots of your build configuration tasks for static site building.

With berber, you can build static site generator with 2 main commands `build` and `serve`.Suppose your tool's name is `foobar`, then your command works as development server when called like `foobar serve`. It outputs static resources when called like `foobar build`. What you need to set up with berber is only your build pipelines using `berber.asset(paths)` method.

```js
const berber = require('berber')

berber.name('my-site-generator')

berber.asset('source/**/*.md').pipe(marked())
```

The above script works as cli. When called with `build` command like `script.js build`, then it outputs static resources to `build/` directory. When you want configure the output directory, then call `berber.dest(dest)` method:

```js
berber.dest('output')
```

When you want to this output path configurable by the user of your command, then bind to `config` event on `berber` object:

```js
const berber = require('berber')
const { asset, dest } = berber

berber.name('my-site-generator')

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

That's the basics of berber.

# Custom action

You can add the custom action by calling `berber.action`.

```js
berber.action('post', 'Post the new article', argv => {
  doSomething(argv)
})
```

The above adds the command `foobar post` (given that your module name is `foobar`) and when the user of your module hit the command `foobar post`, then the above doSomething(argv) is called, where argv is the cli options parsed by minimist.

# APIs

```js
const {
  name,
  configName,
  asset,
  on,
  dest,
  base,
  port,
  debugPageTitle,
  debugPagePath,
  loggerTitle,
  addMiddleware,
  action
} = require('berber')
```

## name(name)

- @param {string} name The name of your command

Sets the name of your command.

## configName(name)

- @param {string} name

Sets the name of your command's config file. Default is the same as the name.

## asset(...paths)

- @param {string[]} paths
- @return {AssetFacade}

Sets the asset from the given paths. You can build your pipeline by chaining `.pipe()` call to each asset. The returned value has the same interface as [bulbo][bulbo]'s asset interface. See [bulbo][bulbo]'s document for details.

## on(event, cb)

- @param {string} event
- @param {Function} cb

Binds cb to the given event.

Currently available events: `config`, `serve`

### `config` event

At `config` event, `cb` is called with given user config object. You can set assets, paths etc according to the user's configuration.

```js
berber.on('config', config => {
  berber.asset(`${config.source}/**/*.md`).pipe(marked())
})
```

In the above example, your command look for `${config.source}/**/*.md` as markdown sources, which means your command's user can configure the location where markdown files exist.

### `serve` event

This event happens when the berber start serving files. The features which only work on serve actions, like livereload, should be set up on this event.

## dest(path)

- @param {string} path

Sets the build destination path.

## base(path)

- @param {string} path

Sets the default basepath of your assets.

If the basepath is `src` and one of your assets is `src/js/foo/bar.js`, then it builds into `build/js/foo/bar/js`. If you change base to `src/js`, then it builds into `build/foo/bar.js`.

## port(port)

- @param {number} port

Sets the port number of the dev server.

This works for `serve` command.

## debugPageTitle(title)

- @param {string} title

Sets the title of the debug page.

This works for `serve` command.

## debugPagePath(path)

- @param {string} path

Sets the path of the debug page.

This works for `serve` command.

Example:
```js
debugPagePath('__mytool__')
// => This makes the debug page path to be `http://localhost:[port]/__mytool__`
```

The default of the debug page path is `__berber__`.

## loggerTitle(title)

- @param {string} title

Sets the title of the logger. Default is the same as `name` of your command.

## addMiddleware(middleware)

- @param {Function} middleware

Adds the connect compliant middleware to the server.

```
const livereload = require('connect-livereload')

addMiddleware(() => livereload())
```

## action(name, description, cb)

- @param {string} name The name of the action
- @param {string} description The description of the command. This appears in the help message of your command.
- @param {Function} cb The implementation of your command

Sets the custom action to your command. `cb` takes the command line options as an object which is parsed by `minimist`.

# Examples

- [hello example](https://github.com/kt3k/berber/blob/master/examples/hello/index.js)
- [domaindoc][domaindoc]
  - [domaindoc][domaindoc] is a static site generator for building documentation site of domain models of your software.
- [langsheet][langsheet]
  - [langsheet][langsheet] is a static site generator for building i18n phrase table.
- [remarker][remarker]
  - [remarker][remarker] is a static site generator for slideshow, which generates remark-based slideshow html from input markdown files.

# History

- 2018-06-10   v1.4.0   Added `serve` event.

# License

MIT

[domaindoc]: https://github.com/kt3k/domaindoc
[bulbo]: https://github.com/kt3k/bulbo
[langsheet]: https://github.com/kt3k/langsheet
[remarker]: https://github.com/kt3k/remarker
