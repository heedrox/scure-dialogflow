const index = require('./mock/server').server;

describe('plugins are handled', () => {
  it('handles plugins extensions when actions', () => {
    const request = aDfaV2Request()
      .withIntent('answer')
      .withQueryText('1234')
      .withData({ dummyPluginText: '-MyDummyText-', roomId: 'sala-mandos', question: 'computer-code-plugin' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('-MyDummyText-Bien-MyDummyText-');
  });

  it('handles plugins extensions when using', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: ['gasotron', 'zanahoria'] })
      .withData({ dummyPluginText: '-MyDummyText-', roomId: 'comedor' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('-MyDummyText-Introduzco-MyDummyText-');
  });
});
