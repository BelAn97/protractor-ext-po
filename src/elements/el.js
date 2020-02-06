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
            browser.wait(base.EC.elementToBeClickable(this), timeout || base.timeout.xxl, `wait clickable: ${this.locator()}`);
            return this;
        },

        async waitForText(text, timeout) {
            browser.wait(base.EC.textToBePresentInElement(this, text), timeout || base.timeout.xxl, `wait for text: ${this.locator()}`);
            return this;
        },

        async waitForValue(value, timeout) {
            await browser.wait(base.EC.textToBePresentInElementValue(this, value), timeout || base.timeout.xxl, `wait for value: ${this.locator()}`);
            return this;
        },

        async getParent() {
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

        async findByText(searchText) {
            return await this.element(by.xpath(`.//*[text()="${searchText}"]`));
        },

        async focus() {
            browser.actions().mouseMove(this.waitReady()).perform();
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
