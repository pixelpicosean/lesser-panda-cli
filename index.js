'use strict';

const commands = {
  build: 'Build project to "dist" folder, "-u" to disable uglify, "-es5" to transpile for ES5',
  create: 'Create new project',
  // update: 'Update engine',
  server: 'Start a dev server, "-es5" to enable transpile to ES5, otherwise you need a ES2015 capatable browser',
};

const lpanda = {
  help: function() {
    const data = require('./package.json');
    console.log(`${data.description} ${data.version}`);
    console.log('');
    console.log('Usage: lpanda <command> [options]');
    console.log('');
    console.log('Commands:');
    for (let name in commands) {
      console.log(`       ${name}\t${commands[name]}`);
    }
  },
};

for (let name in commands) {
  lpanda[name] = require(`./${name}`);
}

module.exports = lpanda;
