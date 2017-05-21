const minimisted = require('minimisted')
const berber = require('./src/module')

module.exports = berber

// The main starts at the next tick to allow user to configure berber in the first tick
setImmediate(() => { minimisted(argv => berber.main(argv)) })
