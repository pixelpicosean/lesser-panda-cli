'use strict';

const path = require('path');

const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const rimraf = require('rimraf');

const colors = require('colors/safe');
const cliPrefix = require('./utils').cliPrefix;

const es5Loader = require('./es5Loader');

function build(gameDir, callback, param) {
  process.env.NODE_ENV = 'production';

  console.log(`${cliPrefix} Start to build...`);

  const minify = param.indexOf('-u') < 0;
  const es5 = (param.indexOf('-es5') >= 0);

  const config = {
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
          exclude: [
            path.resolve(gameDir, 'src/engine/audio/hower.core.js'),
            path.resolve(gameDir, 'src/engine/polyfill'),
          ],
          loader: 'babel',
          query: {
            presets: [],
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

  // Need to transpile to ES5?
  if (es5) {
    config.module.loaders[0].query.presets.push([path.join(__dirname, 'node_modules/babel-preset-es2015'), { loose: true }]);

    // Uglify does not support ES6 for now, so we move it here
    if (minify) {
      config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
          screw_ie8: true,
        },
      }));
    }
  }

  // Cleanup dist folder before compile
  rimraf(path.resolve(gameDir, 'dist'), function(err) {
    // Compile and build JavaScript
    const compiler = webpack(config);
    compiler.run(function(err, stats) {
      if (err) {
        callback(err);
      }
      console.log(`${cliPrefix} ${colors.green('Build complete!')}`);
    });
  });
}

module.exports = build;
