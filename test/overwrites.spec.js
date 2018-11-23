const index = require('./mock/server').server;
const { aCommandSyn, Commands } = require('scure').dsl;

const scure = buildScure();

describe('SCURE - overwrite commands', () => {
  let oldConf;
  beforeEach(() => {
    oldConf = scure.data.commandSyns;
  });
  afterEach(() => {
    scure.data.commandSyns = oldConf;
  });
  it('Overwrites commands through configuration with  arguments', () => {
    scure.data.commandSyns = scure.data.commandSyns || [];
    scure.data.commandSyns.push(aCommandSyn(Commands.WALK, 'ric', Commands.USE));

    const request = aDfaV2Request()
      .withIntent('walk')
      .withData({ roomId: 'comedor' })
      .withArgs({ arg: 'ric' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Ya me estás usando');
  });



  it('does not overwrite commands for different arguments', () => {
    scure.data.commandSyns = scure.data.commandSyns || [];
    scure.data.commandSyns.push(aCommandSyn(Commands.WALK, 'ric', Commands.USE));

    const request = aDfaV2Request()
      .withIntent('walk')
      .withData({ roomId: 'comedor' })
      .withArgs({ arg: 'pasillo norte' })
      .build();

    index.fulfillment(request);

    expect(getDfaV2Conv().lastAsk).to.contains('Estoy en el pasillo norte');
  });

});
