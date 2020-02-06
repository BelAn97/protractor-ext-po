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
                async check() {
                    if (!await this.isChecked()) {
                        await root.clickByScript();
                    }
                },
                async uncheck() {
                    if (await this.isChecked()) {
                        await root.clickByScript();
                    }
                },
                async isChecked() {
                    return (await root.isSelected());
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
                async select(itemName) {
                    await root.element(by.cssContainingText('option', itemName)).click();
                },
                async getSelected() {
                    return await selected.getText();
                },
                getOptions() {
                    return options;
                },
                async getOptionsList() {
                    return await options.getTextList();
                }
            };
        }
    });
})();
