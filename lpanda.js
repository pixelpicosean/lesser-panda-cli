#!/usr/bin/env node
const lpanda = require('./index');
const command = process.argv[2];

if (!lpanda[command]) command = 'help';

lpanda[command](process.cwd(), function(err) {
  if (err) console.log(err);
  else console.log('Done');
}, process.argv.splice(3));
