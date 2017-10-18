/**
 * Custom locators.
 */
(function () {

    By.addLocator('cssHasText', (cssEl, text, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        // Return an array of elements with the text.
        return Array.prototype.filter.call(els, (el) => {
            return el.textContent.trim() === text;
        });
    });

    By.addLocator('cssHasSubCss', (cssEl, subCss, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        // Return an array of elements with sub css.
        return Array.prototype.filter.call(els, (el) => {
            return el.querySelectorAll(subCss).length > 0
        });
    });

    By.addLocator('cssHasSubCssWithText', (cssEl, subCss, cssText, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        // Return an array of elements with sub css.
        return Array.prototype.filter.call(els, (el) => {
            return Array.prototype.filter.call(el.querySelectorAll(subCss), (el) => {
                return el.textContent.trim() === cssText;
            }).length > 0
        });
    });

    By.addLocator('cssSplitText', (cssEl, cssText, splitChar, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        // Return an array of elements with the text.
        return Array.prototype.filter.call(els, (el) => {
            return el.textContent.split(splitChar)[0].trim() === cssText;
        });
    });

    By.addLocator('cssHasTagText', (cssEl, text, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        // Return an array of elements with the text.
        return Array.prototype.filter.call(els, (el) => {
            return el.innerHTML.indexOf('>${text}<') >= 0;
        });
    });
})();