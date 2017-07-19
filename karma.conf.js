var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = function(){return {}};

module.exports = function (config) {
  config.set({
    basePath: '',
    browsers: [ process.env.TRAVIS ? 'Chrome_travis_ci' : 'Chrome' ], //run in Chrome
    singleRun: true, //just run once by default
    frameworks: [ 'mocha' ], //use the mocha test framework
    files: [
      './tests.webpack.js', //just load this file
    ],
    preprocessors: {
      './public/dist/bundle.js': ['webpack'],
      './tests.webpack.js': [ 'webpack', 'sourcemap'], //preprocess with webpack and our sourcemap loader
      './test/frontend/*.js': [ 'webpack', 'babel' ]
    },
    reporters: [ 'mocha', 'coverage' ], //report results in this format
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },
    coverageReporter: {
      type: 'html', //produces a html document after code is run
      dir: 'coverage/' //path to created html doc
    },
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  });
};
