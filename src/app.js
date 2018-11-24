process.env.DEBUG = 'actions-on-google:*';
const { dialogflow } = require('actions-on-google');
const { buildScureFor } = require('scure').scure;
const { intentProcessor } = require('./lib/intent-processor');
const { checkForSyns } = require('./lib/check-for-syns');
const { bye, fallback, help, inventory, look, pickup, use, walk, welcome, answer } = require('./intents');

const app = (data) => {
  const scure = buildScureFor(data);

  const appDialogflow = dialogflow();

  const scureIntentProcessor = intentProcessor(scure);

  appDialogflow.intent('_fallback', scureIntentProcessor(fallback));
  appDialogflow.intent('_welcome', scureIntentProcessor(welcome));
  appDialogflow.intent('_default-bye', scureIntentProcessor(bye));
  appDialogflow.intent('bye', scureIntentProcessor(bye));
  appDialogflow.intent('_exit', scureIntentProcessor(bye));

  appDialogflow.intent('look', scureIntentProcessor(checkForSyns(look)));
  appDialogflow.intent('walk', scureIntentProcessor(checkForSyns(walk)));
  appDialogflow.intent('pickup', scureIntentProcessor(checkForSyns(pickup)));
  appDialogflow.intent('use', scureIntentProcessor(checkForSyns(use)));
  appDialogflow.intent('inventory', scureIntentProcessor(inventory));
  appDialogflow.intent('answer', scureIntentProcessor(answer));

  appDialogflow.intent('help', scureIntentProcessor(help));

  return appDialogflow;
};

exports.app = app;
