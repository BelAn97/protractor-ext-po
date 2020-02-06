(() => {
    let ElementFinder = $('').constructor;
    const base = new Base();

    Object.assign(ElementFinder.prototype, {

        asCheckBox() {
            let root = this;
            return {
                get() {
                    return root;
                },
                check() {
                    if (!this.isChecked()) {
                        root.clickByScript();
                    }
                },
                uncheck() {
                    if (this.isChecked()) {
                        root.clickByScript();
                    }
                },
                isChecked() {
                    return root.isSelected();
                }
            };
        },
        asSelector() {
            let root = this;
            let options = root.$$('option');
            let selected = root.$$('option[selected="selected"]');
            return {
                get() {
                    return root;
                },
                select(itemName) {
                    root.element(by.cssContainingText('option', itemName)).click();
                },
                getSelected() {
                    return selected.getText();
                },
                getOptions() {
                    return options;
                },
                getOptionsList() {
                    return options.getTextList();
                }
            };
        }
    });
})();
