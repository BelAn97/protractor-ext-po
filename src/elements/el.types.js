(function () {
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
                    root.isSelected().then((result) => {
                        if (!result) {
                            root.clickScript();
                        }
                    });
                },
                uncheck() {
                    root.isSelected().then((result) => {
                        if (result) {
                            root.clickScript();
                        }
                    });
                },
                isChecked() {
                    return root.isSelected().then((result) => {
                        return result
                    });
                }
            };
        }
    });
})();