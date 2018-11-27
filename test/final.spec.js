const index = require('./mock/server').server;

const scure = buildScure();

describe('Ric Escape - ends', () => {
  it('ends the game when is ending scene and adds time', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: ['ric', 'ordenador'] })
      .withData({ roomId: 'sala-mandos', unlocked: ['ricmodified'] })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastClose).to.contains('he alterado');
    expect(getDfaV2Conv().lastClose).to.contains('Quedaban');
    expect(getDfaV2Conv().lastClose).to.contains('minutos');
  });

  it('ends the game when is ending scene and adds time in remainingTime', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: ['ric', 'ordenador'] })
      .withData({ roomId: 'sala-mandos', unlocked: ['ricmodified'] })
      .build();
    index.fulfillment(request);

    expect(getDfaV2Conv().lastClose).to.contains('he alterado');
    expect(getDfaV2Conv().lastClose).to.contains('Quedaban');
    expect(getDfaV2Conv().lastClose).to.contains('segundos</media>');
  });

  xit('ends the game when is ending scene and adds time in English', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: ['ric', 'computer'] })
      .withData({ roomId: 'sala-mandos', unlocked: ['ricmodified'] })
      .withLocale('en-US')
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastClose).to.contains('course');
    expect(getDfaV2Conv().lastClose).to.contains('You had left');
    expect(getDfaV2Conv().lastClose).to.contains('minutes');
  });
});
