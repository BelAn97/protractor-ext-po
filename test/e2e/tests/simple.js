require('../glob.js');

describe('Simple Test Suit', function() {

    it('Positive test', async () => {
        await feature.open();
        await feature.featuresHeadlineList.checkTextListEqual(feature.CONST.HEADLINES.toUpperCase())
    });

    it('Positive test 2', async () => {
        await feature.open();
        let list = await feature.featuresHeadlineList.getTextList();
        list.should.eql(feature.CONST.HEADLINES.toUpperCase());
    });

    it('Negative test', async () => {
        await feature.open();
        await feature.featuresHeadlineList.checkTextListEqual(feature.CONST.HEADLINES)
    });

    it('Negative test 2', async () => {
        await feature.open();
        let list = await feature.featuresHeadlineList.getTextList();
        list.should.eql(feature.CONST.HEADLINES);
    });

});
