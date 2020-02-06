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
    async checkWaitForAngular() {
        if (this.angular !== undefined) {
            if (this.angular) {
                await this.setWaitForAngularEnabled();
            } else {
                await this.setWaitForAngularDisabled();
            }
        }
    };

    async sleep(ms) {
        await console.log(`*sleep: ${ms} ms`);
        await browser.sleep(ms);
    };

    async pause() {
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
        this.log(`*goTo: ${base.domain + this.url}`);
        await browser.navigate().to(base.domain + this.url);
        await this.at();
    };

    async goToUrl(url) {
        url = url || base.domain + this.url;
        this.log(`*goTo url: ${url}`);
        await browser.navigate().to(url);
        await this.pause();
    };

    async goToPath(path) {
        this.log(`*goTo path: ` + base.domain + path);
        await browser.get(base.domain + path);
    };

    async saveCurrentUrl() {
        await browser.getCurrentUrl().then((currentUrl) => {
            this.log(`*save url: ${currentUrl}`);
            this.savedUrl = currentUrl;
        });
    };

    async goToSavedUrl() {
        this.log(`*goTo saved url: ${this.savedUrl}`);
        await browser.navigate().to(this.savedUrl);
        await this.pause();
    };

    async restart() {
        this.log(`*restart`);
        browser.restartSync();
    };

    async refresh() {
        this.log(`*refresh`);
        await browser.refresh();
    };

    async resetSession() {
        this.log(`*resetSession`);
        await browser.driver.manage().deleteAllCookies().then(async () => {
            await browser.executeScript(`window.localStorage.clear(); window.sessionStorage.clear();`);
            await browser.refresh();
        })
    };

    async goBack() {
        this.log(`*goBack`);
        await this.pause();
        await browser.navigate().back();
        await this.pause();
    };

    async goForward() {
        this.log(`*goForward`);
        await this.pause();
        await browser.navigate().forward();
        await this.pause();
    };

    async switchToWindow(windowHandleIndex) {
        await this.setWaitForAngularDisabled();
        await browser.getAllWindowHandles().then(async (handles) => {
            return await browser.switchTo().window(handles[windowHandleIndex]);
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
                browser.close();
                return (await base.switchToWindow(0));
            }
            return handles[0];
        });
    };

    async switchToFrame(nameOrIndex) {
        await browser.switchTo().defaultContent();
        if (!nameOrIndex) {
            await this.iframe.waitInDom();
            nameOrIndex = this.iframe.getWebElement();
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
        if (await base.isAlertPresent()) {
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
                (await alert.getText()).should.eq(message);
                this.log("Accept alert");
                await alert.accept();
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

        async checkPresent(msg) {
            (await this.isPresent()).should.eq(true, msg || `check that element is present: ${this.locator()}`);
        },

        async checkNotPresent(msg) {
            (await this.isPresent()).should.eq(false, msg || `check that element is not present: ${this.locator()}`);
        },

        async checkDisplayed(msg) {
            (await this.isDisplayed()).should.eq(true, msg || `check that element is displayed: ${this.locator()}`);
        },

        async checkNotDisplayed(msg) {
            (await this.isDisplayed()).should.eq(false, msg || `check that element is not displayed: ${this.locator()}`);
        },

        async checkMatch(regexp, msg) {
            (await this.getText()).should.match(regexp, msg || `check that match: ${this.locator()}`);
        },

        async checkText(text, msg) {
            (await this.getText()).should.eq(text, msg || `check that text: ${this.locator()}`);
        },

        async checkTextNotEqual(text, msg) {
            (await this.getText()).should.not.eq(text, msg || `check that text not equal: ${this.locator()}`);
        },

        async checkTextContains(text, msg) {
            (await this.getText()).should.contains(text, msg || `check that text contains: ${this.locator()}`);
        },

        async checkTextContainsOneOf(list, msg) {
            (this.getText()).should.contains.oneOf(list, msg || `check that text contains one of: ${this.locator()}`);
        },

        async checkTextNotContains(text, msg) {
            (await this.getText()).should.not.contains(text, msg || `check that text not contains: ${this.locator()}`);
        },

        async checkValue(value, msg) {
            (await this.getValue()).should.eq(value, msg || `check that value: ${this.locator()}`);
        },

        async checkValueContains(value, msg) {
            (await this.getValue()).should.contains(value, msg || `check that value contains: ${this.locator()}`);
        },

        async checkHasClass(klass, msg) {
            (await this.hasClass(klass)).should.eq(true, msg || `check that element has the class: ${this.locator()}`);
        },

        async checkNotHasClass(klass, msg) {
            (await this.hasClass(klass)).should.eq(false, msg || `check that element does not have the class: ${this.locator()}`);
        },

        async checkAttribute(attribute, text, msg) {
            (await this.getAttribute(attribute)).should.eq(text, msg || `check attribute: ` + this.locator());
        },

        async checkAttributeNotEqual(attribute, text, msg) {
            (await this.getAttribute(attribute)).should.not.eq(text, msg || `check attribute not equal: ` + this.locator());
        },

        async checkAttributeContains(attribute, text, msg) {
            (await this.getAttribute(attribute)).should.contains(text, msg || `check attribute contains: ` + this.locator());
        },

        async checkAttributeNotContains(attribute, text, msg) {
            (await this.getAttribute(attribute)).should.not.contains(text, msg || `check attribute not contains: ` + this.locator());
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
            await browser.wait(base.EC.presenceOf(this), timeout || base.timeout.xxl, `wait in dom: ${this.locator()}`);
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

        async isDisplayedWait(timeoutMs) {
            let timeout = browser.getPageTimeout;
            browser.getPageTimeout = timeoutMs || 0;
            let displayed = await this.isDisplayed();
            browser.getPageTimeout = timeout;
            return displayed;
        },

        async isPresentWait(timeoutMs) {
            let timeout = browser.getPageTimeout;
            browser.getPageTimeout = timeoutMs || 0;
            let present = await this.isPresent();
            browser.getPageTimeout = timeout;
            return present;
        },

        getParent() {
            return this.element(by.xpath(`./..`));
        },

        async getValue() {
            return (await this.getAttribute(`value`));
        },

        async hasClass(klass) {
            return await this.getAttribute(`class`).then((classes) => {
                base.log(`class attribute: ${classes}`);
                return classes.split(` `).indexOf(klass) !== -1;
            });
        },

        async getInt() {
            return await this.getTextReady().then((text) => {
                return parseInt(text.match(/\d+/)[0]);
            });
        },

        async getWidth() {
            return await this.getSize().then((size) => {
                return size.width;
            });
        },

        async getNumber() {
            return await this.getTextReady().then((text) => {
                return parseFloat(text);
            });
        },

        findByText(searchText) {
            return this.element(by.xpath(`.//*[text()="${searchText}"]`));
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
            return await this.focus().clickReady();
        },

        async clearAndSetText(text) {
            let input = await this.waitReady();
            await input.clear().sendKeys(text);
            return this;
        },

        async sendKeysSlow(text, interval) {
            let input = await this.waitReady();
            await text.split(``).forEach(async (char) => {
                await input.sendKeys(char);
                await base.sleep(interval || base.timeout.zero);
            });
            return this;
        },

        async clickReady() {
            await this.waitClickable();
            await this.click();
            return this;
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
            await browser.actions().click(this.waitClickable()).perform();
            return this;
        },

        async clickAtCorner() {
            await browser.actions().mouseMove(this.waitClickable(), {x: 1, y: 1}).click().perform();
            return this;
        },

        async clickIfExists() {
            if (await this.isPresent() && await this.isDisplayed()) {
                await this.click();
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
            return (await (await this.waitReady()).getText());
        },

        async scrollAndGetTextList(list, scrolledPanel, scrolledElements, scrollCount) {
            await browser.executeScript(`arguments[0].scrollIntoView(false);`, scrolledPanel);
            return await this.getTextList().then(async (newList) => {
                if (scrollCount > 0) {
                    return await this.scrollAndGetTextList(_.union(list, newList), scrolledPanel, scrolledElements, scrollCount - 1);
                } else {
                    return _.union(list, newList);
                }
            });
        },

        async getTextListAtScrolled(scrolledElements, scrollCount) {
            return await scrolledElements.getTextList().then(async (list) => {
                return await this.scrollAndGetTextList(list, this, scrolledElements, scrollCount)
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
            let root = this;
            return {
                get() {
                    return root;
                },
                async check() {
                    if (!await this.isChecked()) {
                        await root.clickByScript();
                    }
                },
                async uncheck() {
                    if (await this.isChecked()) {
                        await root.clickByScript();
                    }
                },
                async isChecked() {
                    return (await root.isSelected());
                }
            };
        },
        asSelector() {
            let root = this;
            let options = root.$$('option');
            let selected = root.$$('option[selected="selected"]');
            return {
                get() {
                    return root;
                },
                async select(itemName) {
                    await root.element(by.cssContainingText('option', itemName)).click();
                },
                async getSelected() {
                    return await selected.getText();
                },
                getOptions() {
                    return options;
                },
                async getOptionsList() {
                    return await options.getTextList();
                }
            };
        }
    });
})();

(() => {
    let ElementArrayFinder = $$(``).constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        async checkPresent(msg) {
            (await this.isPresent()).should.eq(true, msg || `check that element is present: ${this.locator()}`);
        },

        async checkNotPresent(msg) {
            (await this.isPresent()).should.eq(false, msg || `check that element is not present: ${this.locator()}`);
        },

        async checkDisplayed(msg) {
            (await this.isDisplayedOneOf()).should.eq(true, msg || `check that one of elements is displayed: ${this.locator()}`);
        },

        async checkNotDisplayed(msg) {
            (await this.isDisplayedOneOf()).should.eq(false, msg || `check that all elements are not displayed: ${this.locator()}`);
        },

        async checkTextListEqual(expectedList, msg) {
            (await this.getTextList()).should.eql(expectedList, msg || `check that text list equal: ${this.locator()}`);
        },

        async checkTextListNotEqual(expectedList, msg) {
            (await this.getTextList()).should.not.eql(expectedList, msg || `check that text list not equal: ${this.locator()}`);
        },

        async checkTextListIncludeMember(member, msg) {
            (await this.getTextList()).should.include(member, msg || `check that text list include the member: ${this.locator()}`);
        },

        async checkTextListIncludeMembers(membersList, msg) {
            (await this.getTextList()).should.include.members(membersList, msg || `check that text list include members: ${this.locator()}`);
        },

        async checkTextListAllBeOneOf(membersList, msg) {
            (await this.getTextList()).should.all.be.oneOf(membersList, msg || `check list include members: ` + this.locator());
        },

        async checkTextListNotIncludeMember(member, msg) {
            (await this.getTextList()).should.not.include(member, msg || `check list not include member: ` + this.locator());
        },

        async checkTextListNotIncludeMembers(membersList, msg) {
            (await this.getTextList()).should.not.include.members(membersList, msg || `check list not include members: ` + this.locator());
        },

        async checkTextListHaveMembers(membersList, msg) {
            (await this.getTextList()).should.have.members(membersList, msg || `check that text list have members: ${this.locator()}`);
        },

        async checkListCount(expectedCount, msg) {
            (await this.count()).should.eql(expectedCount, msg || `check that list count: ${this.locator()}`);
        },

        async checkTextListMatch(regexp, msg, lowerCase) {
            if (lowerCase) {
                (await this.getTextListLowerCase()).should.match(regexp, msg || `check that text list match: ${this.locator()}`);
            } else {
                (await this.getTextList()).should.match(regexp, msg || `check that text list match: ${this.locator()}`);
            }
        },

        async checkListNotMatch(regexp, msg, lowerCase) {
            if (lowerCase) {
                (await this.getTextListLowerCase()).should.not.match(regexp, msg || `check list not match: ` + this.locator());
            } else {
                (await this.getTextList()).should.not.match(regexp, msg || `check list not match: ` + this.locator());
            }
        },

        async checkSortAscending(compareFn, limit) {
            await this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = compareFn ? sorted.sort(compareFn) : sorted.sort();
                sorted.should.deep.equal(unSorted, `check Ascending`);
            });
        },

        async checkSortDescending(compareFn, limit) {
            await this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = compareFn ? sorted.sort(compareFn) : sorted.sort();
                sorted.reverse().should.deep.equal(unSorted, `check Descending`);
            });
        },

        async checkTextMatch(regexp) {
            await this.map(async (elm) => {
                await elm.getText().then((val) => {
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
            await browser.wait(base.EC.presenceOf(this), timeout || base.timeout.xxl, `wait in dom: ${this.locator()}`);
            return this;
        },

        async isDisplayedOneOf() {
            return await this.filter(async (el) => {
                return (await el.isDisplayed());
            }).count().then((count) => {
                return count > 0;
            });
        },

        async isPresentOneOf() {
            return await this.filter(async (el) => {
                return (await el.isPresent());
            }).count().then((count) => {
                return count > 0;
            });
        },

        async waitReady(timeout) {
            await this.waitInDom();
            await browser.wait(this.isDisplayedOneOf(), timeout || base.timeout.xxl, `wait for visible one of: ${this.locator()}`);
            return this;
        },

        async waitAllInvisible() {
            await this.filter(async (el) => {
                return await el.isPresent()
            }).each(async (el) => {
                await el.waitInvisible();
            });
        },

        async waitAllNotInDom() {
            await element(this.locator()).waitNotInDom();
        },

        async slice(begin, end) {
            return await this.then((elements) => {
                return elements.slice(begin, end);
            });
        },

        getParents() {
            return this.all(by.xpath('./..'));
        },

        async getFirstVisible() {
            await this.waitReady();
            return await this.filter(async (el) => {
                return (await el.isDisplayed());
            }).first();
        },

        async getLastVisible() {
            await this.waitReady();
            return await this.filter(async (el) => {
                return (await el.isDisplayed());
            }).last();
        },

        async clickAtFirstVisible() {
            await (await this.getFirstVisible()).click();
        },

        async clickAtLastVisible() {
            await (await this.getLastVisible()).click();
        },

        async getTextList(trim) {
            return await this.map(async (elm) => {
                return await elm.getText().then((val) => {
                    return trim ? val.trim() : val;
                });
            });
        },

        async getTextListLimit(limit, trim) {
            return await this.map(async (elm, i) => {
                if (!limit || i < limit) {
                    return await elm.getText().then((val) => {
                        return trim ? val.trim() : val;
                    });
                }
            });
        },

        async getTextListNorm() {
            return await this.map(async (elm) => {
                return await elm.getText().then((val) => {
                    return val.replace(/\n/g, ' ');
                });
            });
        },

        async getTextListLowerCase() {
            return await this.map(async (elm) => {
                return await elm.getText().then((val) => {
                    return val.trim().toLowerCase();
                });
            });
        },

        async getTextListSubstring(char) {
            return await this.map(async (elm) => {
                return await elm.getText().then((val) => {
                    return val.split(char)[0].trim();
                });
            });
        },

        async getIntList() {
            return await this.map(async (elm) => {
                return await elm.getText().then((val) => {
                    return parseInt(val.trim());
                });
            });
        },

        async getAttributeList(attribute) {
            return await this.map(async (elm) => {
                return await elm.getAttribute(attribute).then((val) => {
                    return val.trim();
                });
            });
        },

        getAllByText(text) {
            return this.all(by.xpath(`./..//*[normalize-space(text())="${text}" or normalize-space(.)="${text}"]`));
        },

        async getFirstByText(text) {
            return await this.getAllByText(text).getFirstVisible();
        },

        async clickFirstByText(text) {
            return await this.getAllByText(text).clickAtFirstVisible();
        },

        getAllByTextContains(text) {
            return this.all(by.xpath(`./..//*[contains(normalize-space(text()),"${text}") or contains(normalize-space(.),"${text}")]`));
        },

        async getFirstByTextContains(text) {
            return await this.getAllByTextContains(text).getFirstVisible();
        },

        async clickFirstByTextContains(text) {
            return await this.getAllByTextContains(text).clickAtFirstVisible();
        },

        async clickAtLink(text) {
            return await this.all(by.linkText(text)).first().click();
        },

        async getReadyFirst() {
            await this.waitReady();
            return this.first();
        },

        async clickReadyFirst() {
            await (await this.getReadyFirst()).click();
        },

        async getReadyLast() {
            await this.waitReady();
            return this.last();
        },

        async clickReadyLast() {
            await (await this.getReadyLast()).click();
        },

        async getReadyByIndex(index) {
            await this.waitReady();
            return await this.get(index).waitReady();
        }

    });
})();

(() => {
    let ElementArrayFinder = $$('').constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        asRadio() {
            let root = this;
            let labels = this.getParents();
            return {
                get() {
                    return root;
                },
                async getNames() {
                    return await labels.getTextList();
                },
                async isSelectedByName(name) {
                    return await labels.getFirstByTextContains(name).$('input').isSelected();
                },
                async getByName(name) {
                    return await labels.getFirstByText(name);
                },
                async getByNameContains(name) {
                    return await labels.getFirstByTextContains(name);
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
    });

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
    })
})();