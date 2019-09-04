/**
 * Custom locators.
 */
(function () {

    By.addLocator('cssHasText', (cssEl, text, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        return Array.prototype.filter.call(els, (el) => {
            return el.textContent.trim() === text;
        });
    });

    By.addLocator('cssHasSubCss', (cssEl, subCss, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        return Array.prototype.filter.call(els, (el) => {
            return el.querySelectorAll(subCss).length > 0
        });
    });

    By.addLocator('cssHasSubCssWithText', (cssEl, subCss, cssText, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        return Array.prototype.filter.call(els, (el) => {
            return Array.prototype.filter.call(el.querySelectorAll(subCss), (el) => {
                return el.textContent.trim() === cssText;
            }).length > 0
        });
    });

    By.addLocator('cssSplitText', (cssEl, cssText, splitChar, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        return Array.prototype.filter.call(els, (el) => {
            return el.textContent.split(splitChar)[0].trim() === cssText;
        });
    });

    By.addLocator('cssHasTagText', (cssEl, text, opt_parentElement) => {
        let using = opt_parentElement || document;
        let els = using.querySelectorAll(cssEl);
        return Array.prototype.filter.call(els, (el) => {
            return el.innerHTML.indexOf('>' + text + '<') >= 0 || el.innerHTML.replace(/([\r\n\t])/g, '').search(new RegExp('>(\\s*)' + text.replace('(', '\\(').replace(')', '\\)') + '(\\s*)<', 'g')) >= 0;
        });
    });
})();