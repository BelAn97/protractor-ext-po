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

    async debug() {
        console.log(`debug`);
        await browser.debugger();
    };

    async setWaitForAngularEnabled() {
        await browser.waitForAngularEnabled(true);
    };

    async setWaitForAngularDisabled() {
        await browser.waitForAngularEnabled(false);
    };

    /**
     * enable or disable wait for angular for the page
     *
     * @requires page to include `angular` boolean variable
     */
    checkWaitForAngular() {
        if (this.angular) {
            this.setWaitForAngularEnabled();
        } else {
            this.setWaitForAngularDisabled();
        }
    };

    async sleep(ms) {
        console.log(`*sleep: ${ms} ms`);
        await browser.sleep(ms);
    };

    pause() {
        this.sleep(this.timeout.xs);
    };

    log(value) {
        if (!!value) {
            console.log(value);
        }
    };

    async logTitle() {
        await browser.getTitle().then((title) => {
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
        await this.checkWaitForAngular();
        await this.logTitle();
        await browser.wait(this.EC.presenceOf(this.loaded), timeout || this.timeout.xxxl, `Wait Loaded Element For Page: ` + (this.url || ``));
    };

    /**
     * wait and verify that a frame object is loaded
     *
     * @requires page to include `loaded` webElement
     */
    async atFrame(timeout) {
        await this.checkWaitForAngular();
        await browser.wait(this.EC.presenceOf(this.loaded), timeout || this.timeout.xxxl, `Wait Loaded Element For Frame: ${this.iframe}`);
    };

    /**
     * wait and verify ulr
     *
     * @requires page to include `url` variable
     */
    async atUrl(url, timeout) {
        await this.checkWaitForAngular();
        await this.waitForUrl(url || this.url, timeout);
    };

    async atUrlContains(url, timeout) {
        await this.checkWaitForAngular();
        await this.waitForUrlContains(url || this.url, timeout);
    };

    /**
     * wait and verify title
     *
     * @requires page to include `title` variable
     */
    async atTitle(title, timeout) {
        await this.checkWaitForAngular();
        await this.waitForTitle(title || this.title, timeout);
    };

    async atTitleContains(title, timeout) {
        await this.checkWaitForAngular();
        await this.waitForTitleContains(title || this.title, timeout);
    };

    /**
     * navigate to a page via it`s `url` var
     * and verify/wait via at()
     *
     * @requires page have both `url` and `loaded` properties
     */
    async goTo() {
        await this.checkWaitForAngular();
        await this.log(`*goTo: ${base.domain + this.url}`);
        await browser.navigate().to(base.domain + this.url);
        await this.at();
    };

    async goToUrl(url) {
        url = url || base.domain + this.url;
        await this.log(`*goTo url: ${url}`);
        await browser.navigate().to(url);
        await this.pause();
    };

    async goToPath(path) {
        await this.log(`*goTo path: ` + base.domain + path);
        await browser.get(base.domain + path);
    };

    async saveCurrentUrl() {
        await browser.getCurrentUrl().then((currentUrl) => {
            this.log(`*save url: ${currentUrl}`);
            this.savedUrl = currentUrl;
        });
    };

    async goToSavedUrl() {
        await this.log(`*goTo saved url: ${this.savedUrl}`);
        await browser.navigate().to(this.savedUrl);
        await this.pause();
    };

    async restart() {
        await this.log(`*restart`);
        await browser.restartSync();
    };

    async refresh() {
        await this.log(`*refresh`);
        await browser.refresh();
    };

    async resetSession() {
        await this.log(`*resetSession`);
        await browser.driver.manage().deleteAllCookies().then(() => {
            browser.executeScript(`window.localStorage.clear(); window.sessionStorage.clear();`);
            browser.refresh();
        })
    };

    async goBack() {
        await this.log(`*goBack`);
        await this.pause();
        await browser.navigate().back();
        await this.pause();
    };

    async goForward() {
        await this.log(`*goForward`);
        await this.pause();
        await browser.navigate().forward();
        await this.pause();
    };

    async switchToWindow(windowHandleIndex) {
        await this.setWaitForAngularDisabled();
        await browser.getAllWindowHandles().then((handles) => {
            return browser.switchTo().window(handles[windowHandleIndex]);
        });
    };

    async switchToDefault() {
        await this.setWaitForAngularDisabled();
        await browser.switchTo().defaultContent().then(
            () => {
            }, (err) => {
                console.log(err);
            }
        );
    };

    async switchToDefaultState() {
        await this.setWaitForAngularDisabled();
        await browser.switchTo().defaultContent().then(async () => {
                await browser.getAllWindowHandles().then(async (handles) => {
                    for (let i = 1; i < handles.length; i++) {
                        await browser.switchTo().window(handles[i]);
                        await browser.close();
                    }
                });
            },
            async (err) => {
                console.log(err);
                await browser.restart();
                await browser.switchTo().activeElement();
            }
        );

    };

    async switchToNew(currentWinHandle) {
        await this.pause();
        await this.setWaitForAngularDisabled();
        await browser.getAllWindowHandles().then(async (handles) => {
            if (!!currentWinHandle) {
                return await browser.switchTo().window(handles.filter((handle) => {
                    return handle !== currentWinHandle
                })[0]);
            } else {
                return await browser.switchTo().window(handles[1]);
            }
        });
    };

    async switchCloseWindow() {
        await browser.close();
        await this.setWaitForAngularDisabled();
        await browser.getAllWindowHandles().then(async (handles) => {
            if (handles.length > 1) {
                await browser.close();
                return await this.switchToWindow(0);
            }
            return handles[0];
        });
    };

    async switchToFrame(nameOrIndex) {
        await browser.switchTo().defaultContent();
        if (!nameOrIndex) {
            await this.iframe.waitInDom();
            nameOrIndex = await this.iframe.getWebElement();
        }
        await this.setWaitForAngularDisabled();
        await browser.switchTo().frame(nameOrIndex).then(async () => {
            return await this.atFrame();
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
        return await browser.getTitle().then(
            () => {
                return false;
            }, () => {
                return true;
            }
        );
    };

    async acceptAlert() {
        if (await this.isAlertPresent()) {
            await browser.switchTo().alert().then(async (alert) => {
                    this.log("Accept alert");
                    await alert.accept();
                }, (err) => {
                }
            );
        }
    };

    async checkAlert(message) {
        await this.waitForAlert();
        await browser.switchTo().alert().then(async (alert) => {
                await alert.getText().should.eventually.eq(message);
                await this.log("Accept alert");
                await alert.accept();
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
