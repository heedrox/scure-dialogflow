const index = require('./mock/server').server;

describe('when fallback', () => {
  it('gives you introduction the first time in any intent', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('¡Hola!');
    expect(getDfaV2Conv().data.numCommands).to.equal(1);
  });

  it('gives you another introduction the second time', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withData({ numCommands: 1 })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Tras el proceso biológico');
    expect(getDfaV2Conv().data.numCommands).to.equal(2);
  });

  it('tells you the time ', () => {
    const request = aDfaV2Request()
      .withIntent('_fallback')
      .withData({ numCommands: 2 })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('No te entiendo. Di Ayuda si');
    expect(getDfaV2Conv().lastAsk).to.contains('Nos quedan');
    expect(getDfaV2Conv().lastAsk).to.contains('minutos y');
    expect(getDfaV2Conv().lastAsk).to.contains('segundos para estrellarnos.');
  });
});
