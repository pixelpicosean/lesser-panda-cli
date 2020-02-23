'use strict';

const BASE_PORT = 4000;

const path = require('path');
const portfinder = require('portfinder');
portfinder.basePort = BASE_PORT;

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const colors = require('colors/safe');
const cliPrefix = require('./utils').cliPrefix;

const es5Loader = require('./es5Loader');
const tsLoader = require('./tsLoader');

const services = [
  require('./service/standalone_image_sync'),
  require('./service/bmfont_convert'),
]

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

function server(gameDir, port, param) {
  const ipAddress = getIPAddress();
  const fullAddress = `${ipAddress}:${port}`;

  const es5 = (param.indexOf('-es5') >= 0);
  const ts = (param.indexOf('-ts') >= 0);

  const config = {
    mode: 'development',
    entry: {
      game: [
        path.resolve(gameDir, `src/game/main.${ts ? "ts" : "js"}`),
      ],
    },
    output: {
      path: path.resolve(gameDir, 'dist'),
      filename: '[name].js',
    },
    devtool: 'source-map',
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
        path.join(process.cwd(), 'node_modules'),
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(gameDir, 'index.html'),
        inject: 'body',
      }),
    ],
  };

  if (es5) {
    config.module.rules.unshift(es5Loader(gameDir, cjs));
  } else if (ts) {
    config.module.rules.unshift(tsLoader(gameDir));
  }

  const compiler = webpack(config);

  const devServer = new WebpackDevServer(compiler, {
    hot: false,

    quiet: false,
    noInfo: false,
    lazy: false,

    disableHostCheck: true,
    contentBase: gameDir,

    stats: 'errors-warnings',
  });

  devServer.listen(port, null, function() {
    console.log(cliPrefix + colors.green(` Server(v${require('./package.json').version}${ts ? "- TypeScript" : ""}) is starting...`));
    console.log(cliPrefix + colors.bold(` Access URLS:`));
    console.log(colors.grey('--------------------------------------'));
    console.log(`      Local: ${colors.magenta('http://localhost:' + port)}`);
    console.log(`   External: ${colors.magenta('http://' + fullAddress)}`);
    console.log(colors.grey('--------------------------------------'));
  });

  // start services
  services.forEach(service => service(gameDir))
}

module.exports = function(gameDir, callback, param) {
  if (param.indexOf('-p') >= 0 || param.indexOf('--port') >= 0) {
    const port_idx = Math.max(param.indexOf('-p'), param.indexOf('--port')) + 1;
    const port = parseInt(param[port_idx]);
    if (Number.isFinite(port)) {
      portfinder.basePort = port;
    }
  }

  portfinder.getPort(function(err, realPort) {
    if (err) {
      callback(err);
    }
    server(gameDir, realPort, param);
  });
};
