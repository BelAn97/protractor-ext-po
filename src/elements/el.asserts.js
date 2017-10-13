(function () {
    let ElementFinder = $('').constructor;
    const base = new Base();
    Object.assign(ElementFinder.prototype, {

        checkButtonEnabled() {
            this.hasClass('emb-btn-disabled').should.eventually.eq(false, 'check button is enabled: ' + this.locator());
        },

        checkButtonDisabled() {
            this.hasClass('emb-btn-disabled').should.eventually.eq(true, 'check button is disabled: ' + this.locator());
        },

        checkPresent(msg) {
            this.isPresent().should.eventually.eq(true, msg || 'check element is present: ' + this.locator());
        },

        checkNotPresent(msg) {
            this.isPresent().should.eventually.eq(false, msg || 'check element is not present: ' + this.locator());
        },

        checkMatch(regexp, msg) {
            this.getText().should.eventually.match(regexp, msg || 'check match: ' + this.locator());
        },

        checkValue(value, msg) {
            this.getValue().should.eventually.eq(value, msg || 'check value: ' + this.locator());
        },

    });
})();