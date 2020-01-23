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
                return await el.isDisplayed();
            }).count().then((count) => {
                return count > 0;
            });
        },

        async isPresentOneOf() {
            return await this.filter(async (el) => {
                return await el.isPresent();
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

        async getParents() {
            return await this.all(By.xpath('./..'));
        },

        async getFirstVisible() {
            await this.waitReady();
            return await this.filter(async (el) => {
                return await el.isDisplayed();
            }).first();
        },

        async getLastVisible() {
            await this.waitReady();
            return await this.filter(async (el) => {
                return await el.isDisplayed();
            }).last();
        },

        async clickAtFirstVisible() {
            await this.getFirstVisible().click();
        },

        async clickAtLastVisible() {
            await this.getLastVisible().click();
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

        async getAllByText(text) {
            return await this.all(By.xpath(`./..//*[normalize-space(text())="${text}" or normalize-space(.)="${text}"]`));
        },

        async getFirstByText(text) {
            return await this.getAllByText(text).getFirstVisible();
        },

        async clickFirstByText(text) {
            return await this.getAllByText(text).clickAtFirstVisible();
        },

        async getAllByTextContains(text) {
            return await this.all(By.xpath(`./..//*[contains(normalize-space(text()),"${text}") or contains(normalize-space(.),"${text}")]`));
        },

        async getFirstByTextContains(text) {
            return await this.getAllByTextContains(text).getFirstVisible();
        },

        async clickFirstByTextContains(text) {
            return await this.getAllByTextContains(text).clickAtFirstVisible();
        },

        async clickAtLink(text) {
            return await this.all(By.linkText(text)).first().click();
        },

        async getReadyFirst() {
            await this.waitReady();
            return await this.first();
        },

        async clickReadyFirst() {
            await this.getReadyFirst().click();
        },

        async getReadyLast() {
            await this.waitReady();
            return await this.last();
        },

        async clickReadyLast() {
            await this.getReadyLast().click();
        },

        async getReadyByIndex(index) {
            await this.waitReady();
            return await this.get(index).waitReady();
        }

    });
})();
