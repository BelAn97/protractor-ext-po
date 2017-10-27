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

        checkTextListMatch(regexp, msg, lowerCase) {
            if (lowerCase) {
                this.getTextListLowerCase().should.eventually.match(regexp, msg || `check that text list match: ${this.locator()}`);
            } else {
                this.getTextList().should.eventually.match(regexp, msg || `check that text list match: ${this.locator()}`);
            }
        },

        checkSortAscending(lowerCase, limit) {
            this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = lowerCase ? sorted.sort(base.compareLowerCase) : sorted.sort();
                sorted.should.deep.equal(unSorted, 'check Ascending');
            });
        },

        checkSortDescending (lowerCase, limit) {
            this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = lowerCase ? sorted.sort(base.compareLowerCase) : sorted.sort();
                sorted.reverse().should.deep.equal(unSorted, 'check Descending');
            });
        }

    });
})();