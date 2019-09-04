require('protractor');
const fs = require('fs');
const chai = require('chai');
const chaiThings = require('chai-things');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiThings);
chai.use(chaiAsPromised);
global.should = chai.should();
global.flow = protractor.promise.controlFlow();

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
        flow.execute(() => {
            console.log(`debug`);
            browser.debugger();
        });
    };

    async setWaitForAngularEnabled() {
        await flow.execute(() => {
            browser.waitForAngularEnabled(true);
        });
    };

    async setWaitForAngularDisabled() {
        await flow.execute(() => {
            browser.waitForAngularEnabled(false);
        });
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

    async sleep(ms) {
        await flow.execute(() => {
            console.log(`*sleep: ${ms} ms`);
            browser.sleep(ms);
        });
    };

    async pause() {
        await this.sleep(this.timeout.xs);
    };

    async log(value) {
        if (!!value) {
            await flow.execute(() => {
                console.log(value);
            });
        }
    };

    async logTitle() {
        browser.getTitle().then((title) => {
            this.log(`Title: ${title}`);
        });
    };

    async waitForTitle(expected, timeout) {
        await browser.wait(this.EC.titleIs(expected), timeout || this.timeout.xxl, `Waiting for title: ${expected}`);
    };

    async waitForTitleContains(expected, timeout) {
        await browser.wait(this.EC.titleContains(expected), timeout || this.timeout.xxl, `Wait for title contains: ${expected}`);
    };

    async waitForUrl(expected, timeout) {
        await browser.wait(this.EC.urlIs(expected), timeout || this.timeout.xxl, `Waiting for url: ${expected}`);
    };

    async waitForUrlContains(expected, timeout) {
        await browser.wait(this.EC.urlContains(expected), timeout || this.timeout.xxl, `Wait for url contains: ${expected}`);
    };

    async waitForAlert(timeout) {
        await browser.wait(this.EC.alertIsPresent(), timeout || this.timeout.xxl, `Waiting for alert`);
    };

    async waitFile(filePath, timeout) {
        await browser.wait(() => {
            return fs.existsSync(filePath)
        }, timeout || this.timeout.xxxl, `Wait File: ${filePath}`);
    };

    async waitFileGone(filePath, timeout) {
        await browser.wait(() => {
            return !fs.existsSync(filePath)
        }, timeout || this.timeout.xxl, `Wait File Gone: ${filePath}`);
    };

    /**
     * wait and verify that a page object is loaded
     *
     * @requires page to include `loaded` webElement
     */
    async at(timeout) {
        await flow.execute(() => {
            this.checkWaitForAngular();
            this.logTitle();
            browser.wait(this.EC.presenceOf(this.loaded), timeout || this.timeout.xxxl, `Wait Loaded Element For Page: ` + (this.url || ``));
        });
    };

    /**
     * wait and verify that a frame object is loaded
     *
     * @requires page to include `loaded` webElement
     */
    async atFrame(timeout) {
        await flow.execute(() => {
            this.checkWaitForAngular();
            browser.wait(this.EC.presenceOf(this.loaded), timeout || this.timeout.xxxl, `Wait Loaded Element For Frame: ${this.iframe}`);
        });
    };

    /**
     * wait and verify ulr
     *
     * @requires page to include `url` variable
     */
    async atUrl(url, timeout) {
        await flow.execute(() => {
            this.checkWaitForAngular();
            this.waitForUrl(url || this.url, timeout);
        });
    };

    async atUrlContains(url, timeout) {
        await flow.execute(() => {
            this.checkWaitForAngular();
            this.waitForUrlContains(url || this.url, timeout);
        });
    };

    /**
     * wait and verify title
     *
     * @requires page to include `title` variable
     */
    async atTitle(title, timeout) {
        await flow.execute(() => {
            this.checkWaitForAngular();
            this.waitForTitle(title || this.title, timeout);
        });
    };

    async atTitleContains(title, timeout) {
        await flow.execute(() => {
            this.checkWaitForAngular();
            this.waitForTitleContains(title || this.title, timeout);
        });
    };

    /**
     * navigate to a page via it`s `url` var
     * and verify/wait via at()
     *
     * @requires page have both `url` and `loaded` properties
     */
    async goTo() {
        await flow.execute(() => {
            this.checkWaitForAngular();
            this.log(`*goTo: ${base.domain + this.url}`);
            browser.navigate().to(base.domain + this.url);
            this.at();
        });
    };

    async goToUrl(url) {
        await flow.execute(() => {
            url = url || base.domain + this.url;
            this.log(`*goTo url: ${url}`);
            browser.navigate().to(url);
            this.pause();
        });
    };

    async goToPath(path) {
        await flow.execute(() => {
            this.log(`*goTo path: ` + base.domain + path);
            browser.get(base.domain + path);
        });
    };

    async saveCurrentUrl() {
        await browser.getCurrentUrl().then((currentUrl) => {
            this.log(`*save url: ${currentUrl}`);
            this.savedUrl = currentUrl;
        });
    };

    async goToSavedUrl() {
        await flow.execute(() => {
            this.log(`*goTo saved url: ${this.savedUrl}`);
            browser.navigate().to(this.savedUrl);
            this.pause();
        });
    };

    async restart() {
        this.log(`*restart`);
        await browser.restartSync();
    };

    async refresh() {
        this.log(`*refresh`);
        await browser.refresh();
    };

    async resetSession() {
        this.log(`*resetSession`);
        await browser.driver.manage().deleteAllCookies().then(() => {
            browser.executeScript(`window.localStorage.clear(); window.sessionStorage.clear();`);
            browser.refresh();
        })
    };

    async goBack() {
        this.log(`*goBack`);
        await flow.execute(() => {
            this.pause();
            browser.navigate().back();
            this.pause();
        });
    };

    async goForward() {
        this.log(`*goForward`);
        await flow.execute(() => {
            this.pause();
            browser.navigate().forward();
            this.pause();
        });
    };

    async switchToWindow(windowHandleIndex) {
        this.setWaitForAngularDisabled();
        await browser.getAllWindowHandles().then((handles) => {
            return browser.switchTo().window(handles[windowHandleIndex]);
        });
    };

    async switchToDefault() {
        this.setWaitForAngularDisabled();
        await flow.execute(() => {
            browser.switchTo().defaultContent().then(
                () => {
                }, (err) => {
                    console.log(err);
                }
            );
        });
    };

    async switchToDefaultState() {
        this.setWaitForAngularDisabled();
        await flow.execute(() => {
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
        });
    };

    async switchToNew(currentWinHandle) {
        this.pause();
        this.setWaitForAngularDisabled();
        await browser.getAllWindowHandles().then((handles) => {
            if (!!currentWinHandle) {
                return browser.switchTo().window(handles.filter((handle) => {
                    return handle !== currentWinHandle
                })[0]);
            } else {
                return browser.switchTo().window(handles[1]);
            }
        });
    };

    async switchCloseWindow() {
        browser.close();
        this.setWaitForAngularDisabled();
        await browser.getAllWindowHandles().then((handles) => {
            if (handles.length > 1) {
                browser.close();
                return base.switchToWindow(0);
            }
            return handles[0];
        });
    };

    async switchToFrame(nameOrIndex) {
        browser.switchTo().defaultContent();
        if (!nameOrIndex) {
            this.iframe.waitInDom();
            nameOrIndex = this.iframe.getWebElement();
        }
        this.setWaitForAngularDisabled();
        await browser.switchTo().frame(nameOrIndex).then(() => {
            return this.atFrame();
        });
    };

    /**
     * WebDriver actions.
     */
    async hitReturn() {
        await browser.actions().sendKeys(protractor.Key.RETURN).perform();
    };

    async hitSpace() {
        await browser.actions().sendKeys(protractor.Key.SPACE).perform();
    };

    async hitTab() {
        await browser.actions().sendKeys(protractor.Key.TAB).perform();
    };

    async hitEscape() {
        await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    };

    /**
     * WebDriver alerts.
     */
    async isAlertPresent() {
        return browser.getTitle().then(
            () => {
                return false;
            }, () => {
                return true;
            }
        );
    };

    async acceptAlert() {
        if (base.isAlertPresent()) {
            await browser.switchTo().alert().then((alert) => {
                    this.log("Accept alert");
                    alert.accept();
                }, (err) => {
                }
            );
        }
    };

    async checkAlert(message) {
        this.waitForAlert();
        await browser.switchTo().alert().then((alert) => {
                alert.getText().should.eventually.eq(message);
                this.log("Accept alert");
                alert.accept();
            }, (err) => {
            }
        );
    };

    async getSplitArray(arr, char) {
        return [].concat(arr).map((el) => {
            return el.split(char)[0].trim();
        });
    };

    async getSplitArrayMulti(arr, chars) {
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