'use strict';

var fs = require('fs');
var download = require('download');
var path = require('path');

var colors = require('colors/safe');
var utils = require('./utils');

var cliPrefix = utils.cliPrefix;
var rmdir = utils.rmdir;

var engineUrl = 'https://github.com/pixelpicosean/lesser-panda/archive/master.zip';

function create(dir, callback, params) {
  var folder = params[0];
  if (!folder) return callback(cliPrefix + colors.red(' Project name not set!'));
  console.log(cliPrefix + ' Creating project "' + folder + '"');

  var projectFolder = dir + '/' + folder;

  function createProject() {
    fs.mkdir(projectFolder, function(err) {
      if (err) return callback(cliPrefix + colors.red(' Error creating project folder: ' + projectFolder));

      // TODO: cache
      var wget = download(engineUrl, projectFolder, {
        extract: true,
        strip: 1,
      });

      wget.then(function() {
        console.log(cliPrefix + colors.green(' Project "' + folder + '" created!'));
      });

      wget.on('error', function(err) {
        rmdir(projectFolder);
        return callback(colors.red('Error downloading engine'));
      });
    });
  };

  fs.readdir(dir, function(err, files) {
    if (files) {
      if (files.indexOf(folder) > -1) {
        return callback(colors.red('Project folder already exists'));
      }
    }

    createProject();
  });
};

module.exports = exports = create;
