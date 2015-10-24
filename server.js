'use strict';

var path = require('path');

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');

// TODO: find an available port or manually set one
var port = 4000;

function server(gameDir) {
  var config = {
    devtool: 'eval-source-map',
    entry: {
      app: path.resolve(gameDir, 'src/game/main.js'),
    },
    output: {
      path: path.resolve(gameDir, 'dist'),
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: gameDir,
    },
    plugins: [
      new HTMLWebpackPlugin({
        reloadScript: 'http://localhost:' + port + '/webpack-dev-server.js',
        template: path.resolve(gameDir, 'index.html'),
        inject: 'body',
        filename: 'index.html'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
    module: {
      loaders: [
        {
          test: /\.js?$/,
          exclude: /node_modules|engine\/pixi/,
          loader: 'babel'
        },
        {
          test: /\.vert|\.frag$/,
          exclude: /node_modules/,
          loader: 'raw'
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

  var compiler = webpack(config);

  var devServer = new WebpackDevServer(compiler, {
    hot: false,

    quiet: false,
    noInfo: false,
    lazy: false,

    stats: {
      colors: true,
    },
  });
  devServer.listen(port, "localhost", function() {
    // TODO: purple "LP" and red url
    console.log('[LP] Server started:');
    console.log(' --------------------------');
    console.log(' URL: http://localhost:4000');
    console.log(' --------------------------\n');
  });
}

module.exports = server;
