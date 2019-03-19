/**
 * Custom comparators.
 */
class Compare {
    static compareLowerCase(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    };

    static compareFloat(a, b) {
        return parseFloat(a) - parseFloat(b);
    };

    static comparePercentage(a, b) {
        return parseFloat(a.replace('%', '')) - parseFloat(b.replace('%', ''));
    };
}

module.exports = new Compare();