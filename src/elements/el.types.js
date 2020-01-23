(() => {
    let ElementFinder = $('').constructor;
    const base = new Base();

    Object.assign(ElementFinder.prototype, {

        asCheckBox() {
            return {
                get() {
                    return this;
                },
                async check() {
                    if (!await this.isChecked()) {
                        await this.clickScript();
                    }
                },
                async uncheck() {
                    if (await this.isChecked()) {
                        await  this.clickScript();
                    }
                },
                isChecked() {
                    return this.isSelected();
                }
            };
        }
    });
})();
