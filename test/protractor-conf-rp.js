const fs = require('fs');
const path = require('path');

let chromeOptions = {
    args: ['--no-sandbox', '--test-type=browser', 'disable-infobars=true'],
    w3c: false,
    prefs: {
        'download': {
            'prompt_for_download': false,
            'directory_upgrade': true,
            'default_directory': path.join(__dirname, '/downloads/')
        },
        'credentials_enable_service': false,
        'profile': {
            'password_manager_enabled': false
        }
    }
};

exports.config = {

    allScriptsTimeout: 300000,
    getPageTimeout: 120000,

    specs: [
        'e2e/tests/simple.js'
    ],
    jvmArgs: ['-Xmx2g'],
    capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': chromeOptions
        // shardTestFiles: true,
        // maxInstances: 2,
        // count: 1
    },

    framework: 'mocha',

    mochaOpts: {
        force: true,
        colors: true,
        reporter: 'mocha-multi-reporters',
        reporterOptions: {
            reporterEnabled: 'mocha-reportportal-agent, mochawesome-screenshots',
            mochaReportportalAgentReporterOptions: {
                token: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                endpoint: "https://rp.epam.com/api/v1",
                launch: 'Angular site e2e tests report - /chrome/',
                project: "xxx_personal",
                debug: true
            },
            mochawesomeScreenshotsReporterOptions: {
                reportName: 'angular_site_e2e',
                reportTitle: 'Angular site e2e tests report - /chrome/',
                takePassedScreenshot: false,
                clearOldScreenshots: true
            }
        },
        timeout: 600000
    },

    onPrepare: function () {
        const dl = path.join(__dirname, '/downloads/');
        try {
            fs.existsSync(dl) || fs.mkdirSync(dl);
        } catch (ignored) {
        }
        if (driver === 'chrome') {
            browser.driver.sendChromiumCommand('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: dl
            });
        }
        browser.driver.manage().window().setSize(1600, 1024);
    }

};
