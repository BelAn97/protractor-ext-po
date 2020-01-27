require('../glob.js');

describe('Simple Test Suit', function() {

    it('Positive test', () => {
        feature.open();
        feature.featuresHeadlineList.checkTextListEqual(feature.CONST.HEADLINES.toUpperCase())
    });

    it('Positive async test', async () => {
        feature.open();
        let list = await feature.featuresHeadlineList.getTextList();
        list.should.eql(feature.CONST.HEADLINES.toUpperCase());
    });

    it('Negative test', () => {
        feature.open();
        feature.featuresHeadlineList.checkTextListEqual(feature.CONST.HEADLINES)
    });

    it('Negative async test', async () => {
        feature.open();
        let list = await feature.featuresHeadlineList.getTextList();
        list.should.eql(feature.CONST.HEADLINES);
    });

});
