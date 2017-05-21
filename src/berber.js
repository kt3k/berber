const path = require('path')
const EventEmitter = require('events')
const bulbo = require('bulbo')
const { select } = require('action-selector')
const chalk = require('chalk')
const callsites = require('callsites')
const findRoot = require('find-root')

bulbo.loggerTitle('berber')

class Berber extends EventEmitter {
  /**
   * @param {object} argv
   * @param {string} callsite The place where berber is required
   */
  main (argv, callsite) {
    if (!this.name) {
      throw new Error('Name is not specified. you have to name your command by berber.name(name).')
    }

    this.argv = argv
    this.callsite = callsite

    const v = argv.v
    const h = argv.h
    const version = argv.version
    const help = argv.help
    const action = argv._[0]

    select(this, {
      version: v || version,
      help: h || help,
      serve: !action,
      [action]: true
    })
    .on('action', action => action.call(this))
    .on('no-action', name => this.noAction(name))
  }

  noAction (name) {
    console.log(chalk.red('Error:'), `'${name}' is not a ${this.name} command. See '${this.name} --help'.`)
    process.exit(1)
  }

  'action:help' () {
    const version = this.getVersion()
    const name = this.name
    console.log(`
${name}@${version}

Usage:
  ${name} -h|--help    Shows the help message
  ${name} -v|--version Shows the version number
  ${name} serve        Serves all the assets at localhost
  ${name} build        Builds all the assets to the dest

See https://npm.im/${name} for more details.`.trim())
  }

  'action:version' () {
    const version = this.getVersion()
    const name = this.name

    console.log(`${name}@${version}`)
  }

  'action:build' () {
    this.getConfig().then(() => {
      this.checkEmpty()

      bulbo.build()
    }).catch(e => console.log(e.stack || e))
  }

  'action:serve' () {
    this.getConfig().then(() => {
      this.checkEmpty()

      bulbo.serve()
    }).catch(e => console.log(e.stack || e))
  }

  checkEmpty () {
    if (bulbo.isEmpty()) {
      throw new Error('No asset is deifned. You have to set at least one asset by berber.asset(...paths).')
    }
  }

  /**
   * Gets the config name.
   * @return {string}
   */
  getConfigName () {
    return this.configName || this.name
  }

  /**
   * Gets the config.
   * @return {Promise<Object>}
   */
  getConfig () {
    const configName = this.getConfigName()
    const configIsOptional = true
    const moduleIsOptional = true

    return bulbo
      .cli
      .liftoff(this.name, { configName, configIsOptional, moduleIsOptional })
      .then(({ config }) => {
        this.emit('config', config)
      })
  }

  /**
   * Gets the package.json from the user project.
   * @return {object}
   */
  getUserPackage () {
    return require(path.join(findRoot(this.callsite), 'package.json'))
  }

  getVersion () {
    return this.getUserPackage().version
  }

  /**
   * Sets the generator name.
   * @param {string} name The name of the generator
   */
  setName (name) {
    // 0 - here
    // 1 - src/index.js
    // 2 - a script in the user's project
    this.callsite = callsites()[2].getFileName()

    this.name = name
  }

  /**
   * Sets the config name.
   * @param {string} name The name
   */
  setConfigName (name) {
    this.configName = name
  }

  asset (...args) {
    return bulbo.asset(...args)
  }

  dest (dest) {
    bulbo.dest(dest)
  }

  base (base) {
    bulbo.base(base)
  }

  port (port) {
    bulbo.port(port)
  }

  debugPageTitle (title) {
    bulbo.debugPageTitle(title)
  }

  debugPagePath (path) {
    bulbo.debugPagePath(path)
  }

  loggerTitle (title) {
    bulbo.loggerTitle(title)
  }
}

module.exports = Berber
