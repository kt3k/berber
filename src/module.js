const Berber = require('./berber')

const berber = new Berber()

exports.name = name => berber.setName(name)
exports.configName = name => berber.setConfigName(name)
exports.asset = (a, b, c, d, e, f, g) => { berber.asset(a, b, c, d, e, f, g) }
exports.on = (ev, cb) => { berber.on(ev, cb) }
exports.dest = dest => berber.dest(dest)
exports.base = base => berber.base(base)
exports.port = port => berber.port(port)
exports.debugPageTitle = title => berber.debugPageTitle(title)
exports.debugPagePath = path => berber.debugPagePath(path)
exports.loggerTitle = title => berber.loggerTitle(title)
exports.main = argv => berber.main(argv)
