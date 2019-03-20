'use strict';

module.exports = function(gameDir) {
  return { test: /\.ts$/, loader: require.resolve('awesome-typescript-loader') };
};
