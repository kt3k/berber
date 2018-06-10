const path = require('path')
const EventEmitter = require('events')
const bulbo = require('bulbo')
const { select } = require('action-selector')
const chalk = require('chalk')
const callsites = require('callsites')
const findRoot = require('find-root')
const pad = require('pad-right')

bulbo.loggerTitle('berber')

class Berber extends EventEmitter {
  constructor () {
    super()
    this.actions = []
  }

  checkName () {
    if (!this.name) {
      throw new Error('Name is not specified. you have to name your command by berber.name(name).')
    }
  }

  /**
   * The entry point of berber program.
   * @param {object} argv
   */
  main (argv) {
    this.argv = argv

    const v = argv.v
    const h = argv.h
    const version = argv.version
    const help = argv.help
    const action = argv._[0]

    return new Promise(resolve => select(this, {
      version: v || version,
      help: h || help,
      serve: !action,
      [action]: true
    })
      .on('action', resolve)
      .on('no-action', name => this.noAction(name)))
    .then(action => action.call(this))
  }

  noAction (name) {
    console.log(chalk.red('Error:'), `'${name}' is not a ${this.name} command. See '${this.name} --help'.`)
    process.exit(1)
  }

  'action:help' () {
    this['action:version']()

    if (this.helpMessage) {
      console.log(this.helpMessage)
    } else {
      this.showDefaultHelpMessage()
    }
  }

  showDefaultHelpMessage () {
    const name = this.name
    console.log(`
Usage:
  ${name} -h|--help    Shows the help message
  ${name} -v|--version Shows the version number
  ${name} serve        Serves all the assets at localhost
  ${name} build        Builds all the assets to the dest`)

    this.actions.forEach(action => {
      console.log(`  ${name} ${pad(action.name, 12, ' ')} ${action.description}`)
    })

    console.log(`\nSee https://npm.im/${name} for more details.`)
  }

  'action:version' () {
    const version = this.getVersion()
    const name = this.name

    console.log(`${name}@${version}`)
  }

  'action:build' () {
    this.checkEmpty()

    bulbo.build()
  }

  'action:serve' () {
    this.checkEmpty()

    this.emit('serve')

    bulbo.serve()
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

    return bulbo.cli
      .liftoff(this.name, { configName, configIsOptional: true, moduleIsOptional: true })
      .then(({ config }) => { this.emit('config', config) })
  }

  /**
   * Gets the package.json from the user project.
   * @return {object}
   */
  getUserPackage () {
    return require(path.join(findRoot(this.callsite), 'package.json'))
  }

  /**
   * Gets the version number of the user project.
   * @return {string}
   */
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

  /**
   * Adds the action of the given name.
   * @param {string} name The action name
   * @param {string} description The description
   * @param {Function} cb The action callback
   */
  addAction (name, description, cb) {
    if (typeof description === 'function') {
      cb = description
      description = ''
    }

    this[`action:${name}`] = function () {
      cb(this.argv)
    }
    this.actions.push({ name, description })
  }

  /**
   * Creates and returns bulbo's AssetFacade object.
   * @param {string[]} args The list of the paths
   * @return {AssetFacade}
   */
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
