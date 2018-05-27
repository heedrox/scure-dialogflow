const index = require('./mock/server').server;

const scure = buildScure();

describe('Ric Escape - when using', () => {
  const WRONG_ARG_DATA = [
    { arg: null, expectedSentence: 'use-noarg', comment: 'no arg (null)' },
    { arg: [], expectedSentence: 'use-noarg', comment: 'no arg (null)' },
    { arg: 'Cuadro', expectedSentence: 'use-cant', comment: 'object does not exist' },
    { arg: 'sillas', expectedSentence: 'use-cant', comment: 'object cannot be used' },
  ];

  WRONG_ARG_DATA.forEach((data) => {
    it(`tells you cannot be used or wrong object when: ${data.comment}`, () => {
      const request = aDfaV2Request()
        .withIntent('use')
        .withArgs({ arg: data.arg })
        .withData({ roomId: 'sala-mandos' })
        .build();

      index.fulfillment(request);

      expect(getDfaV2Conv().lastAsk).to.equal(
        scure.sentences.get(data.expectedSentence, { item: data.arg }),
      );
    });
  });

  it('tells you cannot be used if not in room', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: 'diario' })
      .withData({ roomId: 'pasillo-norte' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.equal(scure.sentences.get('use-cant', { item: 'diario' }));
  });

  it('tells you cannot be used if there is no usage for it', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: 'cuadro' })
      .withData({ roomId: 'habitacion-108' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('cuadro');
  });

  it('uses items on inventory, but does not dispose them if onlyOnce = false', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: 'llave' })
      .withData({ roomId: 'habitacion-108', inventory: ['hab108-librarykey'], picked: ['hab108-librarykey'] })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('quieres usar la llave?');
    expect(getDfaV2Conv().data.inventory).to.contains('hab108-librarykey');
  });

  describe('using objects ok several times', () => {
    const TEST_DATA = [
      { usages: null, expectedText: 'Los primeros minutos del diario', nextUsage: 1 },
      { usages: [], expectedText: 'Los primeros minutos del diario', nextUsage: 1 },
      { usages: { 'sala-mandos-diario': 1 }, expectedText: 'Los siguientes minutos del diario', nextUsage: 2 },
      { usages: { 'sala-mandos-diario': 2 }, expectedText: 'Los últimos minutos del diario', nextUsage: 3 },
      { usages: { 'sala-mandos-diario': 3 }, expectedText: 'Los primeros minutos del diario', nextUsage: 4 },
    ];

    TEST_DATA.forEach((data) => {
      it(`responds depending of number of times used ${data.usages && data.usages['sala-mandos-diario']}`, () => {
        const request = aDfaV2Request()
          .withIntent('use')
          .withArgs({ arg: 'diario' })
          .withData({ roomId: 'sala-mandos', usages: data.usages })
          .build();

        index.fulfillment(request);

        expect(getDfaV2Conv().lastAsk).to.contains(data.expectedText);
        expect(getDfaV2Conv().data.usages['sala-mandos-diario']).to.equal(data.nextUsage);
      });
    });
  });

  describe('when unlocking actions', () => {
    it('adds to unlocked array', () => {
      const request = aDfaV2Request()
        .withIntent('use')
        .withArgs({ arg: 'diario de abordo' })
        .withData({ roomId: 'sala-mandos', usages: { 'sala-mandos-diario': 1 } })
        .build();

      index.fulfillment(request);

      expect(getDfaV2Conv().data.unlocked).to.eql(['hab108']);
    });
    it('does not add it twice', () => {
      const request = aDfaV2Request()
        .withIntent('use')
        .withArgs({ arg: 'diario de abordo' })
        .withData({ roomId: 'sala-mandos', unlocked: ['hab108'], usages: { 'sala-mandos-diario': 4 } })
        .build();

      index.fulfillment(request);

      expect(getDfaV2Conv().data.unlocked).to.eql(['hab108']);
    });
  });

  it('uses items even if wrongly accented', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: 'diário' })
      .withData({ roomId: 'sala-mandos' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.usages['sala-mandos-diario']).to.equal(1);
  });

  it('uses items that are in two different rooms, but chooses the right one depending on current roomId', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: 'diario' })
      .withData({ roomId: 'habitacion-108' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Son las primeras');
  });

  it('uses item from the inventory', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: 'cartera' })
      .withData({ roomId: 'sala-mandos', picked: ['comedor-cartera'], inventory: ['comedor-cartera'] })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.usages['comedor-cartera']).to.equal(1);
  });

  it('provides - picks items if is a pickable action and disposes old one', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: 'cartera' })
      .withData({ roomId: 'pasillo-norte', picked: ['comedor-cartera'], inventory: ['comedor-cartera'] })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Veo que');
    expect(getDfaV2Conv().data.picked).to.contains('comedor-cartera');
    expect(getDfaV2Conv().data.picked).to.contains('combinacion-4815');
    expect(getDfaV2Conv().data.inventory).to.not.contains('comedor-cartera');
    expect(getDfaV2Conv().data.inventory).to.contains('combinacion-4815');
  });

  it('provides - picks items if a pickable action even if I dont have it but im in the place', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: 'cartera' })
      .withData({ roomId: 'comedor', usages: { 'comedor-cartera': 1 } })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Ya utilicé ese objeto. No puedo usarlo otra vez.');
  });

  it('uses items if they are not attached to a room (null location)', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: 'robot' })
      .withData({ roomId: 'habitacion-108' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Ya me estás usando');
  });

  it('uses items only once if marked as onlyOnce to true', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: 'cartera' })
      .withData({ roomId: 'comedor' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Veo que');
    expect(getDfaV2Conv().data.picked).to.contains('comedor-cartera');
    expect(getDfaV2Conv().data.picked).to.contains('combinacion-4815');
    expect(getDfaV2Conv().data.inventory).to.not.contains('comedor-cartera');
    expect(getDfaV2Conv().data.inventory).to.contains('combinacion-4815');
  });

  it('tries to use two items but fails if no usage for both', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: ['combinación', 'cartera'] })
      .withData({
        roomId: 'habitacion-108',
        picked: ['comedor-cartera', 'combinacion-4815'],
        inventory: ['comedor-cartera', 'combinacion-4815'],
      })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('No puedo usar los objetos');
    expect(getDfaV2Conv().lastAsk).to.contains('cartera');
    expect(getDfaV2Conv().lastAsk).to.contains('combinación');
  });

  it('tries to use two items but fails if one not exists', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: ['noexiste', 'cartera'] })
      .withData({
        roomId: 'habitacion-108',
        picked: ['comedor-cartera', 'combinacion-4815'],
        inventory: ['comedor-cartera', 'combinacion-4815'],
      })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('No puedo usar el objeto');
    expect(getDfaV2Conv().lastAsk).to.contains('noexiste');
  });

  it('fails to use two items if were used and onlyOnce', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: ['combinacion', 'caja fuerte'] })
      .withData({
        roomId: 'habitacion-108',
        usages: { 'combinacion-4815-hab108-cajafuerte': 1 },
        picked: ['combinacion-4815'],
        inventory: ['combinacion-4815'],
      })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Ya utilicé esos objetos.');
  });

  it('uses two items', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: ['combinacion', 'caja fuerte'] })
      .withData({ roomId: 'habitacion-108', picked: ['combinacion-4815'], inventory: ['combinacion-4815'] })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('la caja se ha abierto.');
    expect(getDfaV2Conv().data.inventory).to.not.contains('combinacion-4815');
    expect(getDfaV2Conv().data.usages['combinacion-4815-hab108-cajafuerte']).to.equal(1);
  });

  describe('when conditional descriptions (ric + ordenador, for ex)', () => {
    const TEST_CASES = [
      { unlocked: [], expectedSentence: 'No puedo alterar' },
      { unlocked: ['ricmodified'], expectedSentence: 'he alterado el curso' },
    ];
    TEST_CASES.forEach((data) => {
      it(`tells the proper description when using (case ${JSON.stringify(data.unlocked)})`, () => {
        const request = aDfaV2Request()
          .withIntent('use')
          .withArgs({ arg: ['ric', 'ordenador'] })
          .withData({ roomId: 'sala-mandos', unlocked: data.unlocked })
          .build();

        index.fulfillment(request);

        expect(getDfaV2Conv().lastAsk + getDfaV2Conv().lastClose).to
          .contains(data.expectedSentence);
      });
    });

    describe('consumes the objects when consumesObjects = true and conditional', () => {
      it('does not consume the objects when consumesObjets = false', () => {
        const request = aDfaV2Request()
          .withIntent('use')
          .withArgs({ arg: ['codigo', 'ric'] })
          .withData({ roomId: 'sala-mandos', inventory: ['codigo-1893'], unlocked: [] })
          .build();

        index.fulfillment(request);

        expect(getDfaV2Conv().lastAsk).to.contains('Antes de introducir');
        expect(getDfaV2Conv().data.inventory).to.contains('codigo-1893');
      });

      it('consumes the objects when consumesObjets = true', () => {
        const request = aDfaV2Request()
          .withIntent('use')
          .withArgs({ arg: ['codigo', 'ric'] })
          .withData({ roomId: 'sala-mandos', inventory: ['codigo-1893'], unlocked: ['ricpending'] })
          .build();

        index.fulfillment(request);

        expect(getDfaV2Conv().lastAsk).to.contains('Hola, soy RIC, reestablecido a mis valores de fábrica. ');
        expect(getDfaV2Conv().data.inventory).to.not.contains('codigo-1893');
      });
    });
  });

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
