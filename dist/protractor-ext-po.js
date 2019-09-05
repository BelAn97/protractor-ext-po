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
(() => {
    let ElementFinder = $(``).constructor;
    const base = new Base();
    Object.assign(ElementFinder.prototype, {

        checkPresent(msg) {
            this.isPresent().should.eventually.eq(true, msg || `check that element is present: ${this.locator()}`);
        },

        checkNotPresent(msg) {
            this.isPresent().should.eventually.eq(false, msg || `check that element is not present: ${this.locator()}`);
        },

        checkDisplayed(msg) {
            this.isDisplayed().should.eventually.eq(true, msg || `check that element is displayed: ${this.locator()}`);
        },

        checkNotDisplayed(msg) {
            this.isDisplayed().should.eventually.eq(false, msg || `check that element is not displayed: ${this.locator()}`);
        },

        checkMatch(regexp, msg) {
            this.getText().should.eventually.match(regexp, msg || `check that match: ${this.locator()}`);
        },

        checkText(text, msg) {
            this.getText().should.eventually.eq(text, msg || `check that text: ${this.locator()}`);
        },

        checkTextNotEqual(text, msg) {
            this.getText().should.eventually.not.eq(text, msg || `check that text not equal: ${this.locator()}`);
        },

        checkTextContains(text, msg) {
            this.getText().should.eventually.contains(text, msg || `check that text contains: ${this.locator()}`);
        },

        checkTextContainsOneOf(list, msg) {
            this.getText().should.eventually.contains.oneOf(list, msg || `check that text contains one of: ${this.locator()}`);
        },

        checkTextNotContains(text, msg) {
            this.getText().should.eventually.not.contains(text, msg || `check that text not contains: ${this.locator()}`);
        },

        checkValue(value, msg) {
            this.getValue().should.eventually.eq(value, msg || `check that value: ${this.locator()}`);
        },

        checkValueContains(value, msg) {
            this.getValue().should.eventually.contains(value, msg || `check that value contains: ${this.locator()}`);
        },

        checkHasClass(klass, msg) {
            this.hasClass(klass).should.eventually.eq(true, msg || `check that element has the class: ${this.locator()}`);
        },

        checkNotHasClass(klass, msg) {
            this.hasClass(klass).should.eventually.eq(false, msg || `check that element does not have the class: ${this.locator()}`);
        },

        checkAttribute(attribute, text, msg) {
            this.getAttribute(attribute).should.eventually.eq(text, msg || `check attribute: ` + this.locator());
        },

        checkAttributeNotEqual(attribute, text, msg) {
            this.getAttribute(attribute).should.eventually.not.eq(text, msg || `check attribute not equal: ` + this.locator());
        },

        checkAttributeContains(attribute, text, msg) {
            this.getAttribute(attribute).should.eventually.contains(text, msg || `check attribute contains: ` + this.locator());
        },

        checkAttributeNotContains(attribute, text, msg) {
            this.getAttribute(attribute).should.eventually.not.contains(text, msg || `check attribute not contains: ` + this.locator());
        }
    });
})();
(() => {
    let ElementFinder = $(``).constructor;
    const buffer = require(`copy-paste`);
    const _ = require(`underscore`);
    const base = new Base();
    Object.assign(ElementFinder.prototype, {

        async waitInDom(timeout) {
            await await browser.wait(base.EC.presenceOf(this), timeout || base.timeout.xxl, `wait in dom: ${this.locator()}`);
            return this;
        },

        async waitNotInDom(timeout) {
            await browser.wait(base.EC.stalenessOf(this), timeout || base.timeout.xxl, `wait not in dom: ${this.locator()}`);
            return this;
        },

        async waitReady(timeout) {
            await browser.wait(base.EC.visibilityOf(this), timeout || base.timeout.xxl, `wait for visible: ${this.locator()}`);
            return this;
        },

        async waitInvisible(timeout) {
            await browser.wait(base.EC.invisibilityOf(this), timeout || base.timeout.xxl, `wait for invisible: ${this.locator()}`);
            return this;
        },

        async waitClickable(timeout) {
            await browser.wait(base.EC.elementToBeClickable(this), timeout || base.timeout.xxl, `wait clickable: ${this.locator()}`);
            return this;
        },

        async waitForText(text, timeout) {
            await browser.wait(base.EC.textToBePresentInElement(this, text), timeout || base.timeout.xxl, `wait for text: ${this.locator()}`);
            return this;
        },

        async waitForValue(value, timeout) {
            await browser.wait(base.EC.textToBePresentInElementValue(this, value), timeout || base.timeout.xxl, `wait for value: ${this.locator()}`);
            return this;
        },

        async getParent() {
            return this.element(By.xpath(`./..`));
        },

        async getValue() {
            return this.getAttribute(`value`);
        },

        async hasClass(klass) {
            return this.getAttribute(`class`).then((classes) => {
                base.log(`class attribute: ${classes}`);
                return classes.split(` `).indexOf(klass) !== -1;
            });
        },

        async getInt() {
            return this.getTextReady().then((text) => {
                return parseInt(text.match(/\d+/)[0]);
            });
        },

        async getWidth() {
            return this.getSize().then((size) => {
                return size.width;
            });
        },

        async getNumber() {
            return this.getTextReady().then((text) => {
                return parseFloat(text);
            });
        },

        async findByText(searchText) {
            return this.element(By.xpath(`.//*[text()="${searchText}"]`));
        },

        async focus() {
            await browser.actions().mouseMove(this.waitReady()).perform();
            return this;
        },

        async focusBy(xCoordinate, yCoordinate) {
            await browser.actions().mouseMove(this.waitReady(), {x: xCoordinate, y: yCoordinate}).perform();
            return this;
        },

        async focusClick() {
            return this.focus().clickReady();
        },

        async clearAndSetText(text) {
            let input = await this.waitReady();
            await input.clear().sendKeys(text);
            return this;
        },

        async sendKeysSlow(text, interval) {
            let input = await this.waitReady();
            text.split(``).forEach(async (char) => {
                await input.sendKeys(char);
                await base.sleep(interval || base.timeout.zero);
            });
            return this;
        },

        async clickReady() {
            await this.waitClickable().click();
        },

        async clickByScript() {
            await this.waitInDom();
            await browser.executeScript(`arguments[0].click();`, this);
            return this;
        },

        async clickAndWaitInvisible() {
            await this.click();
            await this.waitInvisible();
        },

        async clickAtCenter() {
            await browser.actions().click(await this.waitClickable()).perform();
            return this;
        },

        async clickAtCorner() {
            await browser.actions().mouseMove(await this.waitClickable(), {x: 1, y: 1}).click().perform();
            return this;
        },

        async clickIfExists() {
            if (await this.isPresent() && await this.isDisplayed()) {
                this.click();
            }
        },

        async clickByCoordinates(xPos, yPos) {
            await browser.actions().mouseMove(this.waitReady(), {x: xPos, y: yPos}).click().perform();
            return this;
        },

        async clickXTimes(repeatNumber) {
            for (let i = 0; i < repeatNumber; i++) {
                await this.clickAndWait();
            }
            return this;
        },

        async doubleClick() {
            await browser.actions().doubleClick().perform();
            return this;
        },

        async pasteFromClipboard(value) {
            await buffer.copy(value);
            await this.clickReady();
            await base.sleep(base.timeout.min);
            await browser.actions().sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.INSERT)).perform();
        },

        async pressEnter() {
            await browser.actions().sendKeys(protractor.Key.ENTER).perform();
            return this;
        },

        async pressHome() {
            await browser.actions().sendKeys(protractor.Key.HOME).perform();
            return this;
        },

        async pressTab() {
            await browser.actions().sendKeys(protractor.Key.TAB).perform();
            return this;
        },

        async pressUp() {
            await browser.actions().sendKeys(protractor.Key.UP).perform();
            return this;
        },

        async pressDown() {
            await browser.actions().sendKeys(protractor.Key.DOWN).perform();
            return this;
        },

        async getTextReady() {
            return this.waitReady().getText();
        },

        async scrollAndGetTextList(list, scrolledPanel, scrolledElements, scrollCount) {
            browser.executeScript(`arguments[0].scrollIntoView(false);`, scrolledPanel);
            return this.getTextList().then((newList) => {
                if (scrollCount > 0) {
                    return this.scrollAndGetTextList(_.union(list, newList), scrolledPanel, scrolledElements, scrollCount - 1);
                } else {
                    return _.union(list, newList);
                }
            });
        },

        async getTextListAtScrolled(scrolledElements, scrollCount) {
            return scrolledElements.getTextList().then((list) => {
                return this.scrollAndGetTextList(list, this, scrolledElements, scrollCount)
            });
        }

    });
})
();
(() => {
    let ElementFinder = $('').constructor;
    const base = new Base();

    Object.assign(ElementFinder.prototype, {

        asCheckBox() {
            return {
                async get() {
                    return this;
                },
                async check() {
                    if (!this.isChecked()) {
                        this.clickScript();
                    }
                },
                async uncheck() {
                    if (this.isChecked()) {
                        this.clickScript();
                    }
                },
                async isChecked() {
                    return this.isSelected();
                }
            };
        }
    });
})();
(() => {
    let ElementArrayFinder = $$(``).constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        checkPresent(msg) {
            this.isPresent().should.eventually.eq(true, msg || `check that element is present: ${this.locator()}`);
        },

        checkNotPresent(msg) {
            this.isPresent().should.eventually.eq(false, msg || `check that element is not present: ${this.locator()}`);
        },

        checkDisplayed(msg) {
            this.isDisplayedOneOf().should.eventually.eq(true, msg || `check that one of elements is displayed: ${this.locator()}`);
        },

        checkNotDisplayed(msg) {
            this.isDisplayedOneOf().should.eventually.eq(false, msg || `check that all elements are not displayed: ${this.locator()}`);
        },

        checkTextListEqual(expectedList, msg) {
            this.getTextList().should.eventually.eql(expectedList, msg || `check that text list equal: ${this.locator()}`);
        },

        checkTextListNotEqual(expectedList, msg) {
            this.getTextList().should.not.eventually.eql(expectedList, msg || `check that text list not equal: ${this.locator()}`);
        },

        checkTextListIncludeMember(member, msg) {
            this.getTextList().should.eventually.include(member, msg || `check that text list include the member: ${this.locator()}`);
        },

        checkTextListIncludeMembers(membersList, msg) {
            this.getTextList().should.eventually.include.members(membersList, msg || `check that text list include members: ${this.locator()}`);
        },

        checkTextListAllBeOneOf(membersList, msg) {
            this.getTextList().should.eventually.all.be.oneOf(membersList, msg || `check list include members: ` + this.locator());
        },

        checkTextListNotIncludeMember(member, msg) {
            this.getTextList().should.eventually.not.include(member, msg || `check list not include member: ` + this.locator());
        },

        checkTextListNotIncludeMembers(membersList, msg) {
            this.getTextList().should.eventually.not.include.members(membersList, msg || `check list not include members: ` + this.locator());
        },

        checkTextListHaveMembers(membersList, msg) {
            this.getTextList().should.eventually.have.members(membersList, msg || `check that text list have members: ${this.locator()}`);
        },

        checkListCount(expectedCount, msg) {
            this.count().should.eventually.eql(expectedCount, msg || `check that list count: ${this.locator()}`);
        },

        checkTextListMatch(regexp, msg, lowerCase) {
            if (lowerCase) {
                this.getTextListLowerCase().should.eventually.match(regexp, msg || `check that text list match: ${this.locator()}`);
            } else {
                this.getTextList().should.eventually.match(regexp, msg || `check that text list match: ${this.locator()}`);
            }
        },

        checkListNotMatch(regexp, msg, lowerCase) {
            if (lowerCase) {
                this.getTextListLowerCase().should.eventually.not.match(regexp, msg || `check list not match: ` + this.locator());
            } else {
                this.getTextList().should.eventually.not.match(regexp, msg || `check list not match: ` + this.locator());
            }
        },

        checkSortAscending(compareFn, limit) {
            this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = compareFn ? sorted.sort(compareFn) : sorted.sort();
                sorted.should.deep.equal(unSorted, `check Ascending`);
            });
        },

        checkSortDescending(compareFn, limit) {
            this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = compareFn ? sorted.sort(compareFn) : sorted.sort();
                sorted.reverse().should.deep.equal(unSorted, `check Descending`);
            });
        },

        checkTextMatch(regexp) {
            this.map((elm) => {
                elm.getText().then((val) => {
                    // console.log(val.trim());
                    val.should.match(regexp);
                });
            });
        }

    });
})();
(() => {
    let ElementArrayFinder = $$('').constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        async waitInDom(timeout) {
            browser.wait(base.EC.presenceOf(this), timeout || base.timeout.xxl, `wait in dom: ${this.locator()}`);
            return this;
        },

        async isDisplayedOneOf() {
            return this.filter((el) => {
                return el.isDisplayed();
            }).count().then((count) => {
                return count > 0;
            });
        },

        async isPresentOneOf() {
            return this.filter((el) => {
                return el.isPresent();
            }).count().then((count) => {
                return count > 0;
            });
        },

        async waitReady(timeout) {
            this.waitInDom();
            browser.wait(this.isDisplayedOneOf(), timeout || base.timeout.xxl, `wait for visible one of: ${this.locator()}`);
            return this;
        },

        async waitAllInvisible() {
            this.filter((el) => {
                return el.isPresent()
            }).each((el) => {
                el.waitInvisible();
            });
        },

        async waitAllNotInDom() {
            element(this.locator()).waitNotInDom();
        },

        async slice(begin, end) {
            return this.then((elements) => {
                return elements.slice(begin, end);
            });
        },

        async getParents() {
            return this.all(By.xpath('./..'));
        },

        async getFirstVisible() {
            this.waitReady();
            return this.filter((el) => {
                return el.isDisplayed();
            }).first();
        },

        async getLastVisible() {
            this.waitReady();
            return this.filter((el) => {
                return el.isDisplayed();
            }).last();
        },

        async clickAtFirstVisible() {
            this.getFirstVisible().click();
        },

        async clickAtLastVisible() {
            this.getLastVisible().click();
        },

        async getTextList(trim) {
            return this.map((elm) => {
                return elm.getText().then((val) => {
                    return trim ? val.trim() : val;
                });
            });
        },

        async getTextListLimit(limit, trim) {
            return this.map((elm, i) => {
                if (!limit || i < limit) {
                    return elm.getText().then((val) => {
                        return trim ? val.trim() : val;
                    });
                }
            });
        },

        async getTextListNorm() {
            return this.map((elm) => {
                return elm.getText().then((val) => {
                    return val.replace(/\n/g, ' ');
                });
            });
        },

        async getTextListLowerCase() {
            return this.map((elm) => {
                return elm.getText().then((val) => {
                    return val.trim().toLowerCase();
                });
            });
        },

        async getTextListSubstring(char) {
            return this.map((elm) => {
                return elm.getText().then((val) => {
                    return val.split(char)[0].trim();
                });
            });
        },

        async getIntList() {
            return this.map((elm) => {
                return elm.getText().then((val) => {
                    return parseInt(val.trim());
                });
            });
        },

        async getAttributeList(attribute) {
            return this.map((elm) => {
                return elm.getAttribute(attribute).then((val) => {
                    return val.trim();
                });
            });
        },

        async getAllByText(text) {
            return this.all(By.xpath(`./..//*[normalize-space(text())="${text}" or normalize-space(.)="${text}"]`));
        },

        async getFirstByText(text) {
            return this.getAllByText(text).getFirstVisible();
        },

        async clickFirstByText(text) {
            return this.getAllByText(text).clickAtFirstVisible();
        },

        async getAllByTextContains(text) {
            return this.all(By.xpath(`./..//*[contains(normalize-space(text()),"${text}") or contains(normalize-space(.),"${text}")]`));
        },

        async getFirstByTextContains(text) {
            return this.getAllByTextContains(text).getFirstVisible();
        },

        async clickFirstByTextContains(text) {
            return this.getAllByTextContains(text).clickAtFirstVisible();
        },

        async clickAtLink(text) {
            return this.all(By.linkText(text)).first().click();
        },

        async getReadyFirst() {
            this.waitReady();
            return this.first();
        },

        async clickReadyFirst() {
            this.getReadyFirst().click();
        },

        async getReadyLast() {
            this.waitReady();
            return this.last();
        },

        async clickReadyLast() {
            this.getReadyLast().click();
        },

        async getReadyByIndex(index) {
            this.waitReady();
            return this.get(index).waitReady();
        }

    });
})();
(() => {
    let ElementArrayFinder = $$('').constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        asRadio() {
            let labels = this.getParents();
            return {
                async get() {
                    return this;
                },
                async getNames() {
                    return labels.getTextList();
                },
                async isSelectedByName(name) {
                    return labels.getFirstByTextContains(name).$('input').isSelected();
                },
                async getByName(name) {
                    return labels.getFirstByText(name);
                },
                async getByNameContains(name) {
                    return labels.getFirstByTextContains(name);
                },
                async selectByName(name) {
                    await labels.clickFirstByText(name);
                },
                async selectByNameContains(name) {
                    await labels.clickFirstByTextContains(name);
                },
                async selectByIndex(index) {
                    await labels.get(index).click();
                }
            }
        }
    });
})();
/**
 * Custom locators.
 */
(() => {

    By.addLocator('cssHasText', (cssEl, text, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        return Array.prototype.filter.call(els, (el) => {
            return el.textContent.trim() === text;
        });
    });

    By.addLocator('cssHasSubCss', (cssEl, subCss, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        return Array.prototype.filter.call(els, (el) => {
            return el.querySelectorAll(subCss).length > 0
        });
    });

    By.addLocator('cssHasSubCssWithText', (cssEl, subCss, cssText, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        return Array.prototype.filter.call(els, (el) => {
            return Array.prototype.filter.call(el.querySelectorAll(subCss), (el) => {
                return el.textContent.trim() === cssText;
            }).length > 0
        });
    });

    By.addLocator('cssSplitText', (cssEl, cssText, splitChar, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        return Array.prototype.filter.call(els, (el) => {
            return el.textContent.split(splitChar)[0].trim() === cssText;
        });
    });

    By.addLocator('cssHasTagText', (cssEl, text, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        return Array.prototype.filter.call(els, (el) => {
            return el.innerHTML.indexOf('>' + text + '<') >= 0 || el.innerHTML.replace(/([\r\n\t])/g, '').search(new RegExp('>(\\s*)' + text.replace('(', '\\(').replace(')', '\\)') + '(\\s*)<', 'g')) >= 0;
        });
    });
})();
/**
 * Utils.
 */
(() => {
    Object.assign(Array.prototype, {

            contains(it) {
                return this.indexOf(it) > -1;
            },

            containsOneOf(arr) {
                var found = false;
                this.forEach((it) => {
                    if (arr.indexOf(it) > -1) {
                        found = true;
                    }
                });
                return found;
            },

            toLowerCase() {
                return this.map((el) => {
                    return el.toLowerCase();
                });
            },

            toUpperCase() {
                return this.map((el) => {
                    return el.toUpperCase();
                });
            },

            removeEmpty() {
                return this.filter((el) => {
                    return !el.isEmpty();
                });
            }
        },

        Object.assign(String.prototype, {

            contains(it) {
                return this.indexOf(it) !== -1;
            },

            containsOneOf(arr) {
                var found = false;
                var text = this;
                arr.forEach((it) => {
                    if (text.contains(it)) {
                        found = true;
                    }
                });
                return found;
            },

            format() {
                var args = arguments;
                var i = -1;
                return this.replace(/\{(?:[^{}]|\{*\})*\}/g, (val) => {
                    i++;
                    return args[i] !== undefined ? args[i] : val;
                });
            },

            getDigits() {
                return this.match(/\d+/)[0]
            }
        }))
})();