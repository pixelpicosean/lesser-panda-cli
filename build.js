'use strict';

var path = require('path');

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var rimraf = require('rimraf');

var colors = require('colors/safe');
var cliPrefix = require('./utils').cliPrefix;

function build(gameDir, callback, param) {
  process.env.NODE_ENV = 'production';

  console.log(cliPrefix + ' Start to build...');

  var minify = param.indexOf('-u') < 0;

  var config = {
    entry: {
      app: path.resolve(gameDir, 'src/game/main.js'),
    },
    output: {
      path: path.resolve(gameDir, 'dist'),
      filename: 'game.min.js',
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new HTMLWebpackPlugin({
        template: path.resolve(gameDir, 'index.html'),
        inject: 'body',
        filename: 'index.html',
        minify: {
          removeComments: true,
        },
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: path.resolve(gameDir, 'src'),
          exclude: /src\/engine/,
          loader: 'babel',
          query: {
            presets: [
              [path.join(__dirname, 'node_modules/babel-preset-es2015'), { loose: true }],
            ],
            plugins: [
              [path.join(__dirname, 'node_modules/babel-plugin-transform-strict-mode'), { strict: true }],
            ],
          },
        },
        {
          test: /\.vert|\.frag$/,
          include: path.resolve(gameDir, 'src/engine'),
          loader: 'raw',
        },
        {
          test: /\.css$/,
          include: path.resolve(gameDir, 'src'),
          loader: 'style!css-loader?modules',
        },
      ],
    },
    resolve: {
      root: path.join(gameDir, 'src'),
    },
    resolveLoader: {
      root: path.join(__dirname, 'node_modules'),
    },
  };

  if (minify) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true,
      },
    }));
  }

  // Cleanup dist folder before compile
  rimraf(path.resolve(gameDir, 'dist'), function(err) {
    // Compile and build JavaScript
    var compiler = webpack(config);
    compiler.run(function(err, stats) {
      if (err) {
        callback(err);
      }
      console.log(cliPrefix + colors.green(' Build complete!'));
    });
  });
}

module.exports = build;
