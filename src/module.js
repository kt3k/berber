const Berber = require('./berber')
const bulbo = require('bulbo')

const berber = new Berber()

exports.name = name => berber.setName(name)
exports.configName = name => berber.setConfigName(name)
exports.asset = (...args) => berber.asset(...args)
exports.on = (ev, cb) => { berber.on(ev, cb) }
exports.dest = dest => berber.dest(dest)
exports.base = base => berber.base(base)
exports.port = port => berber.port(port)
exports.debugPageTitle = title => berber.debugPageTitle(title)
exports.debugPagePath = path => berber.debugPagePath(path)
exports.loggerTitle = title => berber.loggerTitle(title)
exports.main = argv => berber.main(argv)
exports.setLogger = logger => bulbo.setLogger(logger)
exports.helpMessage = helpMessage => { berber.helpMessage = helpMessage }
exports.action = (name, description, cb) => berber.addAction(name, description, cb)
exports.addMiddleware = middleware => bulbo.addMiddleware(middleware)

// Access to internal berber instance
exports.instance = berber
