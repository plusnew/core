const constants = require('./constants');
const webpackBase = require('./webpack.base.conf');
const defaultWebpack = require('plusnew-webpack-config').prod('plusnew', constants.baseDirectory);

module.exports = {
  ...defaultWebpack,
  plugins: [
    ...defaultWebpack.plugins,
    ...webpackBase.plugins
  ],
};
