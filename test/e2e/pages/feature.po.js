require('../glob.js');

class FeaturePage{

    constructor() {
        this.url = '/features';
        this.angular = true;

        this.featuresHeadlineList = $$('.feature-header .text-headline');
        this.getStartedButton = element(By.buttonText('Get Started'));
        this.loaded = this.featuresHeadlineList.first();

        this.CONST = {
            TITLE: 'Angular - FEATURES & BENEFITS',
            HEADER_TITLE: 'Features & Benefits',
            HEADLINES: ['Cross Platform','Speed and Performance','Productivity','Full Development Story']
        };
    }

    async open() {
        await toolbar.goToFeature();
    };

}

Object.setPrototypeOf(FeaturePage.prototype, base);
module.exports = new FeaturePage();
