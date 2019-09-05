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

    setWaitForAngularEnabled() {
        flow.execute(() => {
            browser.waitForAngularEnabled(true);
        });
    };

    setWaitForAngularDisabled() {
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
                this.setWaitForAngularEnabled();
            } else {
                this.setWaitForAngularDisabled();
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
        flow.execute(() => {
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
     * navigate to a page via it`s `url` var
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
            this.log(`*goTo path: ` + base.domain + path);
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
        flow.execute(() => {
            this.pause();
            browser.navigate().back();
            this.pause();
        });
    };

    goForward() {
        this.log(`*goForward`);
        flow.execute(() => {
            this.pause();
            browser.navigate().forward();
            this.pause();
        });
    };

    switchToWindow(windowHandleIndex) {
        this.setWaitForAngularDisabled();
        browser.getAllWindowHandles().then((handles) => {
            return browser.switchTo().window(handles[windowHandleIndex]);
        });
    };

    switchToDefault() {
        this.setWaitForAngularDisabled();
        flow.execute(() => {
            browser.switchTo().defaultContent().then(
                () => {
                }, (err) => {
                    console.log(err);
                }
            );
        });
    };

    switchToDefaultState() {
        this.setWaitForAngularDisabled();
        flow.execute(() => {
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

        waitInDom(timeout) {
            browser.wait(base.EC.presenceOf(this), timeout || base.timeout.xxl, `wait in dom: ${this.locator()}`);
            return this;
        },

        waitNotInDom(timeout) {
            browser.wait(base.EC.stalenessOf(this), timeout || base.timeout.xxl, `wait not in dom: ${this.locator()}`);
            return this;
        },

        waitReady(timeout) {
            browser.wait(base.EC.visibilityOf(this), timeout || base.timeout.xxl, `wait for visible: ${this.locator()}`);
            return this;
        },

        waitInvisible(timeout) {
            browser.wait(base.EC.invisibilityOf(this), timeout || base.timeout.xxl, `wait for invisible: ${this.locator()}`);
            return this;
        },

        waitClickable(timeout) {
            browser.wait(base.EC.elementToBeClickable(this), timeout || base.timeout.xxl, `wait clickable: ${this.locator()}`);
            return this;
        },

        waitForText(text, timeout) {
            browser.wait(base.EC.textToBePresentInElement(this, text), timeout || base.timeout.xxl, `wait for text: ${this.locator()}`);
            return this;
        },

        waitForValue(value, timeout) {
            browser.wait(base.EC.textToBePresentInElementValue(this, value), timeout || base.timeout.xxl, `wait for value: ${this.locator()}`);
            return this;
        },

        getParent() {
            return this.element(By.xpath(`./..`));
        },

        getValue() {
            return this.getAttribute(`value`);
        },

        hasClass(klass) {
            return this.getAttribute(`class`).then((classes) => {
                base.log(`class attribute: ${classes}`);
                return classes.split(` `).indexOf(klass) !== -1;
            });
        },

        getInt() {
            return this.getTextReady().then((text) => {
                return parseInt(text.match(/\d+/)[0]);
            });
        },

        getWidth() {
            return this.getSize().then((size) => {
                return size.width;
            });
        },

        getNumber() {
            return this.getTextReady().then((text) => {
                return parseFloat(text);
            });
        },

        findByText(searchText) {
            return this.element(By.xpath(`.//*[text()="${searchText}"]`));
        },

        focus() {
            browser.actions().mouseMove(this.waitReady()).perform();
            return this;
        },

        focusBy(xCoordinate, yCoordinate) {
            browser.actions().mouseMove(this.waitReady(), {x: xCoordinate, y: yCoordinate}).perform();
            return this;
        },

        focusClick() {
            return this.focus().clickReady();
        },

        clearAndSetText(text) {
            let input = this.waitReady();
            input.clear().sendKeys(text);
            return this;
        },

        sendKeysSlow(text, interval) {
            let input = this.waitReady();
            text.split(``).forEach((char) => {
                input.sendKeys(char);
                base.sleep(interval || base.timeout.zero);
            });
            return this;
        },

        clickReady() {
            this.waitClickable().click();
        },

        clickByScript() {
            this.waitInDom();
            browser.executeScript(`arguments[0].click();`, this);
            return this;
        },

        clickAndWaitInvisible() {
            this.click();
            this.waitInvisible();
        },

        clickAtCenter() {
            browser.actions().click(this.waitClickable()).perform();
            return this;
        },

        clickAtCorner() {
            browser.actions().mouseMove(this.waitClickable(), {x: 1, y: 1}).click().perform();
            return this;
        },

        clickIfExists() {
            if (this.isPresent() && this.isDisplayed()) {
                this.click();
            }
        },

        clickByCoordinates(xPos, yPos) {
            browser.actions().mouseMove(this.waitReady(), {x: xPos, y: yPos}).click().perform();
            return this;
        },

        clickXTimes(repeatNumber) {
            for (let i = 0; i < repeatNumber; i++) {
                this.clickAndWait();
            }
            return this;
        },

        doubleClick() {
            browser.actions().doubleClick().perform();
            return this;
        },

        pasteFromClipboard(value) {
            buffer.copy(value);
            this.clickReady();
            base.sleep(base.timeout.min);
            browser.actions().sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.INSERT)).perform();
        },

        pressEnter() {
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
            return this;
        },

        pressHome() {
            browser.actions().sendKeys(protractor.Key.HOME).perform();
            return this;
        },

        pressTab() {
            browser.actions().sendKeys(protractor.Key.TAB).perform();
            return this;
        },

        pressUp() {
            browser.actions().sendKeys(protractor.Key.UP).perform();
            return this;
        },

        pressDown() {
            browser.actions().sendKeys(protractor.Key.DOWN).perform();
            return this;
        },

        getTextReady() {
            return this.waitReady().getText();
        },

        scrollAndGetTextList(list, scrolledPanel, scrolledElements, scrollCount) {
            browser.executeScript(`arguments[0].scrollIntoView(false);`, scrolledPanel);
            return this.getTextList().then((newList) => {
                if (scrollCount > 0) {
                    return this.scrollAndGetTextList(_.union(list, newList), scrolledPanel, scrolledElements, scrollCount - 1);
                } else {
                    return _.union(list, newList);
                }
            });
        },

        getTextListAtScrolled(scrolledElements, scrollCount) {
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
                get() {
                    return this;
                },
                check() {
                    if (!this.isChecked()) {
                        this.clickScript();
                    }
                },
                uncheck() {
                    if (this.isChecked()) {
                        this.clickScript();
                    }
                },
                isChecked() {
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

        waitInDom(timeout) {
            browser.wait(base.EC.presenceOf(this), timeout || base.timeout.xxl, `wait in dom: ${this.locator()}`);
            return this;
        },

        isDisplayedOneOf() {
            return this.filter((el) => {
                return el.isDisplayed();
            }).count().then((count) => {
                return count > 0;
            });
        },

        isPresentOneOf() {
            return this.filter((el) => {
                return el.isPresent();
            }).count().then((count) => {
                return count > 0;
            });
        },

        waitReady(timeout) {
            this.waitInDom();
            browser.wait(this.isDisplayedOneOf(), timeout || base.timeout.xxl, `wait for visible one of: ${this.locator()}`);
            return this;
        },

        waitAllInvisible() {
            this.filter((el) => {
                return el.isPresent()
            }).each((el) => {
                el.waitInvisible();
            });
        },

        waitAllNotInDom() {
            element(this.locator()).waitNotInDom();
        },

        slice(begin, end) {
            return this.then((elements) => {
                return elements.slice(begin, end);
            });
        },

        getParents() {
            return this.all(By.xpath('./..'));
        },

        getFirstVisible() {
            this.waitReady();
            return this.filter((el) => {
                return el.isDisplayed();
            }).first();
        },

        getLastVisible() {
            this.waitReady();
            return this.filter((el) => {
                return el.isDisplayed();
            }).last();
        },

        clickAtFirstVisible() {
            this.getFirstVisible().click();
        },

        clickAtLastVisible() {
            this.getLastVisible().click();
        },

        getTextList(trim) {
            return this.map((elm) => {
                return elm.getText().then((val) => {
                    return trim ? val.trim() : val;
                });
            });
        },

        getTextListLimit(limit, trim) {
            return this.map((elm, i) => {
                if (!limit || i < limit) {
                    return elm.getText().then((val) => {
                        return trim ? val.trim() : val;
                    });
                }
            });
        },

        getTextListNorm() {
            return this.map((elm) => {
                return elm.getText().then((val) => {
                    return val.replace(/\n/g, ' ');
                });
            });
        },

        getTextListLowerCase() {
            return this.map((elm) => {
                return elm.getText().then((val) => {
                    return val.trim().toLowerCase();
                });
            });
        },

        getTextListSubstring(char) {
            return this.map((elm) => {
                return elm.getText().then((val) => {
                    return val.split(char)[0].trim();
                });
            });
        },

        getIntList() {
            return this.map((elm) => {
                return elm.getText().then((val) => {
                    return parseInt(val.trim());
                });
            });
        },

        getAttributeList(attribute) {
            return this.map((elm) => {
                return elm.getAttribute(attribute).then((val) => {
                    return val.trim();
                });
            });
        },

        getAllByText(text) {
            return this.all(By.xpath(`./..//*[normalize-space(text())="${text}" or normalize-space(.)="${text}"]`));
        },

        getFirstByText(text) {
            return this.getAllByText(text).getFirstVisible();
        },

        clickFirstByText(text) {
            return this.getAllByText(text).clickAtFirstVisible();
        },

        getAllByTextContains(text) {
            return this.all(By.xpath(`./..//*[contains(normalize-space(text()),"${text}") or contains(normalize-space(.),"${text}")]`));
        },

        getFirstByTextContains(text) {
            return this.getAllByTextContains(text).getFirstVisible();
        },

        clickFirstByTextContains(text) {
            return this.getAllByTextContains(text).clickAtFirstVisible();
        },

        clickAtLink(text) {
            return this.all(By.linkText(text)).first().click();
        },

        getReadyFirst() {
            this.waitReady();
            return this.first();
        },

        clickReadyFirst() {
            this.getReadyFirst().click();
        },

        getReadyLast() {
            this.waitReady();
            return this.last();
        },

        clickReadyLast() {
            this.getReadyLast().click();
        },

        getReadyByIndex(index) {
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
                get() {
                    return this;
                },
                getNames() {
                    return labels.getTextList();
                },
                isSelectedByName(name) {
                    return labels.getFirstByTextContains(name).$('input').isSelected();
                },
                getByName(name) {
                    return labels.getFirstByText(name);
                },
                getByNameContains(name) {
                    return labels.getFirstByTextContains(name);
                },
                selectByName(name) {
                    labels.clickFirstByText(name);
                },
                selectByNameContains(name) {
                    labels.clickFirstByTextContains(name);
                },
                selectByIndex(index) {
                    labels.get(index).click();
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