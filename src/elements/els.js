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