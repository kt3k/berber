const minimisted = require('minimisted')
const berber = require('./src/module')

module.exports = berber

// The main starts at the next tick to allow user to configure berber in the first tick
Promise.resolve()
.then(() => berber.instance.checkName())
.then(() => berber.instance.getConfig())
.then(() => new Promise(resolve => minimisted(resolve)))
.then(argv => berber.main(argv))
.catch(e => {
  console.log(e.stack || e)
  process.exit(1)
})
