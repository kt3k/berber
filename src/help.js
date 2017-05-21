const pkg = require('../../package')

/**
 * Shows the help message.
 */
module.exports = () => {
  console.log(`
domaindoc@${pkg.version}

Usage:
  domaindoc -h|--help    Shows the help message
  domaindoc -v|--version Shows the version number
  domaindoc serve        Serves all the assets at localhost
  domaindoc build        Builds all the assets to the dest

See https://npm.im/domaindoc/ for more details.
`.trim())
}
