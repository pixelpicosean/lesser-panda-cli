#!/usr/bin/env node
const voltar = require('./index');
let command = process.argv[2];

if (!voltar[command]) command = 'help';

voltar[command](process.cwd(), function(err) {
  if (err) console.log(err);
  else console.log('Done');
}, process.argv.splice(3));
