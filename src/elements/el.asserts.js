(() => {
    let ElementFinder = $(``).constructor;
    const base = new Base();
    Object.assign(ElementFinder.prototype, {

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

        checkTextNotEqual(text, msg) {
            this.getText().should.eventually.not.eq(text, msg || `check that text not equal: ${this.locator()}`);
        },

        checkTextContains(text, msg) {
            this.getText().should.eventually.contains(text, msg || `check that text contains: ${this.locator()}`);
        },

        checkTextContainsOneOf(list, msg) {
            this.getText().should.eventually.contains.oneOf(list, msg || `check that text contains one of: ${this.locator()}`);
        },

        checkTextNotContains(text, msg) {
            this.getText().should.eventually.not.contains(text, msg || `check that text not contains: ${this.locator()}`);
        },

        checkValue(value, msg) {
            this.getValue().should.eventually.eq(value, msg || `check that value: ${this.locator()}`);
        },

        checkValueContains(value, msg) {
            this.getValue().should.eventually.contains(value, msg || `check that value contains: ${this.locator()}`);
        },

        checkHasClass(klass, msg) {
            this.hasClass(klass).should.eventually.eq(true, msg || `check that element has the class: ${this.locator()}`);
        },

        checkNotHasClass(klass, msg) {
            this.hasClass(klass).should.eventually.eq(false, msg || `check that element does not have the class: ${this.locator()}`);
        },

        checkAttribute(attribute, text, msg) {
            this.getAttribute(attribute).should.eventually.eq(text, msg || `check attribute: ` + this.locator());
        },

        checkAttributeNotEqual(attribute, text, msg) {
            this.getAttribute(attribute).should.eventually.not.eq(text, msg || `check attribute not equal: ` + this.locator());
        },

        checkAttributeContains(attribute, text, msg) {
            this.getAttribute(attribute).should.eventually.contains(text, msg || `check attribute contains: ` + this.locator());
        },

        checkAttributeNotContains(attribute, text, msg) {
            this.getAttribute(attribute).should.eventually.not.contains(text, msg || `check attribute not contains: ` + this.locator());
        }
    });
})();