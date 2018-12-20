'use strict';

const path = require('path');

module.exports = function(gameDir) {
  return {
    test: /\.js$/,
    include: path.resolve(gameDir, 'src'),
    exclude: [
      path.resolve(gameDir, 'src/engine/polyfill'),
    ],
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            [require.resolve('@babel/preset-env'), { loose: true }],
          ],
          "plugins": [
            require.resolve("@babel/plugin-transform-runtime"),
          ],
        },
      },
    ],
  };
};
