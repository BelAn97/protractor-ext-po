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

        checkPresent() {
            this.isPresent().should.eventually.eq(true, 'check element is present: ' + this.locator());
        },

        checkNotPresent() {
            this.isPresent().should.eventually.eq(false, 'check element is not present: ' + this.locator());
        },

        checkMatch(regexp) {
            this.getText().should.eventually.match(regexp, 'check match: ' + this.locator());
        },

        checkValue(regexp) {
            this.getValue().should.eventually.eq(regexp, 'check value: ' + this.locator());
        },

    });
})();