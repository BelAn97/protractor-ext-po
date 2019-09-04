(function () {
    let ElementArrayFinder = $$('').constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        asRadio() {
            let labels = this.getParents();
            return {
                async get() {
                    return this;
                },
                async getNames() {
                    return await labels.getTextList();
                },
                async isSelectedByName(name) {
                    return await labels.getFirstByTextContains(name).$('input').isSelected();
                },
                async getByName(name) {
                    return await labels.getFirstByText(name);
                },
                async getByNameContains(name) {
                    return await labels.getFirstByTextContains(name);
                },
                async selectByName(name) {
                    await labels.clickFirstByText(name);
                },
                async selectByNameContains(name) {
                    await labels.clickFirstByTextContains(name);
                },
                async selectByIndex(index) {
                    await labels.get(index).click();
                }
            }
        }
    });
})();