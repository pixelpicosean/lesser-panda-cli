var colors = require('colors/safe');
var fs = require('fs');
var path = require('path');

module.exports.cliPrefix = '[' + colors.blue('LP') + ']';

module.exports.rmdir = function rmdir(dir) {
  var files = fs.readdirSync(dir);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(dir, files[i]);
    var stat = fs.statSync(filename);

    if (stat.isDirectory()) rmdir(filename);
    else fs.unlinkSync(filename);
  }
  fs.rmdirSync(dir);
};
