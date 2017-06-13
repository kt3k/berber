const berber = require('../../')

berber.name('hello')
berber.configName('hellofile')

berber.asset('source/**/*.md')

berber.action('hello', 'greetings', () => console.log('hello'))
berber.action('hey', () => console.log('hello'))
berber.debugPageTitle('hello')
berber.debugPagePath('hello')
berber.loggerTitle('hello')
berber.dest('dest')
berber.port(12355)
berber.base('source')
