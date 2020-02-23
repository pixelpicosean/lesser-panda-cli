'use strict';

const path = require('path');

module.exports = function(gameDir) {
  return {
    test: /\.ts$/,
    include: path.resolve(gameDir, 'src'),
    use: [
      {
        loader: require.resolve('ts-loader'),
      },
    ],
  };
};
