'use strict';

const path = require('path');

const webpack = require('webpack');
const rimraf = require('rimraf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Obfuscator = require('webpack-obfuscator');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const colors = require('colors/safe');
const cliPrefix = require('./utils').cliPrefix;

const es5Loader = require('./es5Loader');

const copyFileList = [
  { from: 'media', to: 'media' },
];

function build(gameDir, callback, param) {
  console.log(`${cliPrefix} Start to build...`);

  const es5 = (param.indexOf('-es5') >= 0);
  const engine_lib = (param.indexOf('-lib') >= 0);
  const bundle_analyze = (param.indexOf('-analyze') >= 0);
  const obfuscate = (param.indexOf('-obfuscate') >= 0);

  const config = {
    mode: 'production',
    entry: {
      game: path.resolve(gameDir, 'src/game/main.js'),
    },
    output: {
      path: path.resolve(gameDir, 'dist'),
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(gameDir, 'index.html'),
        inject: 'body',
      }),
      new CopyWebpackPlugin(copyFileList),
    ],
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
        path.join(gameDir, 'assets'),
        path.join(gameDir, 'node_modules'),
        path.join(__dirname, 'node_modules'),
      ],
    },
  };

  // Need to transpile to ES5?
  if (es5) {
    config.module.rules.unshift(es5Loader(gameDir));
  }

  if (engine_lib) {
    config.entry = {
      engine: path.resolve(gameDir, 'src/engine/index.js'),
    };
    config.output = {
      path: path.resolve(gameDir, 'dist'),
      // export itself to a global var
      libraryTarget: "var",
      // name of the global var: "v"
      library: "v",
    };
  }

  if (obfuscate) {
    config.plugins.push(new Obfuscator({}))
  }

  if (bundle_analyze) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  // Cleanup dist folder before compile
  rimraf(path.resolve(gameDir, 'dist'), function(err) {
    if (err) {
      console.log(err);
      console.log(`${colors.red('Build failed!')}`);
    } else {
      // Compile and build JavaScript
      const compiler = webpack(config);
      compiler.run(function (err, stats) {
        if (err) {
          callback(err);
        }
        console.log(`${cliPrefix} ${colors.green('Build complete!')}`);
      });
    }
  });
}

module.exports = build;
