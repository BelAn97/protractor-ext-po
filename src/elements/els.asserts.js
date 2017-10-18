(function () {
    let ElementArrayFinder = $$('').constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        checkPresent(msg) {
            this.isPresent().should.eventually.eq(true, msg || `check that element is present: ${this.locator()}`);
        },

        checkNotPresent(msg) {
            this.isPresent().should.eventually.eq(false, msg || `check that element is not present: ${this.locator()}`);
        },

        checkDisplayed(msg) {
            this.isDisplayedOneOf().should.eventually.eq(true, msg || `check that one of elements is displayed: ${this.locator()}`);
        },

        checkNotDisplayed(msg) {
            this.isDisplayedOneOf().should.eventually.eq(false, msg || `check that all elements are not displayed: ${this.locator()}`);
        },

        checkListEqual(expectedList, msg) {
            this.should.eventually.eql(expectedList, msg || `check that list equal: ${this.locator()}`);
        },

        checkListNotEqual(expectedList, msg) {
            this.should.not.eventually.eql(expectedList, msg || `check that list not equal: ${this.locator()}`);
        },

        checkListIncludeMember(member, msg) {
            this.should.eventually.include(member, msg || `check that list include the member: ${this.locator()}`);
        },

        checkListIncludeMembers(membersList, msg) {
            this.should.eventually.include.members(membersList, msg || `check that list include members: ${this.locator()}`);
        },

        checkListHaveMembers(membersList, msg) {
            this.should.eventually.have.members(membersList, msg || `check that list have members: ${this.locator()}`);
        },

        checkTextListEqual(expectedList, msg) {
            this.getTextList().should.eventually.eql(expectedList, msg || `check that text list equal: ${this.locator()}`);
        },

        checkTextListNotEqual(expectedList, msg) {
            this.getTextList().should.not.eventually.eql(expectedList, msg || `check that text list not equal: ${this.locator()}`);
        },

        checkTextListIncludeMember(member, msg) {
            this.getTextList().should.eventually.include(member, msg || `check that text list include the member: ${this.locator()}`);
        },

        checkTextListIncludeMembers(membersList, msg) {
            this.getTextList().should.eventually.include.members(membersList, msg || `check that text list include members: ${this.locator()}`);
        },

        checkTextListHaveMembers(membersList, msg) {
            this.getTextList().should.eventually.have.members(membersList, msg || `check that text list have members: ${this.locator()}`);
        },

        checkListCount(expectedCount, msg) {
            this.count().should.eventually.eql(expectedCount, msg || `check that list count: ${this.locator()}`);
        },

        checkListMatch(regexp, msg) {
            this.should.eventually.match(regexp, msg || `check that list match: ${this.locator()}`);
        },

        checkTextListMatch(regexp, lowerCase, msg) {
            if (lowerCase) {
                this.getTextListLowerCase().should.eventually.match(regexp, msg || `check that text list match: ${this.locator()}`);
            } else {
                this.getTextList().should.eventually.match(regexp, msg || `check that text list match: ${this.locator()}`);
            }
        }

    });
})();