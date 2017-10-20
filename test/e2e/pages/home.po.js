require('../glob.js');

class HomePage{

    constructor() {
        this.url = '';
        this.angular = true;

        this.logo = $('.hero-logo img');
        this.getStartedButton = element(By.buttonText('Get Started'));
        this.loaded = this.logo;

        this.CONST = {
            TITLE: 'Angular',
        };
    }

}

Object.setPrototypeOf(HomePage.prototype, base);
module.exports = new HomePage();