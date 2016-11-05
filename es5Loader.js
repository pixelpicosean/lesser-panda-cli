var path = require('path');

module.exports = function(gameDir) {
  return {
    test: /\.js$/,
    include: path.resolve(gameDir, 'src'),
    exclude: [
      path.resolve(gameDir, 'src/engine/audio/hower.core.js'),
      path.resolve(gameDir, 'src/engine/polyfill'),
    ],
    loader: 'babel',
    query: {
      presets: [
        [path.join(__dirname, 'node_modules/babel-preset-es2015'), { loose: true }],
      ],
      plugins: [
        [path.join(__dirname, 'node_modules/babel-plugin-transform-strict-mode'), { strict: true }],
      ],
    },
  };
};
