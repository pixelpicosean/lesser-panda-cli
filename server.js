'use strict';

var BASE_PORT = 4000;
var PROXY_PORT = 4100;

var path = require('path');
var portfinder = require('portfinder');
portfinder.basePort = BASE_PORT;

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var colors = require('colors/safe');

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

function server(gameDir, port, proxyPort) {
  var ipAddress = getIPAddress();
  var fullAddress = ipAddress + ':' + port;

  var config = {
    devtool: '#eval-source-map',
    entry: {
      app: [
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
    watch: true,
    plugins: [
      new HTMLWebpackPlugin({
        template: path.resolve(gameDir, 'index.html'),
        inject: 'body',
        filename: 'index.html'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      new BrowserSyncPlugin({
        host: process.env.IP || 'localhost',
        port: process.env.PORT || port,
        proxy: 'http://' + ipAddress + ':' + proxyPort,
        open: false,
        reload: true,
        ghostMode: false,
        logLevel: 'silent',
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
        {
          test: /\.jpg|\.png$/,
          loader: 'file-loader',
        },
      ],
    },
    resolve: {
      root: path.join(gameDir, 'src'),
      // fallback: path.join(__dirname, 'node_modules'),
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
      assets: false,
      colors: true,
      version: false,
      timings: true,
      hash: false,
      chunks: false,
      chunkModules: false,
    },
  });

  devServer.listen(proxyPort, null, function() {
    console.log('[' + colors.blue('LP') + ']' + colors.green(' Server starting...'));
    console.log('[' + colors.blue('LP') + ']' + colors.bold(' Access URLS:'));
    console.log(colors.grey('--------------------------------------'));
    console.log('      Local: ' + colors.magenta('http://localhost:' + port));
    console.log('   External: ' + colors.magenta('http://' + fullAddress));
    console.log(colors.grey('--------------------------------------'));
  });
}

module.exports = function(gameDir, callback) {
  portfinder.getPort(function(err, realPort) {
    if (err) {
      callback(err);
    }
    portfinder.basePort = PROXY_PORT;
    portfinder.getPort(function(err, proxyPort) {
      if (err) {
        callback(err);
      }
      server(gameDir, realPort, proxyPort);
    });
  });
};
