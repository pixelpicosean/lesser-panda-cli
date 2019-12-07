'use strict';

const path = require('path');

module.exports = function(gameDir, support_common_js) {
  return {
    test: /\.js$/,
    include: path.resolve(gameDir, 'src'),
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          "sourceType": support_common_js ? "unambiguous" : undefined, // enable this for commmonjs support
          presets: [
            [
              require.resolve('@babel/preset-env'), {
                // loose mode for performance
                loose: true,
                // https://github.com/browserslist/browserslist#best-practices
                targets: [
                  "last 2 major versions",
                  "> 0.2%",
                  "not dead",
                ],
              },
            ],
          ],
          "plugins": [
            [
              require.resolve("@babel/plugin-transform-runtime")
            ],
          ],
        },
      },
    ],
  };
};
