'use strict';

const fs = require('fs');
const download = require('download');
const path = require('path');

const colors = require('colors/safe');
const utils = require('./utils');

const cliPrefix = utils.cliPrefix;
const rmdir = utils.rmdir;

const engineUrl = 'https://github.com/pixelpicosean/voltar/archive/develop.zip';

function create(dir, callback, params) {
  const folder = params[0];
  if (!folder) return callback(`${cliPrefix} ${colors.red('Project name not set!')}`);
  console.log(`${cliPrefix} Creating project "${folder}"`);

  const projectFolder = `${dir}/${folder}`;

  function createProject() {
    fs.mkdir(projectFolder, function(err) {
      if (err) return callback(`${cliPrefix} ${colors.red('Error creating project folder: ' + projectFolder)}`);

      // TODO: cache
      const wget = download(engineUrl, projectFolder, {
        extract: true,
        strip: 1,
      });

      wget.then(function() {
        console.log(`${cliPrefix} ${colors.green('Project "' + folder + '" created!')}`);
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

module.exports = create;
