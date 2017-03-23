'use strict';

const path = require('path');

const webpack = require('webpack');
const rimraf = require('rimraf');

const colors = require('colors/safe');
const cliPrefix = require('./utils').cliPrefix;

const es5Loader = require('./es5Loader');

function build(gameDir, callback, param) {
  console.log(`${cliPrefix} Start to build...`);

  const minify = param.indexOf('-u') < 0;
  const es5 = (param.indexOf('-es5') >= 0);

  const config = {
    entry: {
      game: path.resolve(gameDir, 'src/game/main.js'),
    },
    output: {
      path: path.resolve(gameDir, 'dist'),
      filename: '[name].js',
    },
    plugins: [],
    module: {
      rules: [
        // Shaders
        {
          test: /\.(vert|frag|vs|fs)$/,
          include: [path.resolve(gameDir, 'src')],
          loader: require.resolve('raw-loader'),
        },
        // Styles
        {
          test: /\.css$/,
          include: [path.resolve(gameDir, 'src')],
          use: [
            {
              loader: require.resolve('style-loader'),
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: true,
              },
            },
          ],
        },
        // Images, will be convert to data url if less than 10kb
        // Note: use `require()` to fetch
        {
          test: /\.(jpg|png|gif)$/,
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
              },
            },
          ],
        },
        // Fonts
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                mimetype: 'application/font-woff',
              },
            },
          ],
        },
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                mimetype: 'application/font-woff',
              },
            },
          ],
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                mimetype: 'application/octet-stream',
              },
            },
          ],
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: [require.resolve('file-loader')],
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                mimetype: 'image/svg+xml',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      modules: [
        path.join(gameDir, 'src'),
        path.join(gameDir, 'node_modules'),
        path.join(__dirname, 'node_modules'),
      ],
    },
  };

  // Need to transpile to ES5?
  if (es5) {
    config.module.rules.push(es5Loader(gameDir));

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
