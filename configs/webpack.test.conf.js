const constants = require('./constants');
const testConfig =  require('plusnew-webpack-config').test('plusnew', constants.baseDirectory);

testConfig.module.rules.forEach((rule) => {
  if (rule.loader === 'istanbul-instrumenter-loader') {
    rule.exclude.push(/src\/interfaces/);
  }
});

module.exports = testConfig;
