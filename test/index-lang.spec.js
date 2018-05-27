const index = require('./mock/server').server;

xdescribe('Ric Escape - handles language', () => {
  it('gets sentences in english when locale english', () => {
    const request = aDfaV2Request()
      .withIntent('walk')
      .withLocale('en-US')
      .withData({ numCommands: 10 })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('From here I can go');
  });

  xit('can change language', () => {
    const request = aDfaV2Request()
      .withIntent('language')
      .withArgs({ arg: 'english' })
      .withData({ numCommands: 10, lastIntro: 1 })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.language).to.equal('en');
    expect(getDfaV2Conv().data.dontChangeLanguage).to.equal(1);
    expect(getDfaV2Conv().lastAsk).to.contains('I will speak in english');
  });

  xit('says cannot change language when language unknown', () => {
    const request = aDfaV2Request()
      .withIntent('language')
      .withArgs({ arg: 'notknownlang' })
      .withData({ numCommands: 10, lastIntro: 1 })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.language).to.equal('es');
    expect(getDfaV2Conv().lastAsk).to.contains('No sé hablar el idioma notknownlang. Solo sé hablar inglés y español.');
  });

  it('does not change language if already set', () => {
    const request = aDfaV2Request()
      .withIntent('look')
      .withArgs({ arg: null })
      .withLocale('es')
      .withData({ language: 'en', numCommands: 10, dontChangeLanguage: 1, roomId: 'sala-mandos' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.language).to.equal('en');
    expect(getDfaV2Conv().lastAsk).to.contains('I am at the control');
  });

  it('changes language when rawinput comes with english', () => {
    const request = aDfaV2Request()
      .withIntent('look')
      .withArgs({ arg: null })
      .withRawInput('talk in english')
      .withLocale('es')
      .withData({ language: 'es', numCommands: 10, roomId: 'sala-mandos' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.language).to.equal('en');
    expect(getDfaV2Conv().lastAsk).to.contains('I will speak in english');
    expect(getDfaV2Conv().data.numCommands).to.equal(10);
  });

  it('changes language when rawinput comes with spanish', () => {
    const request = aDfaV2Request()
      .withIntent('look')
      .withArgs({ arg: null })
      .withRawInput('hablar en español')
      .withLocale('en')
      .withData({ language: 'en', numCommands: 10, roomId: 'sala-mandos' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.language).to.equal('es');
    expect(getDfaV2Conv().lastAsk).to.contains('hablaré en espanol');
    expect(getDfaV2Conv().data.numCommands).to.equal(10);
  });
});
