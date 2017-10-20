require('../glob.js');

describe('Simple Test Suit', function() {

    it('Positive test', () => {
        feature.open();
    });

    it('Negative test', () => {
        feature.open();
        feature.featuresHeadlineList.checkTextListEqual(feature.CONST.HEADLINES)
    });


});