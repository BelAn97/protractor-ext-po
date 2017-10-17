(function () {
    let ElementArrayFinder = $$('').constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        checkPresent(msg) {
            this.isPresent().should.eventually.eq(true, msg || 'check element is present: ' + this.locator());
        },

        checkNotPresent(msg) {
            this.isPresent().should.eventually.eq(false, msg || 'check element is not present: ' + this.locator());
        },

        checkTextListEqual(expectedList, msg) {
            this.getTextList().should.eventually.eql(expectedList, msg || 'check list equal: ' + this.locator());
        },

        checkTextListIncludeMembers(membersList, msg) {
            this.getTextList().should.eventually.eql(membersList, msg || 'check list include members: ' + this.locator());
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