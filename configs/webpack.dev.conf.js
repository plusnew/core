const constants = require('./constants');
const webpackBase = require('./webpack.base.conf');
const defaultWebpack = require('plusnew-webpack-config').dev('plusnew', constants.baseDiretory)

module.exports = {
  ...defaultWebpack,
  plugins: [
    ...defaultWebpack.plugins,
    ...webpackBase.plugins
  ],
};
