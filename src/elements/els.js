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