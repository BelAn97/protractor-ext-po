require('protractor');
const fs = require('fs');
const chai = require('chai');
const chaiThings = require('chai-things');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiThings);
chai.use(chaiAsPromised);
global.should = chai.should();

class Base {

    constructor() {
        /**
         * wrap timeout. (ms) in t-shirt sizes
         */
        this.timeout = {
            'zero': 50,
            'min': 200,
            'xs': 500,
            's': 1000,
            'm': 2000,
            'l': 5000,
            'xl': 10000,
            'xxl': 30000,
            'xxxl': 90000,
            'max': 1500000
        };
        this.EC = browser.ExpectedConditions;
        this.domain = '';
        this.download = '';
        this.savedUrl = '';
    }

    setDomain(domain) {
        this.log(`*set domain: ${domain}`);
        this.domain = domain;
    };

    setDownload(download) {
        this.log(`*set download path: ${download}`);
        this.download = download;
    };

    debug() {
        console.log(`debug`);
        browser.debugger();
    };

    setWaitForAngularEnabled() {
        browser.waitForAngularEnabled(true);
    };

    setWaitForAngularDisabled() {
        browser.waitForAngularEnabled(false);
    };

    /**
     * enable or disable wait for angular for the page
     *
     * @requires page to include `angular` boolean variable
     */
    checkWaitForAngular() {
        if (this.angular !== undefined) {
            if (this.angular) {
                this.setWaitForAngularEnabled();
            } else {
                this.setWaitForAngularDisabled();
            }
        }
    };

    sleep(ms) {
        console.log(`*sleep: ${ms} ms`);
        browser.sleep(ms);
    };

    pause() {
        this.sleep(this.timeout.xs);
    };

    log(value) {
        if (!!value) {
            console.log(value);
            if (!!currentTest) {
                logReport.log(currentTest, value);
                if (!currentTest.log) {
                    currentTest.log = value;
                } else {
                    currentTest.log += '\n' + value;
                }
            }
        }
    };

    logTitle() {
        browser.getTitle().then((title) => {
            this.log(`Title: ${title}`);
        });
    };

    waitForTitle(expected, timeout) {
        browser.wait(this.EC.titleIs(expected), timeout || this.timeout.xxl, `Waiting for title: ${expected}`);
    };

    waitForTitleContains(expected, timeout) {
        browser.wait(this.EC.titleContains(expected), timeout || this.timeout.xxl, `Wait for title contains: ${expected}`);
    };

    waitForUrl(expected, timeout) {
        browser.wait(this.EC.urlIs(expected), timeout || this.timeout.xxl, `Waiting for url: ${expected}`);
    };

    waitForUrlContains(expected, timeout) {
        browser.wait(this.EC.urlContains(expected), timeout || this.timeout.xxl, `Wait for url contains: ${expected}`);
    };

    waitForAlert(timeout) {
        browser.wait(this.EC.alertIsPresent(), timeout || this.timeout.xxl, `Waiting for alert`);
    };

    waitFile(filePath, timeout) {
        browser.wait(() => {
            return fs.existsSync(filePath)
        }, timeout || this.timeout.xxxl, `Wait File: ${filePath}`);
    };

    waitFileGone(filePath, timeout) {
        browser.wait(() => {
            return !fs.existsSync(filePath)
        }, timeout || this.timeout.xxl, `Wait File Gone: ${filePath}`);
    };

    /**
     * wait and verify that a page object is loaded
     *
     * @requires page to include `loaded` webElement
     */
    at(timeout) {
        this.checkWaitForAngular();
        this.logTitle();
        browser.wait(this.EC.presenceOf(this.loaded), timeout || this.timeout.xxxl, `Wait Loaded Element For Page: ` + (this.url || ``));
    };

    /**
     * wait and verify that a frame object is loaded
     *
     * @requires page to include `loaded` webElement
     */
    atFrame(timeout) {
        this.checkWaitForAngular();
        browser.wait(this.EC.presenceOf(this.loaded), timeout || this.timeout.xxxl, `Wait Loaded Element For Frame: ${this.iframe}`);
    };

    /**
     * wait and verify ulr
     *
     * @requires page to include `url` variable
     */
    atUrl(url, timeout) {
        this.checkWaitForAngular();
        this.waitForUrl(url || this.url, timeout);
    };

    atUrlContains(url, timeout) {
        this.checkWaitForAngular();
        this.waitForUrlContains(url || this.url, timeout);
    };

    /**
     * wait and verify title
     *
     * @requires page to include `title` variable
     */
    atTitle(title, timeout) {
        this.checkWaitForAngular();
        this.waitForTitle(title || this.title, timeout);
    };

    atTitleContains(title, timeout) {
        this.checkWaitForAngular();
        this.waitForTitleContains(title || this.title, timeout);
    };

    /**
     * navigate to a page via it`s `url` var
     * and verify/wait via at()
     *
     * @requires page have both `url` and `loaded` properties
     */
    goTo() {
        this.checkWaitForAngular();
        this.log(`*goTo: ${base.domain + this.url}`);
        browser.navigate().to(base.domain + this.url);
        this.at();
    };

    goToUrl(url) {
        url = url || base.domain + this.url;
        this.log(`*goTo url: ${url}`);
        browser.navigate().to(url);
        this.pause();
    };

    goToPath(path) {
        this.log(`*goTo path: ` + base.domain + path);
        browser.get(base.domain + path);
    };

    saveCurrentUrl() {
        browser.getCurrentUrl().then((currentUrl) => {
            this.log(`*save url: ${currentUrl}`);
            this.savedUrl = currentUrl;
        });
    };

    goToSavedUrl() {
        this.log(`*goTo saved url: ${this.savedUrl}`);
        browser.navigate().to(this.savedUrl);
        this.pause();
    };

    restart() {
        this.log(`*restart`);
        browser.restartSync();
    };

    refresh() {
        this.log(`*refresh`);
        browser.refresh();
    };

    resetSession() {
        this.log(`*resetSession`);
        browser.driver.manage().deleteAllCookies().then(() => {
            browser.executeScript(`window.localStorage.clear(); window.sessionStorage.clear();`);
            browser.refresh();
        })
    };

    goBack() {
        this.log(`*goBack`);
        this.pause();
        browser.navigate().back();
        this.pause();
    };

    goForward() {
        this.log(`*goForward`);
        this.pause();
        browser.navigate().forward();
        this.pause();
    };

    switchToWindow(windowHandleIndex) {
        this.setWaitForAngularDisabled();
        browser.getAllWindowHandles().then((handles) => {
            return browser.switchTo().window(handles[windowHandleIndex]);
        });
    };

    switchToDefault() {
        this.setWaitForAngularDisabled();
        browser.switchTo().defaultContent().then(
            () => {
            }, (err) => {
                console.log(err);
            }
        );
    };

    switchToDefaultState() {
        this.setWaitForAngularDisabled();
        browser.switchTo().defaultContent().then(() => {
                browser.getAllWindowHandles().then((handles) => {
                    for (let i = 1; i < handles.length; i++) {
                        browser.switchTo().window(handles[i]);
                        browser.close();
                    }
                });
            },
            (err) => {
                console.log(err);
                browser.restart();
                browser.switchTo().activeElement();
            }
        );
    };

    switchToNew(currentWinHandle) {
        this.pause();
        this.setWaitForAngularDisabled();
        browser.getAllWindowHandles().then((handles) => {
            if (!!currentWinHandle) {
                return browser.switchTo().window(handles.filter((handle) => {
                    return handle !== currentWinHandle
                })[0]);
            } else {
                return browser.switchTo().window(handles[1]);
            }
        });
    };

    switchCloseWindow() {
        browser.close();
        this.setWaitForAngularDisabled();
        browser.getAllWindowHandles().then((handles) => {
            if (handles.length > 1) {
                browser.close();
                return base.switchToWindow(0);
            }
            return handles[0];
        });
    };

    switchToFrame(nameOrIndex) {
        browser.switchTo().defaultContent();
        if (!nameOrIndex) {
            this.iframe.waitInDom();
            nameOrIndex = this.iframe.getWebElement();
        }
        this.setWaitForAngularDisabled();
        browser.switchTo().frame(nameOrIndex).then(() => {
            return this.atFrame();
        });
    };

    /**
     * WebDriver actions.
     */
    hitReturn() {
        browser.actions().sendKeys(protractor.Key.RETURN).perform();
    };

    hitSpace() {
        browser.actions().sendKeys(protractor.Key.SPACE).perform();
    };

    hitTab() {
        browser.actions().sendKeys(protractor.Key.TAB).perform();
    };

    hitEscape() {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    };

    /**
     * WebDriver alerts.
     */
    isAlertPresent() {
        return browser.getTitle().then(
            () => {
                return false;
            }, () => {
                return true;
            }
        );
    };

    acceptAlert() {
        if (base.isAlertPresent()) {
            browser.switchTo().alert().then((alert) => {
                    this.log("Accept alert");
                    alert.accept();
                }, (err) => {
                }
            );
        }
    };

    checkAlert(message) {
        this.waitForAlert();
        browser.switchTo().alert().then((alert) => {
                alert.getText().should.eventually.eq(message);
                this.log("Accept alert");
                alert.accept();
            }, (err) => {
            }
        );
    };

    getSplitArray(arr, char) {
        return [].concat(arr).map((el) => {
            return el.split(char)[0].trim();
        });
    };

    getSplitArrayMulti(arr, chars) {
        return [].concat(arr).map((el) => {
            chars.forEach((char) => {
                el = el.split(char)[0];
            });
            return el.trim();
        });
    };

    static getYear() {
        return new Date().getFullYear();
    };

    static splitByStep(arr, step) {
        var steppedList = [];
        var list = [];
        for (var i = 0; i < arr.length; i += 1) {
            list.push(arr[i]);
            if (list.length === step) {
                steppedList.push(list);
                list = [];
            }
        }
        return steppedList
    };

    /**
     * comparators.
     */
    static compareLowerCase(a, b) {
        if (a.toLowerCase() < b.toLowerCase()) {
            return -1;
        }
        if (a.toLowerCase() > b.toLowerCase()) {
            return 1;
        }
        return 0;
    };

    static compareFloat(a, b) {
        return parseFloat(a) - parseFloat(b);
    };

    static comparePercentage(a, b) {
        return parseFloat(a.replace(`%`, ``)) - parseFloat(b.replace(`%`, ``));
    };

}

module.exports = new Base();
