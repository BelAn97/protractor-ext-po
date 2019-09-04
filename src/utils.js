/**
 * Utils.
 */
(function () {
    Object.assign(Array.prototype, {

            contains(it) {
                return this.indexOf(it) > -1;
            },

            async containsOneOf(arr) {
                var found = false;
                await this.forEach((it) => {
                    if (arr.indexOf(it) > -1) {
                        found = true;
                    }
                });
                return found;
            },

            async toLowerCase() {
                return await this.map((el) => {
                    return el.toLowerCase();
                });
            },

            async toUpperCase() {
                return await this.map((el) => {
                    return el.toUpperCase();
                });
            },

            async removeEmpty() {
                return await this.filter((el) => {
                    return !el.isEmpty();
                });
            }
        },

        Object.assign(String.prototype, {

            contains(it) {
                return this.indexOf(it) !== -1;
            },

            async containsOneOf(arr) {
                var found = false;
                var text = this;
                await arr.forEach((it) => {
                    if (text.contains(it)) {
                        found = true;
                    }
                });
                return found;
            },

            async format() {
                var args = arguments;
                var i = -1;
                return await this.replace(/\{(?:[^{}]|\{*\})*\}/g, (val) => {
                    i++;
                    return args[i] !== undefined ? args[i] : val;
                });
            },

            getDigits() {
                return this.match(/\d+/)[0]
            }
        }))
})();