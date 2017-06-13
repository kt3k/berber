const { it, describe } = require('kocha')
const { execSync } = require('child_process')
const { join } = require('path')
const { existsSync } = require('fs')
const assert = require('assert')

describe('hello example', () => {
  const root = join(__dirname, 'examples', 'hello')

  it('builds', () => {
    execSync('node index.js build', { cwd: root })
    assert(existsSync(join(root, 'dest')))
  })

  it('does not throw with --help option', () => {
    execSync('node index.js -h', { cwd: root })
    execSync('node index.js --help', { cwd: root })
  })

  it('does not throw with --version option', () => {
    execSync('node index.js -v', { cwd: root })
    execSync('node index.js --version', { cwd: root })
  })

  it('does not throw with hello command', () => {
    execSync('node index.js hello', { cwd: root })
  })

  it('throws with invalid action name', () => {
    assert.throws(() => {
      execSync('node index.js swing', { cwd: root })
    }, Error)
  })
})

describe('no name example', () => {
  const root = join(__dirname, 'examples', 'no-name')

  it('throws', () => {
    assert.throws(() => {
      execSync('node index.js build', { cwd: root })
    }, Error)
  })
})

describe('empty example', () => {
  const root = join(__dirname, 'examples', 'empty')

  it('throws at build', () => {
    assert.throws(() => {
      execSync('node index.js build', { cwd: root })
    }, Error)
  })

  it('throws at serve', () => {
    assert.throws(() => {
      execSync('node index.js serve', { cwd: root })
    }, Error)
  })
})
