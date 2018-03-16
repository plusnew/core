const config = require('./webpack.base.conf.js');
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const SOURCE_DIRECTORY = path.join(__dirname, '..', 'test');

const testfiles = ['./src/index.ts'];

function getTestFiles(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if(fs.statSync(filePath).isDirectory()) {
      getTestFiles(filePath);
    } else if(filePath.match(/.spec.(tsx|ts)/)) {
      testfiles.push('./' + filePath);
    }
  });
}

getTestFiles('test');

config.entry = testfiles//testfiles.map(testFile => testFile.slice(0, 4) === 'src/' ? testFile.slice(4) : '../' + testFile);
config.output.filename = 'index.test.js';

if(!config.plugins) config.plugins = [];

config.plugins.push(
  new webpack.SourceMapDevToolPlugin({
    filename: null, // if no value is provided the sourcemap is inlined
    test: /\.(ts|tsx)($|\?)/i // process .js and .ts files only
  })
);

// config.module.rules.push({
//   enforce: 'post',
//   test: /\.(ts|tsx)$/,
//   loader: 'istanbul-instrumenter-loader',
//   include: path.resolve('src/'),
//   exclude: /\.test\.(ts|tsx)$/,
// });

module.exports = config;
