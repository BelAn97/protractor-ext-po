(function () {
    let ElementFinder = $('').constructor;
    const buffer = require('buffer');
    const base = new Base();
    Object.assign(ElementFinder.prototype, {

        waitInDom(timeout) {
            browser.wait(base.EC.presenceOf(this), timeout || base.timeout.xxl, 'wait in dom: ${this.locator()}');
            return this;
        },

        waitNotInDom(timeout) {
            browser.wait(base.EC.stalenessOf(this), timeout || base.timeout.xxl, 'wait not in dom: ${this.locator()}');
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
            browser.wait(base.EC.visibilityOf(this), timeout || base.timeout.xxl, 'wait for visible: ${this.locator()}');
            return this;
        },

        waitInvisible(timeout) {
            browser.wait(base.EC.invisibilityOf(this), timeout || base.timeout.xxl, 'wait for invisible: ${this.locator()}');
            return this;
        },

        waitClickable(timeout) {
            browser.wait(base.EC.elementToBeClickable(this), timeout || base.timeout.xxl, 'wait clickable: ${this.locator()}');
            return this;
        },

        waitForText(text, timeout) {
            browser.wait(base.EC.textToBePresentInElement(this, text), timeout || base.timeout.xxl, 'wait for text: ${this.locator()}');
            return this;
        },

        waitForValue(value, timeout) {
            browser.wait(base.EC.textToBePresentInElementValue(this, value), timeout || base.timeout.xxl, 'wait for value: ${this.locator()}');
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
                base.log('class attribute: ${classes}');
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
            return this.element(By.xpath('.//*[text()="${searchText}"]'));
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