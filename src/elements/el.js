(function () {
    let ElementFinder = $('').constructor;
    const buffer = require('copy-paste');
    const _ = require('underscore');
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

        sendKeysSlow(text, interval) {
            let input = this.waitReady();
            text.split('').forEach((char) => {
                input.sendKeys(char);
                base.sleep(interval || base.timeout.zero);
            });
            return this;
        },

        clickReady() {
            return this.waitClickable().click();
        },

        clickByScript() {
            this.waitInDom();
            browser.executeScript('arguments[0].click();', this);
            return this;
        },

        clickByCenter() {
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
            this.isPresent().then((val) => {
                if (val) {
                    this.isDisplayed().then((val) => {
                        if (val) {
                            this.click();
                        }
                    });
                }
            });
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

        scrollAndGetTextList(list, scrolledElements, scrollCount) {
            browser.executeScript('arguments[0].scrollIntoView(false);', scrolledPanel);
            return this.getTextList().then((newList) => {
                if (scrollCount > 0) {
                    return this.scrollAndGetTextList(_.union(list, newList), scrolledElements, scrollCount - 1);
                } else {
                    return _.union(list, newList);
                }
            });
        },

        getTextListAtScrolled(scrolledElements, scrollCount) {
            return scrolledElements.getTextList().then((list) => {
                return this.scrollAndGetTextList(list, scrolledElements, scrollCount)
            });

        }

    });
})();