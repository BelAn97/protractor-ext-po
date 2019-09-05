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