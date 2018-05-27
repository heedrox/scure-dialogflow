const index = require('./mock/server').server;

xdescribe('Ric Escape - feature toggles. When FT mode activated', () => {
  it('activates FT in unknown intent with command activate feature toggles', () => {
    const request = aDfaV2Request()
      .withIntent('input.unknown')
      .withRawInput('activateft')
      .withData({})
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.testFT).to.equal(true);
  });
  xit('shows helpTest instead of help', () => {
    const request = aDfaV2Request()
      .withIntent('help')
      .withData({ testFT: true })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk.constructor.name).to.equal('RichResponse');
  });
});
