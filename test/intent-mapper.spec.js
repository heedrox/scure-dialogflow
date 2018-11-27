const index = require('./mock/server').server;

const scure = buildScure();
describe('SCURE - you can map intents from scure config', () => {
  let oldConf;
  beforeEach(() => {
    oldConf = scure.data.intentMapper;
  });
  afterEach(() => {
    scure.data.intentMapper = oldConf;
  });
  it('an intentMapper is called for you to overwrite the intent if you want', () => {
    const theIntentStub = sinon.stub().returns(() => { });
    scure.data.intentMapper = sinon.stub().returns(() => theIntentStub);

    const request = aDfaV2Request()
      .withIntent('walk')
      .withData({ roomId: 'comedor' })
      .withArgs({ arg: 'ric' })
      .build();

    index.fulfillment(request);

    expect(theIntentStub.getCalls().length).to.equal(1);
    expect(scure.data.intentMapper.getCalls().length).to.equal(1);
    expect(scure.data.intentMapper.getCalls()[0].args[0].data).to.equal(scure.data);
    expect(scure.data.intentMapper.getCalls()[0].args[1]).to.equal(getDfaV2Conv());
    expect(scure.data.intentMapper.getCalls()[0].args[2].arg).to.equal('ric');
    expect(typeof scure.data.intentMapper.getCalls()[0].args[3]).to.equal('function');

  });
});
