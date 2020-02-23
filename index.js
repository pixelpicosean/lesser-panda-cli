'use strict';

const commands = {
  build: 'Build project to "dist" folder\n\t\t"-es5" to transpile for ES5\n\t\t"-lib" for engine only bundle\n\t\t"-analyze" for bundle analyze\n\t\t"-obfuscate" for code obfuscation',
  create: 'Create new project',
  // update: 'Update engine',
  server: 'Start a dev server\n\t\t"-es5" to enable transpile to ES5,\n\t\totherwise you need a ES2015 capatable browser',
};

const voltar = {
  help: function() {
    const data = require('./package.json');
    console.log(`${data.description} ${data.version}`);
    console.log('');
    console.log('Usage: voltar <command> [options]');
    console.log('');
    console.log('Commands:');
    for (let name in commands) {
      console.log(`    ${name}\t${commands[name]}\n`);
    }
  },
};

for (let name in commands) {
  voltar[name] = require(`./${name}`);

  // alias
  voltar['start'] = voltar['server']
}

module.exports = voltar;
