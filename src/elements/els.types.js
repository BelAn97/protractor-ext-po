(() => {
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
                    return labels.getTextList();
                },
                async isSelectedByName(name) {
                    return labels.getFirstByTextContains(name).$('input').isSelected();
                },
                async getByName(name) {
                    return labels.getFirstByText(name);
                },
                async getByNameContains(name) {
                    return labels.getFirstByTextContains(name);
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