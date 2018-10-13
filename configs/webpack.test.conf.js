const constants = require('./constants');
const webpackBase = require('./webpack.base.conf');
const defaultWebpack = require('plusnew-webpack-config').test('plusnew', constants.baseDirectory);

module.exports = {
  ...defaultWebpack,
  module: {
    ...defaultWebpack.module,
    rules: defaultWebpack.module.rules.map((rule) => {
      const interfaceDirectory = /src\/interfaces/;
      if (rule.loader === 'istanbul-instrumenter-loader') {
        return {
          ...rule,
          exclude: [
            ...rule.exclude,
            interfaceDirectory
          ],
        }
      }
      return rule;
    })
  },
  plugins: [
    ...defaultWebpack.plugins,
    ...webpackBase.plugins
  ],
};
