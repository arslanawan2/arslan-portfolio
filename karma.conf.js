// Karma configuration.
// The only reason this file exists rather than relying on Angular's
// built-in defaults is ChromeHeadlessCI: CI containers have no
// sandbox and a small /dev/shm, so headless Chrome needs those
// flags to start at all.

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false, // leave the Jasmine spec runner visible
    },
    jasmineHtmlReporter: {
      suppressAll: true, // collapse duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/arslan-portfolio'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },
    restartOnFileChange: true,
  });
};
