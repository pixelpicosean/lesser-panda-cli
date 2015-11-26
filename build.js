'use strict';

var path = require('path');

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var rimraf = require('rimraf');

function build(gameDir) {
  process.env.NODE_ENV = 'production';

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
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
          screw_ie8: true,
        },
      }),
    ],
    module: {
      loaders: [
        // TODO: exclude whole engine folder but still uglify the result
        {
          test: /\.js$/,
          include: path.resolve(gameDir, 'src'),
          exclude: /node_modules|engine\/(async|canvas|earcut|eventemitter|howler|reactive|resource|pixi|polyfill)/,
          loader: 'babel',
        },
        {
          test: /\.vert|\.frag$/,
          include: path.resolve(gameDir, 'src/engine'),
          loader: 'raw',
        },
      ],
    },
    resolve: {
      root: path.join(gameDir, 'src'),
      fallback: path.join(__dirname, 'node_modules'),
    },
    resolveLoader: {
      root: path.join(__dirname, 'node_modules'),
    },
  };

  // Cleanup dist folder before compile
  rimraf(path.resolve(gameDir, 'dist'), function(err) {
    // Compile and build JavaScript
    var compiler = webpack(config);
    compiler.run(function(err, stats) {
      if (err) {
        throw err;
      }
      console.log('[LP] Build complete.');
    });
  });
}

module.exports = build;
