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

    setWaitForAngular() {
        return flow.execute(() => {
            browser.waitForAngularEnabled(true);
        });
    };

    setNoWaitForAngular() {
        return flow.execute(() => {
            browser.waitForAngularEnabled(false);
        });
    };

    /**
     * enable or disable wait for angular for the page
     *
     * @requires page to include `angular` boolean variable
     */
    checkWaitForAngular() {
        if (this.angular) {
            this.setWaitForAngular();
        } else {
            this.setNoWaitForAngular();
        }
    };

    sleep(ms) {
        return flow.execute(() => {
            // console.log(`*sleep: ${ms} ms`);
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
        return flow.execute(() => {
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
        return flow.execute(() => {
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
        return flow.execute(() => {
            this.checkWaitForAngular();
            this.waitForUrl(url || this.url, timeout);
        });
    };

    atUrlContains(url, timeout) {
        return flow.execute(() => {
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
        return flow.execute(() => {
            this.checkWaitForAngular();
            this.waitForTitle(title || this.title, timeout);
        });
    };

    atTitleContains(title, timeout) {
        return flow.execute(() => {
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
        return flow.execute(() => {
            this.checkWaitForAngular();
            this.log(`*goTo: ${config.webserver + this.url}`);
            browser.navigate().to(config.webserver + this.url);
            this.at();
        });
    };

    goToUrl(url) {
        return flow.execute(() => {
            url = url || config.webserver + this.url;
            this.log(`*goTo url: ${url}`);
            browser.navigate().to(url);
            this.pause();
        });
    };

    saveCurrentUrl() {
        browser.getCurrentUrl().then((currentUrl) => {
            this.log(`*save url: ${currentUrl}`);
            this.savedUrl = currentUrl;
        });
    };

    goToSavedUrl() {
        return flow.execute(() => {
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
        this.setNoWaitForAngular();
        return browser.getAllWindowHandles().then((handles) => {
            return browser.switchTo().window(handles[windowHandleIndex]);
        });
    };

    switchToDefault() {
        this.setNoWaitForAngular();
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
        let frame = this;
        if (!nameOrIndex) {
            frame.iframe.waitInDom();
            nameOrIndex = frame.iframe.getWebElement();
        }
        this.setNoWaitForAngular();
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
(function () {
    let ElementFinder = $('').constructor;
    const base = new Base();
    Object.assign(ElementFinder.prototype, {
        
        checkButtonEnabled() {
            this.hasClass('emb-btn-disabled').should.eventually.eq(false, `check that that button is enabled: ${this.locator()}`);
        },

        checkButtonDisabled() {
            this.hasClass('emb-btn-disabled').should.eventually.eq(true, `check that button is disabled: ${this.locator()}`);
        },

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

        checkTextContains(text, msg) {
            this.getText().should.eventually.contains(text, msg || `check that text contains: ${this.locator()}`);
        },

        checkValue(value, msg) {
            this.getValue().should.eventually.eq(value, msg || `check that value: ${this.locator()}`);
        },

        checkHasClass(klass, msg) {
            this.hasClass(klass).should.eventually.eq(true, msg || `check that element has the class: ${this.locator()}`);
        },

        checkNotHasClass(klass, msg) {
            this.hasClass(klass).should.eventually.eq(false, msg || `check that element does not have the class: ${this.locator()}`);
        },

    });
})();
(function () {
    let ElementFinder = $('').constructor;
    const buffer = require('buffer');
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

        waitReadyAngular() {
            if (browser.ignoreSynchronization) {
                base.setSynch();
                browser.waitForAngular();
                base.sleep(base.timeout.min);
                this.waitReady();
                base.setNoSynch();
            } else {
                this.waitReady();
            }
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
            return this.element(By.xpath('./..'));
        },

        getValue() {
            return this.getAttribute('value');
        },

        hasClass(klass) {
            return this.getAttribute('class').then((classes) => {
                base.log(`class attribute: ${classes}`);
                return classes.split(' ').indexOf(klass) !== -1;
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

        clickReady() {
            return this.waitClickable().click();
        },

        clickScript() {
            this.waitInDom();
            browser.executeScript('arguments[0].click();', this);
            return this;
        },

        clickCenter() {
            this.waitReady();
            browser.actions().click(this).perform();
            return this;
        },

        clickAtCorner() {
            this.waitReady();
            browser.actions().mouseMove(this, {x: 1, y: 1}).click().perform();
            return this;
        },

        clickIfExists() {
            let self = this;
            this.isPresent().then((val) => {
                if (val) {
                    self.isDisplayed().then((val) => {
                        if (val) {
                            self.click();
                        }
                    });
                }
            });
        },

        pasteFromClipboard(value) {
            this.clickReady();
            buffer.copy(value);
            browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'v')).perform();
            return this;
        },

        pressEnter() {
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
            return this;
        },

        pressHome() {
            browser.actions().sendKeys(protractor.Key.HOME).perform();
            return this;
        },

        getTextReady() {
            return this.waitReady().getText();
        },

    });
})();
(function () {
    let ElementFinder = $('').constructor;
    const base = new Base();

    Object.assign(ElementFinder.prototype, {

        asCheckBox() {
            let root = this;
            return {
                get() {
                    return root;
                },
                check() {
                    root.isSelected().then((result) => {
                        if (!result) {
                            root.clickScript();
                        }
                    });
                },
                uncheck() {
                    root.isSelected().then((result) => {
                        if (result) {
                            root.clickScript();
                        }
                    });
                },
                isChecked() {
                    return root.isSelected().then((result) => {
                        return result
                    });
                }
            };
        }
    });
})();
(function () {
    let ElementArrayFinder = $$('').constructor;
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

        checkListEqual(expectedList, msg) {
            this.should.eventually.eql(expectedList, msg || `check that list equal: ${this.locator()}`);
        },

        checkListNotEqual(expectedList, msg) {
            this.should.not.eventually.eql(expectedList, msg || `check that list not equal: ${this.locator()}`);
        },

        checkListIncludeMember(member, msg) {
            this.should.eventually.include(member, msg || `check that list include the member: ${this.locator()}`);
        },

        checkListIncludeMembers(membersList, msg) {
            this.should.eventually.include.members(membersList, msg || `check that list include members: ${this.locator()}`);
        },

        checkListHaveMembers(membersList, msg) {
            this.should.eventually.have.members(membersList, msg || `check that list have members: ${this.locator()}`);
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

        checkTextListHaveMembers(membersList, msg) {
            this.getTextList().should.eventually.have.members(membersList, msg || `check that text list have members: ${this.locator()}`);
        },

        checkListCount(expectedCount, msg) {
            this.count().should.eventually.eql(expectedCount, msg || `check that list count: ${this.locator()}`);
        },

        checkListMatch(regexp, msg) {
            this.should.eventually.match(regexp, msg || `check that list match: ${this.locator()}`);
        },

        checkTextListMatch(regexp, lowerCase, msg) {
            if (lowerCase) {
                this.getTextListLowerCase().should.eventually.match(regexp, msg || `check that text list match: ${this.locator()}`);
            } else {
                this.getTextList().should.eventually.match(regexp, msg || `check that text list match: ${this.locator()}`);
            }
        }

    });
})();
(function () {
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

        waitReady(timeout) {
            this.waitInDom();
            browser.wait(this.isDisplayedOneOf(), timeout || base.timeout.xxl, `wait for visible one of: ${this.locator()}`);
            return this;
        },

        waitReadyAngular() {
            if (browser.ignoreSynchronization) {
                base.setSynch();
                browser.waitForAngular();
                base.sleep(base.timeout.min);
                this.waitReady();
                base.setNoSynch();
            } else {
                this.waitReady();
            }
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
            this.waitReady();
            return this.filter((el) => {
                return el.isDisplayed();
            }).first().clickScript();
        },

        getTextList() {
            return this.map((elm) => {
                return elm.getText().then((val) => {
                    return val.trim();
                });
            });
        },

        getTextListLimit(limit) {
            return this.map(function (elm, i) {
                if (!limit || i<limit) {
                    return elm.getText().then(function (val) {
                        return val.trim();
                    });
                }
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
                return elm.getText().then((val) =>{
                    return val.split(char)[0].trim();
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
            return this.$$(By.linkText(text)).first().click();
        },

        getReadyFirst() {
            this.waitReady();
            return this.first();
        },

        clickReadyFirst() {
            this.waitReady();
            return this.first().click();
        },

        getReadyByIndex(index) {
            this.waitReady();
            return this.get(index).waitReady();
        },

        checkSortAscending(lowerCase, limit) {
            this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = lowerCase ? sorted.sort(base.compareLowerCase) : sorted.sort();
                sorted.should.deep.equal(unSorted, 'check Ascending');
            });
        },
        checkSortDescending (lowerCase, limit) {
            this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = lowerCase ? sorted.sort(base.compareLowerCase) : sorted.sort();
                sorted.reverse().should.deep.equal(unSorted, 'check Descending');
            });
        },

    });
})();
(function () {
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
(function () {

    By.addLocator('cssHasText', (cssEl, text, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        // Return an array of elements with the text.
        return Array.prototype.filter.call(els, (el) => {
            return el.textContent.trim() === text;
        });
    });

    By.addLocator('cssHasSubCss', (cssEl, subCss, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        // Return an array of elements with sub css.
        return Array.prototype.filter.call(els, (el) => {
            return el.querySelectorAll(subCss).length > 0
        });
    });

    By.addLocator('cssHasSubCssWithText', (cssEl, subCss, cssText, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        // Return an array of elements with sub css.
        return Array.prototype.filter.call(els, (el) => {
            return Array.prototype.filter.call(el.querySelectorAll(subCss), (el) => {
                return el.textContent.trim() === cssText;
            }).length > 0
        });
    });

    By.addLocator('cssSplitText', (cssEl, cssText, splitChar, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        // Return an array of elements with the text.
        return Array.prototype.filter.call(els, (el) => {
            return el.textContent.split(splitChar)[0].trim() === cssText;
        });
    });

    By.addLocator('cssHasTagText', (cssEl, text, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        // Return an array of elements with the text.
        return Array.prototype.filter.call(els, (el) => {
            return el.innerHTML.indexOf(`>${text}<`) >= 0;
        });
    });
})();