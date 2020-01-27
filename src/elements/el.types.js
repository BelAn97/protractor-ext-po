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
        }
    });
})();
