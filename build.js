'use strict';

var path = require('path');

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var rimraf = require('rimraf');

function build(gameDir, callback, param) {
  process.env.NODE_ENV = 'production';

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
              path.join(__dirname, 'node_modules/babel-preset-es2015'),
            ],
            plugins: [
              [path.join(__dirname, 'node_modules/babel-plugin-transform-class-properties'), { loose: true }],
              [path.join(__dirname, 'node_modules/babel-plugin-transform-es2015-classes'), { loose: true }],
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
      fallback: path.join(__dirname, 'node_modules'),
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
      console.log('[LP] Build complete.');
    });
  });
}

module.exports = build;
