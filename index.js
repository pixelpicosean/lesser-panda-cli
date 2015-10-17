#!/usr/bin/env node

var path = require('path');

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');

// TODO: find an available port
var port = 4000;
var gameDir = process.cwd();

var config = {
  devtool: 'eval-source-map',
  entry: {
    app: [
      path.resolve(gameDir, 'game/main.js')
    ]
  },
  output: {
    path: path.resolve(gameDir, 'dist'),
    publicPath: 'http://localhost:4000/',
    filename: 'bundle.js'
  },
  plugins: [
    new HTMLWebpackPlugin({
      reloadScript: 'http://localhost:' + port + '/webpack-dev-server.js',
      template: path.resolve(gameDir, 'index.html'),
      inject: 'body',
      filename: 'index.html'
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
    ]
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
};

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
  hot: false,

  quiet: false,
  noInfo: false,
  lazy: false,

  stats: {
    colors: true,
  },
});
server.listen(port, "localhost", function() {});
// server.close();
