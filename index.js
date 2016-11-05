'use strict';

var commands = {
  build: 'Build project to "dist" folder, with "-u" to disable uglify, and "-es5" to transpile for ES5',
  create: 'Create new project',
  // update: 'Update engine',
  server: 'Start a dev server, with "-es5" to enable transpile to ES5, otherwise you need a ES2015 capatable browser',
};

var lpanda = {
  help: function() {
    var data = require('./package.json');
    console.log(data.description + ' ' + data.version);
    console.log('');
    console.log('Usage: lpanda <command> [options]');
    console.log('');
    console.log('Commands:');
    for (var name in commands) {
      console.log('       ' + name + '\t' + commands[name]);
    }
  },
};

for (var name in commands) {
  lpanda[name] = require('./' + name);
}

module.exports = lpanda;
