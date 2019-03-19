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

    constructor(){
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
            'xxxl': 60000,
            'max': 900000
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
            console.log('debug');
        });
    };

    setWaitForAngular() {
        flow.execute(() => {
            browser.waitForAngularEnabled(true);
        });
    };

    setNoWaitForAngular() {
        flow.execute(() => {
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
                this.setWaitForAngular();
            } else {
                this.setNoWaitForAngular();
            }
        }
    };

    sleep(ms) {
        flow.execute(() => {
            console.log(`*sleep: ${ms} ms`);
            browser.sleep(ms);
        });
    };

    pause() {
        this.sleep(this.timeout.xs);
    };

    log(value) {
        if (!!value) {
            flow.execute(() => {
                console.log(value);
            });
        }
    };

    logTitle() {
        browser.getTitle().then((title) => {
            this.log(`Title: ${title}`);
        });
    };

    waitForTitle(expected, timeout) {
        return browser.wait(this.EC.titleIs(expected), timeout || this.timeout.xxl, `Waiting for title: ${expected}`);
    };
    waitForTitleContains(expected, timeout) {
        return browser.wait(this.EC.titleContains(expected), timeout || this.timeout.xxl, `Wait for title contains: ${expected}`);
    };
    waitForUrl(expected, timeout) {
        return browser.wait(this.EC.urlIs(expected), timeout || this.timeout.xxl, `Waiting for url: ${expected}`);
    };
    waitForUrlContains(expected, timeout) {
        return browser.wait(this.EC.urlContains(expected), timeout || this.timeout.xxl, `Wait for url contains: ${expected}`);
    };
    waitForAlert(timeout) {
        return browser.wait(this.EC.alertIsPresent(), timeout || this.timeout.xxl, 'Waiting for alert');
    };

    waitFile(filePath, timeout) {
        return browser.wait(() => {
            return fs.existsSync(filePath)
        }, timeout || this.timeout.xxxl, `Wait File: ${filePath}`);
    };
    waitFileGone (filePath, timeout) {
        return browser.wait(() => {
            return !fs.existsSync(filePath)
        }, timeout || this.timeout.xxl, `Wait File Gone: ${filePath}`);
    };

    /**
     * wait and verify that a page object is loaded
     *
     * @requires page to include `loaded` webElement
     */
    at(timeout) {
        flow.execute(() => {
            this.checkWaitForAngular();
            this.logTitle();
            browser.wait(this.EC.presenceOf(this.loaded), timeout || this.timeout.xxxl, 'Wait Loaded Element For Page: ' + (this.url || ''));
        });
    };

    /**
     * wait and verify that a frame object is loaded
     *
     * @requires page to include `loaded` webElement
     */
    atFrame(timeout) {
        flow.execute(() => {
            this.checkWaitForAngular();
            browser.wait(this.EC.presenceOf(this.loaded), timeout || this.timeout.xxxl, `Wait Loaded Element For Frame: ${this.iframe}`);
        });
    };

    /**
     * wait and verify ulr
     *
     * @requires page to include `url` variable
     */
    atUrl(url, timeout) {
        flow.execute(() => {
            this.checkWaitForAngular();
            this.waitForUrl(url || this.url, timeout);
        });
    };

    atUrlContains(url, timeout) {
        flow.execute(() => {
            this.checkWaitForAngular();
            this.waitForUrlContains(url || this.url, timeout);
        });
    };

    /**
     * wait and verify title
     *
     * @requires page to include `title` variable
     */
    atTitle(title, timeout) {
        flow.execute(() => {
            this.checkWaitForAngular();
            this.waitForTitle(title || this.title, timeout);
        });
    };

    atTitleContains(title, timeout) {
        flow.execute(() => {
            this.checkWaitForAngular();
            this.waitForTitleContains(title || this.title, timeout);
        });
    };

    /**
     * navigate to a page via it's `url` var
     * and verify/wait via at()
     *
     * @requires page have both `url` and `loaded` properties
     */
    goTo() {
        flow.execute(() => {
            this.checkWaitForAngular();
            this.log(`*goTo: ${base.domain + this.url}`);
            browser.navigate().to(base.domain + this.url);
            this.at();
        });
    };

    goToUrl(url) {
        flow.execute(() => {
            url = url || base.domain + this.url;
            this.log(`*goTo url: ${url}`);
            browser.navigate().to(url);
            this.pause();
        });
    };

    goToPath(path) {
        flow.execute(() => {
            this.log('*goTo path: ' + base.domain + path);
            browser.get(base.domain + path);
        });
    };

    saveCurrentUrl() {
        browser.getCurrentUrl().then((currentUrl) => {
            this.log(`*save url: ${currentUrl}`);
            this.savedUrl = currentUrl;
        });
    };

    goToSavedUrl() {
        flow.execute(() => {
            this.log(`*goTo saved url: ${this.savedUrl}`);
            browser.navigate().to(this.savedUrl);
            this.pause();
        });
    };

    restart() {
        this.log('*restart');
        browser.restartSync();
    };

    refresh() {
        this.log('*refresh');
        browser.refresh();
    };

    resetSession() {
        this.log('*resetSession');
        return browser.driver.manage().deleteAllCookies().then(() => {
            browser.executeScript('window.localStorage.clear(); window.sessionStorage.clear();');
            browser.refresh();
        })
    };

    goBack() {
        this.log('*goBack');
        flow.execute(() => {
            this.pause();
            browser.navigate().back();
            this.pause();
        });
    };

    goForward() {
        this.log('*goForward');
        flow.execute(() => {
            this.pause();
            browser.navigate().forward();
            this.pause();
        });
    };

    switchToWindow(windowHandleIndex) {
        this.setNoWaitForAngular();
        return browser.getAllWindowHandles().then((handles) => {
            return browser.switchTo().window(handles[windowHandleIndex]);
        });
    };

    switchToDefault() {
        this.setNoWaitForAngular();
        flow.execute(() => {
            browser.switchTo().defaultContent().then(
                () => {}, (err) => {
                    console.log(err);
                }
            );
        });
    };

    switchToDefaultState() {
        this.setNoWaitForAngular();
        flow.execute(() =>  {
            browser.switchTo().defaultContent().then(() => {
                    browser.getAllWindowHandles().then((handles) => {
                        for (let i=1; i<handles.length; i++) {
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

    switchToNew(currentWinHandle) {
        this.pause();
        this.setNoWaitForAngular();
        return browser.getAllWindowHandles().then((handles) => {
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
        this.setNoWaitForAngular();
        return browser.getAllWindowHandles().then((handles) => {
            return browser.switchTo().window(handles[0]);
        });
    };

    switchToFrame(nameOrIndex) {
        browser.switchTo().defaultContent();
        if (!nameOrIndex) {
            this.iframe.waitInDom();
            nameOrIndex = this.iframe.getWebElement();
        }
        this.setNoWaitForAngular();
        return browser.switchTo().frame(nameOrIndex).then(() => {
            return this.atFrame();
        });
    };

    /**
     * WebDriver actions.
     */
    hitReturn() {
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
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
            },(err) => {}
        );
    };

    getSplitArray(arr, char){
        return [].concat(arr).map((el) => {
            return el.split(char)[0].trim();
        });
    };

    getSplitArrayMulti (arr, chars){
        return [].concat(arr).map((el) => {
            chars.forEach((char) => {
                el = el.split(char)[0];
            });
            return el.trim();
        });
    };

}

module.exports = new Base();