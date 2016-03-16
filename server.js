'use strict';

var path = require('path');

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');

function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }
  return '0.0.0.0';
}

// TODO: find an available port or manually set one
var port = 4000;
var fullAddress = getIPAddress() + ':' + port;

function server(gameDir) {
  var config = {
    devtool: '#eval-source-map',
    entry: {
      app: [
        'webpack-dev-server/client?http://' + fullAddress,
        path.resolve(gameDir, 'src/game/main.js')
      ],
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
          test: /\.js$/,
          include: path.resolve(gameDir, 'src'),
          exclude: /src\/engine/,
          loader: 'babel',
          query: {
            presets: [
              path.join(__dirname, 'node_modules/babel-preset-es2015'),
              path.join(__dirname, 'node_modules/babel-preset-stage-2'),
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
        {
          test: /\.jpg|\.png$/,
          loader: 'file-loader',
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
  devServer.listen(port, null, function() {
    // TODO: purple "LP" and red url
    console.log('[LP] Server started:');
    console.log(' --------------------------');
    console.log(' URL: http://' + fullAddress);
    console.log(' --------------------------\n');
  });
}

module.exports = server;
