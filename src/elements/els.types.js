(function () {
    let ElementArrayFinder = $$('').constructor;
    const base = new Base();
    Object.assign(ElementArrayFinder.prototype, {

        asRadio() {
            let root = this;
            let labels = this.getParents();
            return {
                get() {
                    return root;
                },
                getNames() {
                    return labels.getTextList();
                },
                isSelectedByName(name) {
                    return labels.getFirstByTextContains(name).$('input').isSelected();
                },
                getByName(name) {
                    return labels.getFirstByText(name);
                },
                getByNameContains(name) {
                    return labels.getFirstByTextContains(name);
                },
                selectByName(name) {
                    labels.clickFirstByText(name);
                },
                selectByNameContains(name) {
                    labels.clickFirstByTextContains(name);
                },
                selectByIndex(index) {
                    labels.get(index).click();
                }
            }
        }
    });
})();