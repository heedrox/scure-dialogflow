const index = require('./mock/server').server;

const scure = buildScure();

describe('Ric Escape - when walking', () => {
  it('changes the roomId when walking', () => {
    const request = aDfaV2Request()
      .withIntent('walk')
      .withArgs({ arg: 'comedor' })
      .withData({ roomId: 'pasillo-norte' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.roomId).to.equal('comedor');
    expect(getDfaV2Conv().lastAsk).to.contains('Estoy en el comedor de la nave espacial. Puedo ver mesas, sillas, comida varia y varios utensilios que no entiendo para qué funcionan. También veo algo en el suelo.');
  });

  it('cannot change the roomId when walking to somewhere not according to map', () => {
    const request = aDfaV2Request()
      .withIntent('walk')
      .withArgs({ arg: 'biblioteca' })
      .withData({ roomId: 'sala-mandos' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.roomId).to.equal('sala-mandos');
    expect(getDfaV2Conv().lastAsk).to.contains('No sé ir al sitio biblioteca.');
    expect(getDfaV2Conv().lastAsk).to.contains('Desde aquí puedo ir a: Pasillo norte');
  });

  const TEST_DATA = [
    { room: 'pasillo-norte', destinations: 'Sala de mandos, Comedor y Pasillo central' },
    { room: 'sala-mandos', destinations: 'Pasillo norte' },
  ];

  TEST_DATA.forEach((data) => {
    it('explains places to go when no arg is given', () => {
      const request = aDfaV2Request()
        .withIntent('walk')
        .withArgs({})
        .withData({ roomId: data.room })
        .build();

      index.fulfillment(request);

      expect(getDfaV2Conv().data.roomId).to.equal(data.room);
      expect(getDfaV2Conv().lastAsk).to.contains(`Desde aquí puedo ir a: ${data.destinations}`);
    });
  });

  it('does not change if the room cannot be found', () => {
    const request = aDfaV2Request()
      .withIntent('walk')
      .withArgs({ arg: 'pasillo de la muerte' })
      .withData({ roomId: 'sala-mandos' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.roomId).to.equal('sala-mandos');
    expect(getDfaV2Conv().lastAsk).to.contains('No sé ir al sitio pasillo de la muerte.');
  });

  describe('handles locks', () => {
    it('does not show a room if not unlocked', () => {
      const request = aDfaV2Request()
        .withIntent('walk')
        .withArgs({})
        .withData({ roomId: 'pasillo-sur' })
        .build();

      index.fulfillment(request);

      expect(getDfaV2Conv().lastAsk).to.contains('Desde aquí puedo ir a: Pasillo central');
    });

    it('shows a room if unlocked', () => {
      const request = aDfaV2Request()
        .withIntent('walk')
        .withArgs({})
        .withData({ roomId: 'pasillo-sur', unlocked: ['hab108'] })
        .build();

      index.fulfillment(request);

      expect(getDfaV2Conv().lastAsk).to.contains('Desde aquí puedo ir a: Habitación 108 y Pasillo central');
    });

    it('does not change if the room is locked', () => {
      const request = aDfaV2Request()
        .withIntent('walk')
        .withArgs({ arg: 'habitación 108' })
        .withData({ roomId: 'pasillo-sur' })
        .build();

      index.fulfillment(request);

      expect(getDfaV2Conv().data.roomId).to.equal('pasillo-sur');
      expect(getDfaV2Conv().lastAsk).to.contains('No sé ir al sitio habitación 108.');
    });

    xit('responds something else if lock destination has a sentence when locked', () => {
      const request = aDfaV2Request()
        .withIntent('walk')
        .withArgs({ arg: 'habitación 109' })
        .withData({ roomId: 'pasillo-sur' })
        .build();

      index.fulfillment(request);

      expect(getDfaV2Conv().data.roomId).to.equal('pasillo-sur');
      expect(getDfaV2Conv().lastAsk).to.contains('La habitación 109 está fregada y no puedes acceder hasta que se seque.');
    });
    it('changes room when room is unlocked', () => {
      const request = aDfaV2Request()
        .withIntent('walk')
        .withArgs({ arg: 'habitación 108' })
        .withData({ roomId: 'pasillo-sur', unlocked: ['hab108'] })
        .build();

      index.fulfillment(request);

      expect(getDfaV2Conv().data.roomId).to.equal('habitacion-108');
      expect(getDfaV2Conv().lastAsk).to.contains(scure.rooms.getRoom('habitacion-108').description);
    });
  });
  it('works with unaccented words', () => {
    const request = aDfaV2Request()
      .withIntent('walk')
      .withArgs({ arg: 'habitacion 108' })
      .withData({ roomId: 'pasillo-sur', unlocked: ['hab108'] })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().data.roomId).to.equal('habitacion-108');
  });
});
