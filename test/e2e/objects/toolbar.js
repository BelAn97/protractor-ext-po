require('../glob.js');

class Toolbar {

    constructor() {
        this.toolbar = $('.app-toolbar');
        this.homeLink = this.toolbar.$('.nav-link.home');
        this.featureLink = this.toolbar.$('[title="Features"]');
    }

    goToFeature(){
        this.featureLink.clickReady();
        feature.at();
    }

}

Object.setPrototypeOf(Toolbar.prototype, base);
module.exports = new Toolbar();