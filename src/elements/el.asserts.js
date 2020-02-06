(() => {
    let ElementFinder = $(``).constructor;
    const base = new Base();
    Object.assign(ElementFinder.prototype, {

        async checkPresent(msg) {
            (await this.isPresent()).should.eq(true, msg || `check that element is present: ${this.locator()}`);
        },

        async checkNotPresent(msg) {
            (await this.isPresent()).should.eq(false, msg || `check that element is not present: ${this.locator()}`);
        },

        async checkDisplayed(msg) {
            (await this.isDisplayed()).should.eq(true, msg || `check that element is displayed: ${this.locator()}`);
        },

        async checkNotDisplayed(msg) {
            (await this.isDisplayed()).should.eq(false, msg || `check that element is not displayed: ${this.locator()}`);
        },

        async checkMatch(regexp, msg) {
            (await this.getText()).should.match(regexp, msg || `check that match: ${this.locator()}`);
        },

        async checkText(text, msg) {
            (await this.getText()).should.eq(text, msg || `check that text: ${this.locator()}`);
        },

        async checkTextNotEqual(text, msg) {
            (await this.getText()).should.not.eq(text, msg || `check that text not equal: ${this.locator()}`);
        },

        async checkTextContains(text, msg) {
            (await this.getText()).should.contains(text, msg || `check that text contains: ${this.locator()}`);
        },

        async checkTextContainsOneOf(list, msg) {
            (this.getText()).should.contains.oneOf(list, msg || `check that text contains one of: ${this.locator()}`);
        },

        async checkTextNotContains(text, msg) {
            (await this.getText()).should.not.contains(text, msg || `check that text not contains: ${this.locator()}`);
        },

        async checkValue(value, msg) {
            (await this.getValue()).should.eq(value, msg || `check that value: ${this.locator()}`);
        },

        async checkValueContains(value, msg) {
            (await this.getValue()).should.contains(value, msg || `check that value contains: ${this.locator()}`);
        },

        async checkHasClass(klass, msg) {
            (await this.hasClass(klass)).should.eq(true, msg || `check that element has the class: ${this.locator()}`);
        },

        async checkNotHasClass(klass, msg) {
            (await this.hasClass(klass)).should.eq(false, msg || `check that element does not have the class: ${this.locator()}`);
        },

        async checkAttribute(attribute, text, msg) {
            (await this.getAttribute(attribute)).should.eq(text, msg || `check attribute: ` + this.locator());
        },

        async checkAttributeNotEqual(attribute, text, msg) {
            (await this.getAttribute(attribute)).should.not.eq(text, msg || `check attribute not equal: ` + this.locator());
        },

        async checkAttributeContains(attribute, text, msg) {
            (await this.getAttribute(attribute)).should.contains(text, msg || `check attribute contains: ` + this.locator());
        },

        async checkAttributeNotContains(attribute, text, msg) {
            (await this.getAttribute(attribute)).should.not.contains(text, msg || `check attribute not contains: ` + this.locator());
        }
    });
})();
