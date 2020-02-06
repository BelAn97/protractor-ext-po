global.fs = require('fs');
global.path = require('path');

global.base = require('./../../dist/protractor-ext-po');

global.toolbar = require('./objects/toolbar');
global.footer = require('./objects/footer');
global.home = require('./pages/home.po');
global.feature = require('./pages/feature.po');

global.logReport = require('mochawesome-screenshots/logReport');
global.currentTest = undefined;

before('login', async function () {
    global.currentTest = this.test;
    await browser.waitForAngularEnabled(false);
    base.setDomain('https://angular.io/');
    base.setDownload(path.join(__dirname, '../downloads/'));
    await home.goTo();
});

beforeEach('check login', async function () {
    browser.manage().window().setSize(1600, 1024);
    global.currentTest = this.currentTest;
});
