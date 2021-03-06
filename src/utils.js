/**
 * Utils.
 */
(() => {
    Object.assign(Array.prototype, {

        contains(it) {
            return this.indexOf(it) > -1;
        },

        containsOneOf(arr) {
            var found = false;
            this.forEach((it) => {
                if (arr.indexOf(it) > -1) {
                    found = true;
                }
            });
            return found;
        },

        toLowerCase() {
            return this.map((el) => {
                return el.toLowerCase();
            });
        },

        toUpperCase() {
            return this.map((el) => {
                return el.toUpperCase();
            });
        },

        removeEmpty() {
            return this.filter((el) => {
                return !el.isEmpty();
            });
        }
    });

    Object.assign(String.prototype, {

        contains(it) {
            return this.indexOf(it) !== -1;
        },

        containsOneOf(arr) {
            var found = false;
            var text = this;
            arr.forEach((it) => {
                if (text.contains(it)) {
                    found = true;
                }
            });
            return found;
        },

        format() {
            var args = arguments;
            var i = -1;
            return this.replace(/\{(?:[^{}]|\{*\})*\}/g, (val) => {
                i++;
                return args[i] !== undefined ? args[i] : val;
            });
        },

        getDigits() {
            return this.match(/\d+/)[0]
        }
    })
})();