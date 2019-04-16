// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 30000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  multiCapabilities: [{
      'browserName': 'Chrome'
    }, {
      'browserName': 'Firefox'
    }, {
      'browserName': 'Safari'
    }],
  baseUrl: 'http://anadev1.affiniti.com/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  beforeLaunch: function() {

  },
  onPrepare() {
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    jasmine.getEnv().addReporter(new jasmineReporters.TeamCityReporter());

    var htmlReporter = require('protractor-beautiful-reporter');
    jasmine.getEnv().addReporter(new htmlReporter({
                                baseDirectory: 'REPORTS/e2e',
                                preserveDirectory: false
                            }).getJasmine2Reporter());
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });

    browser.driver.get(exports.config.baseUrl);
    browser.driver.manage().addCookie({name: 'disableAppInsights', value: 'speedyPete'});
  },
};
// Code to support common capabilities
exports.config.multiCapabilities.forEach(function(caps){
  caps['browserstack.user'] = process.env.NetAssure_BrowserStackUser;
  caps['browserstack.key'] = process.env.NetAssure_BrowserStackKey;
});


