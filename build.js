var path = require('path');

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var rimraf = require('rimraf');

function build(gameDir) {
  process.env.NODE_ENV = 'production';

  var config = {
    entry: {
      app: [
        path.resolve(gameDir, 'game/main.js'),
      ]
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
        // TODO: add minify configs
      }),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
          screw_ie8: true,
        }
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ],
    module: {
      loaders: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel',
        },
      ],
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
