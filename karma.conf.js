var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = function(){return {}};

module.exports = function (config) {
  config.set({
    browsers: [ 'Chrome' ], //run in Chrome
    singleRun: true, //just run once by default
    frameworks: [ 'mocha' ], //use the mocha test framework
    files: [
      './tests.webpack.js' //just load this file
    ],
    preprocessors: {
      './public/dist/bundle.js': ['webpack'],
      './tests.webpack.js': [ 'webpack', 'sourcemap'], //preprocess with webpack and our sourcemap loader
      './test/frontend/frontend-unit-test.js': [ 'babel' ]
    },
    reporters: [ 'mocha', 'coverage' ], //report results in this format
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },
    coverageReporter: {
      type: 'html', //produces a html document after code is run
      dir: 'coverage/' //path to created html doc
    }
  });
};
