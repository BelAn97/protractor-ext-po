(function () {
    let ElementArrayFinder = $$('').constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        checkTextListEqual(expectedList, msg) {
            this.getTextList().should.eventually.eql(expectedList, msg || 'check list equal: ' + this.locator());
        },

        checkTextListNotEqual(expectedList, msg) {
            this.getTextList().should.not.eventually.eql(expectedList, msg || 'check list not equal: ' + this.locator());
        },

        checkListCount(expectedCount, msg) {
            this.count().should.eventually.eql(expectedCount, msg || 'check list count: ' + this.locator());
        },

        checkListMatch(regexp, lowerCase, msg) {
            if (lowerCase) {
                this.getTextListLowerCase().should.eventually.match(regexp, msg || 'check list match: ' + this.locator());
            } else {
                this.getTextList().should.eventually.match(regexp, msg || 'check list match: ' + this.locator());
            }
        }

    });
})();