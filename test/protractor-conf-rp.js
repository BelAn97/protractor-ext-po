const fs = require('fs');
const path = require('path');
exports.config = {

    allScriptsTimeout: 300000,
    getPageTimeout: 120000,

    specs: [
        'e2e/tests/simple.js'
    ],

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
        reporter: 'mocha-multi-reporters',
        reporterOptions: {
            reporterEnabled: 'mocha-reportportal-agent, mochawesome-screenshots',
            mochaReportportalAgentReporterOptions: {
                token: "64f61a65-fb9d-4fcf-b825-3a0d4e4a757d",
                endpoint: "https://rp.epam.com/api/v1",
                launch: 'Angular site e2e tests report - /chrome/',
                project: "andrei_belousov_personal",
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
        fs.existsSync(dl) || fs.mkdirSync(dl);
        browser.manage().window().setSize(1600, 1024);
    }

};
