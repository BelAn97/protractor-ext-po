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
        }

    });
})();