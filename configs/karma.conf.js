/* globals module */

// Karma configuration
// Generated on Fri May 13 2016 20:43:12 GMT+0200 (CEST)

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../dist',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: ['index.test.js'],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'index.test.js': ['sourcemap'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'karma-remap-istanbul'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    plugins: [
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-remap-istanbul'
    ],

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    remapIstanbulReporter: {
      remapOptions: {}, //additional remap options
      reportOptions: {}, //additional report options
      reports: {
        lcovonly: 'test/coverage/lcov.info',
        html: 'test/coverage/report',
        text: ''
      }
    }
  });
};
