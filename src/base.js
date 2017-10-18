const fs = require('fs');

const chai = require('chai');
const chaiThings = require('chai-things');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiThings);
chai.use(chaiAsPromised);
global.should = chai.should();
global.flow = protractor.promise.controlFlow();

class Base {

    constructor(domain){
        /**
         * wrap timeout. (ms) in t-shirt sizes
         */
        this.timeout = {
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
        this.domain = domain;
        this.savedUrl = '';
    }

    debug() {
        return flow.execute(() => {
            console.log('debug');
        });
    };

    setSynch() {
        return flow.execute(() => {
            browser.waitForAngularEnabled(true);
        });
    };

    setNoSynch() {
        return flow.execute(() => {
            browser.waitForAngularEnabled(false);
        });
    };

    checkSynch() {
        if (this.angular) {
            this.setSynch();
        } else {
            this.setNoSynch();
        }
    };

    sleep(ms) {
        return flow.execute(() => {
            // console.log('*sleep: ${ms} ms');
            browser.sleep(ms);
        });
    };

    pause() {
        this.sleep(this.timeout.xs);
    };

    log(value) {
        if (!!value) {
            return flow.execute(() => {
                console.log(value);
            });
        }
    };

    logTitle() {
        browser.getTitle().then((title) => {
            this.log('Title: ${title}');
        });
    };

    waitForTitle(expected, timeout) {
        return browser.wait(this.EC.titleIs(expected), timeout || this.timeout.xxl, 'Waiting for title: ${expected}');
    };
    waitForTitleContains(expected, timeout) {
        return browser.wait(this.EC.titleContains(expected), timeout || this.timeout.xxl, 'Wait for title contains: ${expected}');
    };
    waitForUrl(expected, timeout) {
        return browser.wait(this.EC.urlIs(expected), timeout || this.timeout.xxl, 'Waiting for url: ${expected}');
    };
    waitForUrlContains(expected, timeout) {
        return browser.wait(this.EC.urlContains(expected), timeout || this.timeout.xxl, 'Wait for url contains: ${expected}');
    };
    waitForAlert(timeout) {
        return browser.wait(this.EC.alertIsPresent(), timeout || this.timeout.xxl, 'Waiting for alert');
    };

    waitFile(filePath, timeout) {
        return browser.wait(() => {
            return fs.existsSync(filePath)
        }, timeout || this.timeout.xxxl, 'Wait File: ${filePath}');
    };
    waitFileGone (filePath, timeout) {
        return browser.wait(() => {
            return !fs.existsSync(filePath)
        }, timeout || this.timeout.xxl, 'Wait File Gone: ${filePath}');
    };

    /**
     * wait and verify that a page object is loaded
     *
     * @requires page to include `loaded` webElement
     */
    at(timeout) {
        return flow.execute(() => {
            this.checkSynch();
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
        return flow.execute(() => {
            this.checkSynch();
            browser.wait(this.EC.presenceOf(this.loaded), timeout || this.timeout.xxxl, 'Wait Loaded Element For Frame: ${this.iframe}');
        });
    };

    /**
     * wait and verify ulr
     *
     * @requires page to include `url` variable
     */
    atUrl(url, timeout) {
        return flow.execute(() => {
            this.checkSynch();
            this.waitForUrl(url || this.url, timeout);
        });
    };

    atUrlContains(url, timeout) {
        return flow.execute(() => {
            this.checkSynch();
            this.waitForUrlContains(url || this.url, timeout);
        });
    };

    /**
     * wait and verify title
     *
     * @requires page to include `title` variable
     */
    atTitle(title, timeout) {
        return flow.execute(() => {
            this.checkSynch();
            this.waitForTitle(title || this.title, timeout);
        });
    };

    atTitleContains(title, timeout) {
        return flow.execute(() => {
            this.checkSynch();
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
        return flow.execute(() => {
            this.checkSynch();
            this.log('*goTo: ${config.webserver + this.url}');
            browser.navigate().to(config.webserver + this.url);
            this.at();
        });
    };

    goToUrl(url) {
        return flow.execute(() => {
            url = url || config.webserver + this.url;
            this.log('*goTo url: ${url}');
            browser.navigate().to(url);
            this.pause();
        });
    };

    saveCurrentUrl() {
        browser.getCurrentUrl().then((currentUrl) => {
            this.log('*save url: ${currentUrl}');
            this.savedUrl = currentUrl;
        });
    };

    goToSavedUrl() {
        return flow.execute(() => {
            this.log('*goTo saved url: ${this.savedUrl}');
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

    goBack() {
        this.log('*goBack');
        return flow.execute(() => {
            this.pause();
            browser.navigate().back();
            this.pause();
        });
    };

    goForward() {
        this.log('*goForward');
        return flow.execute(() => {
            this.pause();
            browser.navigate().forward();
            this.pause();
        });
    };

    switchToWindow(windowHandleIndex) {
        this.setNoSynch();
        return browser.getAllWindowHandles().then((handles) => {
            return browser.switchTo().window(handles[windowHandleIndex]);
        });
    };

    switchToDefault() {
        this.setNoSynch();
        return flow.execute(() => {
            browser.switchTo().defaultContent().then(
                () => {}, (err) => {
                    console.log(err);
                }
            );
        });
    };

    switchToNew(currentWinHandle) {
        this.pause();
        this.setNoSynch();
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
        this.setNoSynch();
        return browser.getAllWindowHandles().then((handles) => {
            return browser.switchTo().window(handles[0]);
        });
    };

    switchToFrame(nameOrIndex) {
        browser.switchTo().defaultContent();
        let frame = this;
        if (!nameOrIndex) {
            frame.iframe.waitInDom();
            nameOrIndex = frame.iframe.getWebElement();
        }
        this.setNoSynch();
        return browser.switchTo().frame(nameOrIndex).then(() => {
            return frame.atFrame();
        });
    };

    /**
     * WebDriver actions.
     */
    static hitReturn() {
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    };

    static hitSpace() {
        browser.actions().sendKeys(protractor.Key.SPACE).perform();
    };

    static hitTab() {
        browser.actions().sendKeys(protractor.Key.TAB).perform();
    };

    static hitEscape() {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    };

    /**
     * WebDriver alerts.
     */
    acceptAlert() {
        browser.getTitle().then((title) => {}, (err) => {
            browser.switchTo().alert().then((alert) => {
                    this.log("Accept alert");
                    alert.accept();
                }, (err) => {
                }
            );
        });
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

    static compareLowerCase(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    };

    static sortFloat(a, b) {
        return a - b;
    };

}

module.exports = new Base();