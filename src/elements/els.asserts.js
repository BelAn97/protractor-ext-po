(() => {
    let ElementArrayFinder = $$(``).constructor;
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

        checkTextListAllBeOneOf(membersList, msg) {
            this.getTextList().should.eventually.all.be.oneOf(membersList, msg || `check list include members: ` + this.locator());
        },

        checkTextListNotIncludeMember(member, msg) {
            this.getTextList().should.eventually.not.include(member, msg || `check list not include member: ` + this.locator());
        },

        checkTextListNotIncludeMembers(membersList, msg) {
            this.getTextList().should.eventually.not.include.members(membersList, msg || `check list not include members: ` + this.locator());
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

        checkListNotMatch(regexp, msg, lowerCase) {
            if (lowerCase) {
                this.getTextListLowerCase().should.eventually.not.match(regexp, msg || `check list not match: ` + this.locator());
            } else {
                this.getTextList().should.eventually.not.match(regexp, msg || `check list not match: ` + this.locator());
            }
        },

        checkSortAscending(compareFn, limit) {
            this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = compareFn ? sorted.sort(compareFn) : sorted.sort();
                sorted.should.deep.equal(unSorted, `check Ascending`);
            });
        },

        checkSortDescending(compareFn, limit) {
            this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = compareFn ? sorted.sort(compareFn) : sorted.sort();
                sorted.reverse().should.deep.equal(unSorted, `check Descending`);
            });
        },

        checkTextMatch(regexp) {
            this.map((elm) => {
                elm.getText().then((val) => {
                    // console.log(val.trim());
                    val.should.match(regexp);
                });
            });
        }

    });
})();