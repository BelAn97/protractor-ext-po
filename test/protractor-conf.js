const fs = require('fs');
const path = require('path');
exports.config = {

    allScriptsTimeout: 300000,
    getPageTimeout: 120000,

    specs: [
        'e2e/tests/simple.js'
    ],
    jvmArgs: ['-Xmx2g'],
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ['--no-sandbox', '--test-type=browser', 'disable-infobars'],
            prefs: {
                'download': {
                    'prompt_for_download': false,
                    'directory_upgrade': true,
                    'default_directory': path.join(__dirname,'/downloads/')
                },
                'credentials_enable_service': false,
                'profile': {
                    'password_manager_enabled': false
                }
            }
        }
        // shardTestFiles: true,
        // maxInstances: 2,
        // count: 1
    },

    framework: 'mocha',

    mochaOpts: {
        force: true,
        colors: true,
        reporter: 'mochawesome-screenshots',
        reporterOptions: {
            reportName: 'angular_site_e2e',
            reportTitle: 'Angular site e2e tests report - /chrome/',
            takePassedScreenshot: false,
            clearOldScreenshots: true
        },
        timeout: 600000
    },

    onPrepare() {
        const dl = path.join(__dirname,'/downloads/');
        try {
            fs.existsSync(dl) || fs.mkdirSync(dl);
        } catch (ignored){}
        browser.driver.manage().window().setSize(1600, 1024);
    }

};
