require('../glob.js');
class Footer {

    constructor() {
        this.footer = $('footer');
        this.footerCopyright = this.footer.element(By.cssHasSubCss('aio-footer p', '[title="License text"]'));
        
        this.CONST = {
            COPYRIGHT: 'Powered by Google ©2010-2017. Code licensed under an MIT-style License. Documentation licensed under CC BY 4.0.'
        };

        this.RESOURCES = {
            ABOUT: 'About',
            RESOURCE_LISTING: 'Resource Listing'
        };
    }

}

Object.setPrototypeOf(Footer.prototype, base);
module.exports = new Footer();