(() => {
    let ElementFinder = $('').constructor;
    const base = new Base();

    Object.assign(ElementFinder.prototype, {

        asCheckBox() {
            return {
                async get() {
                    return this;
                },
                async check() {
                    if (!this.isChecked()) {
                        this.clickScript();
                    }
                },
                async uncheck() {
                    if (this.isChecked()) {
                        this.clickScript();
                    }
                },
                async isChecked() {
                    return this.isSelected();
                }
            };
        }
    });
})();