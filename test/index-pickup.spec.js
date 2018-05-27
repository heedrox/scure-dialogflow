const index = require('./mock/server').server;

const scure = buildScure();

describe('Ric Escape - when picking up', () => {
  it('tells you item unknown when no arg', () => {
    const request = aDfaV2Request()
      .withIntent('pickup')
      .withData({ numCommands: 23 })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.equal(scure.sentences.get('item-unknown'));
  });

  it('tells you item unknown when invalid arg', () => {
    const request = aDfaV2Request()
      .withIntent('pickup')
      .withArgs({ arg: 'not a valid object' })
      .withData({ roomId: 'pasillo-norte' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('No veo el objeto not a valid object por aquí');
  });

  it('tells you item unknown when arg, but in different room', () => {
    const request = aDfaV2Request()
      .withIntent('pickup')
      .withArgs({ arg: 'cartera' })
      .withData({ roomId: 'pasillo-norte' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('No veo el objeto cartera por aquí');
  });

  it('tells you it cannot be picked when item not pickable', () => {
    const request = aDfaV2Request()
      .withIntent('pickup')
      .withArgs({ arg: 'ventanas' })
      .withData({ roomId: 'sala-mandos' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('No puedo llevarme el objeto ventanas al exterior conmigo');
  });

  it('tells you it cannot be picked when item already picked up', () => {
    const request = aDfaV2Request()
      .withIntent('pickup')
      .withArgs({ arg: 'cartera' })
      .withData({ roomId: 'comedor', picked: ['comedor-cartera'] })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Ya me llevé el objeto cartera.');
  });

  describe('when valid objects', () => {
    beforeEach(() => {
      const request = aDfaV2Request()
        .withIntent('pickup')
        .withArgs({ arg: 'cartera' })
        .withData({ roomId: 'comedor' })
        .build();

      index.fulfillment(request);
    });
    it('tells you it picked it up when valid arg', () => {
      expect(getDfaV2Conv().lastAsk).to.contains('Me llevo el objeto cartera conmigo');
    });

    it('adds the object to inventory', () => {
      expect(getDfaV2Conv().data.inventory).to.eql(['comedor-cartera']);
    });

    it('marks it as picked up', () => {
      expect(getDfaV2Conv().data.picked).to.eql(['comedor-cartera']);
    });
  });

  it('tells an aditional response if the item has an aditional picking response', () => {
    const request = aDfaV2Request()
      .withIntent('pickup')
      .withArgs({ arg: 'cuadro' })
      .withData({ roomId: 'habitacion-108' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Me llevo el objeto cuadro conmigo');
    expect(getDfaV2Conv().lastAsk).to.contains('Veo que al llevarme el cuadro');
  });

  it('tells you first that it has it, if item already in inventory', () => {
    const request = aDfaV2Request()
      .withIntent('pickup')
      .withArgs({ arg: 'aparato' })
      .withData({ roomId: 'habitacion-108', inventory: ['hab108-aparato'] })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Ya llevo conmigo');
    expect(getDfaV2Conv().lastAsk).to.contains('aparato');
  });
});
