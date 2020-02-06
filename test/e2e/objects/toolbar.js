require('../glob.js');

class Toolbar {

    constructor() {
        this.toolbar = $('.app-toolbar');
        this.homeLink = this.toolbar.$('.nav-link.home');
        this.featureLink = this.toolbar.$('[title="Features"]');
    }

    async goToFeature(){
        await this.featureLink.clickReady();
        await feature.at();
    }

}

Object.setPrototypeOf(Toolbar.prototype, base);
module.exports = new Toolbar();
