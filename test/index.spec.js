const index = require('./mock/server').server;

const scure = buildScure();
const ABOUT_90_MINUTES_AGO = new Date(new Date().getTime() - (90 * 1000 * 60));

describe('Ric Escape - others', () => {
  const TEST_CASES = [
    { data: null, expectedNumCommands: 1 },
    { data: { numCommands: 1 }, expectedNumCommands: 2 },
  ];

  TEST_CASES.forEach((testCase) => {
    it(`Counts num of commands for expected ${testCase.expectedNumCommands}: `, () => {
      const request = aDfaV2Request()
        .withIntent('help')
        .withData(testCase.data)
        .build();

      index.fulfillment(request);

      expect(getDfaV2Conv().data.numCommands).to.equal(testCase.expectedNumCommands);
    });
  });

  it('welcomes you', () => {
    const request = aDfaV2Request()
      .withIntent('_welcome')
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Soy RIC, tu Remoto');
  });

  it('tells you the time and map when help', () => {
    const request = aDfaV2Request()
      .withIntent('help')
      .withData({ numCommands: 10 })
      .build();

    index.fulfillment(request);

    const text = getDfaV2Conv().lastAsk.items[0];
    expect(text).to.contains('Me puedes dar las siguientes instrucciones: Mirar, Usar, Ir, Coger e Inventario.');
    expect(text).to.contains('Nos quedan');
    expect(text).to.contains('minutos y');
    expect(text).to.contains('segundos para estrellarnos.');

    expect(getDfaV2Conv().lastAsk.items[1].url).to.contains('ric-escape-map.jpg');
  });

  it('does not tell you the map when no screen capability', () => {
    const request = aDfaV2Request()
      .withIntent('help')
      .withLocale('es')
      .withSurfaceCapabilities(['actions.capability.AUDIO_OUTPUT'])
      .withData({ numCommands: 10 })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Me puedes dar las siguientes');
  });

  it('says goodbye if bye intent and cleans', () => {
    const request = aDfaV2Request()
      .withIntent('bye')
      .withData({ inventory: ['cartera'], startTime: JSON.stringify(new Date() - 50) })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastClose).to.contains('Adiós.');
    expect(getDfaV2Conv().data).to.eql(null);
  });

  it('finishes when time is up and cleans', () => {
    const request = aDfaV2Request()
      .withIntent('bye')
      .withData({ startTime: JSON.stringify(ABOUT_90_MINUTES_AGO), inventory: ['cartera'] })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastClose).to.contains(scure.sentences.get('end-timeover'));
    expect(getDfaV2Conv().data.inventory).to.eql([]);
  });
});
