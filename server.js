'use strict';

var BASE_PORT = 4000;

var path = require('path');
var portfinder = require('portfinder');
portfinder.basePort = BASE_PORT;

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');

var colors = require('colors/safe');
var cliPrefix = require('./utils').cliPrefix;

var es5Loader = require('./es5Loader');

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

function server(gameDir, port, es5) {
  var ipAddress = getIPAddress();
  var fullAddress = ipAddress + ':' + port;

  var config = {
    devtool: '#source-map',
    entry: {
      app: [
        'webpack-dev-server/client?http://' + fullAddress,
        path.resolve(gameDir, 'src/game/main.js')
      ],
    },
    output: {
      path: path.resolve(gameDir, 'dist'),
      filename: 'game.dev.js'
    },
    devServer: {
      contentBase: gameDir,
    },
    watch: true,
    plugins: [
      new HTMLWebpackPlugin({
        template: path.resolve(gameDir, 'index.html'),
        inject: 'body',
        cache: true,
        hash: true,
        showErrors: true,
        filename: 'index.html',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
    module: {
      loaders: [
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

  if (es5) {
    config.module.loaders.push(es5Loader(gameDir));
  }

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

  devServer.listen(port, null, function() {
    console.log(cliPrefix + colors.green(' Server(v' + require('./package.json').version + ') is starting...'));
    console.log(cliPrefix + colors.bold(' Access URLS:'));
    console.log(colors.grey('--------------------------------------'));
    console.log('      Local: ' + colors.magenta('http://localhost:' + port));
    console.log('   External: ' + colors.magenta('http://' + fullAddress));
    console.log(colors.grey('--------------------------------------'));
  });
}

module.exports = function(gameDir, callback, param) {
  var es5 = (param.indexOf('-es5') >= 0);

  portfinder.getPort(function(err, realPort) {
    if (err) {
      callback(err);
    }
    server(gameDir, realPort, es5);
  });
};
