'use strict';

const BASE_PORT = 4000;

const path = require('path');
const portfinder = require('portfinder');
portfinder.basePort = BASE_PORT;

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const colors = require('colors/safe');
const cliPrefix = require('./utils').cliPrefix;

const es5Loader = require('./es5Loader');

function getIPAddress() {
  const interfaces = require('os').networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }
  return '0.0.0.0';
}

function server(gameDir, port, es5) {
  const ipAddress = getIPAddress();
  const fullAddress = `${ipAddress}:${port}`;

  const config = {
    entry: {
      game: [
        // Live-reload
        `webpack-dev-server/client?http://${fullAddress}`,
        // Game entry
        path.resolve(gameDir, 'src/game/main.js'),
      ],
    },
    output: {
      path: path.resolve(gameDir, 'dist'),
      filename: '[name].js',
    },
    devtool: 'source-map',
    devServer: {
      contentBase: gameDir,
    },
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
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
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
              loader: 'url-loader',
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
              loader: 'url-loader',
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
              loader: 'url-loader',
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
              loader: 'url-loader',
              options: {
                limit: 10000,
                mimetype: 'application/octet-stream',
              },
            },
          ],
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: ['file-loader'],
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
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

  if (es5) {
    config.module.rules.push(es5Loader(gameDir));
  }

  const compiler = webpack(config);

  const devServer = new WebpackDevServer(compiler, {
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
    console.log(`      Local: ${colors.magenta('http://localhost:' + port)}`);
    console.log(`   External: ${colors.magenta('http://' + fullAddress)}`);
    console.log(colors.grey('--------------------------------------'));
  });
}

module.exports = function(gameDir, callback, param) {
  const es5 = (param.indexOf('-es5') >= 0);

  portfinder.getPort(function(err, realPort) {
    if (err) {
      callback(err);
    }
    server(gameDir, realPort, es5);
  });
};
