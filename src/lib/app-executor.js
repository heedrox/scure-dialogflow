process.env.DEBUG = 'actions-on-google:*';
const { buildScureFor } = require('scure').scure;
const { intentProcessor } = require('./intent-processor');
const { checkForSyns } = require('./check-for-syns');
const { bye, fallback, help, inventory, look, pickup, use, walk, welcome, answer } = require('../intents');

const appExecutor = executor => (data) => {
  const scure = buildScureFor(data);

  const scureIntentProcessor = intentProcessor(scure);

  executor.intent('_fallback', scureIntentProcessor(fallback));
  executor.intent('_welcome', scureIntentProcessor(welcome));
  executor.intent('_default-bye', scureIntentProcessor(bye));
  executor.intent('bye', scureIntentProcessor(bye));
  executor.intent('_exit', scureIntentProcessor(bye));

  executor.intent('look', scureIntentProcessor(checkForSyns(look)));
  executor.intent('walk', scureIntentProcessor(checkForSyns(walk)));
  executor.intent('pickup', scureIntentProcessor(checkForSyns(pickup)));
  executor.intent('use', scureIntentProcessor(checkForSyns(use)));
  executor.intent('inventory', scureIntentProcessor(inventory));
  executor.intent('answer', scureIntentProcessor(answer));

  executor.intent('help', scureIntentProcessor(help));

  return executor;
};

exports.appExecutor = appExecutor;
