const index = require('./mock/server').server;

describe('Ric Escape - inventory', () => {
  it('tells you your inventory', () => {
    const request = aDfaV2Request()
      .withIntent('inventory')
      .withData({ inventory: ['comedor-cartera'] })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Llevo los siguientes objetos');
    expect(getDfaV2Conv().lastAsk).to.contains('Cartera');
  });

  it('tells you your inventory with multiple items', () => {
    const request = aDfaV2Request()
      .withIntent('inventory')
      .withData({ inventory: ['comedor-cartera', 'hab108-cuadro'] })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Llevo los siguientes objetos');
    expect(getDfaV2Conv().lastAsk).to.contains('Cartera y Cuadro');
  });

  xit('tells you your inventory with multiple items in English', () => {
    const request = aDfaV2Request()
      .withIntent('inventory')
      .withData({ inventory: ['comedor-cartera', 'hab108-cuadro'] })
      .withLocale('en-US')
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('carrying these items');
    expect(getDfaV2Conv().lastAsk).to.contains('Wallet and Picture');
  });


  it('tells you that has nothing', () => {
    const request = aDfaV2Request()
      .withIntent('inventory')
      .withData({ })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('No llevo nada encima.');
  });
});
