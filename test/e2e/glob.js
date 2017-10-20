global.fs = require('fs');
global.path = require('path');

global.base = require('./../../dist/protractor-ext-po');

global.toolbar = require('./objects/toolbar');
global.footer = require('./objects/footer');
global.home = require('./pages/home.po');
global.feature = require('./pages/feature.po');

global.logReport = require('mochawesome-screenshots/logReport');
global.currentTest = undefined;

before('login', function() {
    global.currentTest = this.test;
    browser.waitForAngularEnabled(false);
    base.setDomain('https://angular.io/');
    base.setDownload(path.join(__dirname, '../downloads/'));
    home.goTo();
});

beforeEach('check login', function() {
    browser.manage().window().setSize(1600, 1024);
    global.currentTest = this.currentTest;
});
