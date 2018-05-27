const index = require('./mock/server').server;

describe('Ric Escape - answering actions', () => {
  it('uses items that expect answer', () => {
    const request = aDfaV2Request()
      .withIntent('use')
      .withArgs({ arg: 'Objeto especial para esperar respuesta' })
      .withData({ roomId: 'sala-mandos' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Dime un número');
    expect(getDfaV2Conv().contexts.getLifespan('expecting-answer')).to.equal(1);
    expect(getDfaV2Conv().data.question).to.equal('number-for-expect');
    expect(getDfaV2Conv().data.lastContext).to.be.undefined;
  });

  it('answers with unlock action', () => {
    const request = aDfaV2Request()
      .withIntent('answer')
      .withQueryText('9876')
      .withData({ roomId: 'sala-mandos', question: 'computer-code' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('El código es correcto. Has desbloqueado el lock.');
    expect(getDfaV2Conv().data.unlocked).to.contains('computer-code-lock');
    expect(getDfaV2Conv().data.question).to.be.undefined;
  });

  it('answers are converted to numbers', () => {
    const request = aDfaV2Request()
      .withIntent('answer')
      .withQueryText('9 8 7 seis')
      .withData({ roomId: 'sala-mandos', question: 'computer-code' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('El código es correcto. Has desbloqueado el lock.');
  });

  it('answers gracefully if no question was pending', () => {
    const request = aDfaV2Request()
      .withIntent('answer')
      .withQueryText('9876')
      .withData({ roomId: 'sala-mandos' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('¿Perdona? No estaba esperando una respuesta. Inténtalo otra vez.');
  });
});
