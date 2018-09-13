const constants = require('./constants');
const webpackConfig = require('./webpack.test.conf');

module.exports = require('plusnew-karma-config')(constants.baseDirectory, webpackConfig);
