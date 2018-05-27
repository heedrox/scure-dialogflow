process.env.DEBUG = 'actions-on-google:*';
const { buildScureFor } = require('scure').scure;
const { intentProcessor } = require('../../lib/intent-processor');
const { DialogflowV2Mock } = require('./dialogflowapp-mock');
const { bye, fallback, help, inventory, look, pickup, use, walk, welcome, answer } = require('../../intents');

const appMock = (data) => {
  const appDialogflow = DialogflowV2Mock();
  const scure = buildScureFor(data);
  const scureIntentProcessor = intentProcessor(scure);

  appDialogflow.intent('_fallback', scureIntentProcessor(fallback));
  appDialogflow.intent('_welcome', scureIntentProcessor(welcome));
  appDialogflow.intent('_default-bye', scureIntentProcessor(bye));
  appDialogflow.intent('bye', scureIntentProcessor(bye));
  appDialogflow.intent('_exit', scureIntentProcessor(bye));
  appDialogflow.intent('look', scureIntentProcessor(look));
  appDialogflow.intent('walk', scureIntentProcessor(walk));
  appDialogflow.intent('pickup', scureIntentProcessor(pickup));
  appDialogflow.intent('use', scureIntentProcessor(use));
  appDialogflow.intent('inventory', scureIntentProcessor(inventory));
  appDialogflow.intent('answer', scureIntentProcessor(answer));
  appDialogflow.intent('help', scureIntentProcessor(help));

  return appDialogflow;
};

exports.appMock = appMock;
