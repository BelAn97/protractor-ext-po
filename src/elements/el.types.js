(() => {
    let ElementFinder = $('').constructor;
    const base = new Base();

    Object.assign(ElementFinder.prototype, {

        asCheckBox() {
            return {
                get() {
                    return this;
                },
                check() {
                    if (!this.isChecked()) {
                        this.clickScript();
                    }
                },
                uncheck() {
                    if (this.isChecked()) {
                        this.clickScript();
                    }
                },
                isChecked() {
                    return this.isSelected();
                }
            };
        }
    });
})();