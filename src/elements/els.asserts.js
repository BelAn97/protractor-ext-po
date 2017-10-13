(function () {
    let ElementArrayFinder = $$('').constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        checkTextListEqual(expectedList) {
            this.getTextList().should.eventually.eql(expectedList, 'check list equal: ' + this.locator());
        },

        checkTextListNotEqual(expectedList) {
            this.getTextList().should.not.eventually.eql(expectedList, 'check list not equal: ' + this.locator());
        },

        checkListCount(expectedCount) {
            this.count().should.eventually.eql(expectedCount, 'check list count: ' + this.locator());
        },

        checkListMatch(regexp, lowerCase) {
            if (lowerCase) {
                this.getTextListLowerCase().should.eventually.match(regexp, 'check list match: ' + this.locator());
            } else {
                this.getTextList().should.eventually.match(regexp, 'check list match: ' + this.locator());
            }
        }

    });
})();