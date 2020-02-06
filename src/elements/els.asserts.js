(() => {
    let ElementArrayFinder = $$(``).constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        async checkPresent(msg) {
            (await this.isPresent()).should.eq(true, msg || `check that element is present: ${this.locator()}`);
        },

        async checkNotPresent(msg) {
            (await this.isPresent()).should.eq(false, msg || `check that element is not present: ${this.locator()}`);
        },

        async checkDisplayed(msg) {
            (await this.isDisplayedOneOf()).should.eq(true, msg || `check that one of elements is displayed: ${this.locator()}`);
        },

        async checkNotDisplayed(msg) {
            (await this.isDisplayedOneOf()).should.eq(false, msg || `check that all elements are not displayed: ${this.locator()}`);
        },

        async checkTextListEqual(expectedList, msg) {
            (await this.getTextList()).should.eql(expectedList, msg || `check that text list equal: ${this.locator()}`);
        },

        async checkTextListNotEqual(expectedList, msg) {
            (await this.getTextList()).should.not.eql(expectedList, msg || `check that text list not equal: ${this.locator()}`);
        },

        async checkTextListIncludeMember(member, msg) {
            (await this.getTextList()).should.include(member, msg || `check that text list include the member: ${this.locator()}`);
        },

        async checkTextListIncludeMembers(membersList, msg) {
            (await this.getTextList()).should.include.members(membersList, msg || `check that text list include members: ${this.locator()}`);
        },

        async checkTextListAllBeOneOf(membersList, msg) {
            (await this.getTextList()).should.all.be.oneOf(membersList, msg || `check list include members: ` + this.locator());
        },

        async checkTextListNotIncludeMember(member, msg) {
            (await this.getTextList()).should.not.include(member, msg || `check list not include member: ` + this.locator());
        },

        async checkTextListNotIncludeMembers(membersList, msg) {
            (await this.getTextList()).should.not.include.members(membersList, msg || `check list not include members: ` + this.locator());
        },

        async checkTextListHaveMembers(membersList, msg) {
            (await this.getTextList()).should.have.members(membersList, msg || `check that text list have members: ${this.locator()}`);
        },

        async checkListCount(expectedCount, msg) {
            (await this.count()).should.eql(expectedCount, msg || `check that list count: ${this.locator()}`);
        },

        async checkTextListMatch(regexp, msg, lowerCase) {
            if (lowerCase) {
                (await this.getTextListLowerCase()).should.match(regexp, msg || `check that text list match: ${this.locator()}`);
            } else {
                (await this.getTextList()).should.match(regexp, msg || `check that text list match: ${this.locator()}`);
            }
        },

        async checkListNotMatch(regexp, msg, lowerCase) {
            if (lowerCase) {
                (await this.getTextListLowerCase()).should.not.match(regexp, msg || `check list not match: ` + this.locator());
            } else {
                (await this.getTextList()).should.not.match(regexp, msg || `check list not match: ` + this.locator());
            }
        },

        async checkSortAscending(compareFn, limit) {
            await this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = compareFn ? sorted.sort(compareFn) : sorted.sort();
                sorted.should.deep.equal(unSorted, `check Ascending`);
            });
        },

        async checkSortDescending(compareFn, limit) {
            await this.getTextListLimit(limit).then((unSorted) => {
                unSorted = unSorted.filter(Boolean);
                let sorted = unSorted.slice();
                sorted = compareFn ? sorted.sort(compareFn) : sorted.sort();
                sorted.reverse().should.deep.equal(unSorted, `check Descending`);
            });
        },

        async checkTextMatch(regexp) {
            await this.map(async (elm) => {
                await elm.getText().then((val) => {
                    // console.log(val.trim());
                    val.should.match(regexp);
                });
            });
        }

    });
})();
