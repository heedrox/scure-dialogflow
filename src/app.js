process.env.DEBUG = 'actions-on-google:*';
const { dialogflow } = require('actions-on-google');
const { buildScureFor } = require('scure').scure;
const { Commands } = require('scure').dsl;
const { intentProcessor } = require('./lib/intent-processor');
const { bye, fallback, help, inventory, look, pickup, use, walk, welcome, answer } = require('./intents');
const { getArgument } = require('./lib/common');

const INTENT_COMMANDS_MAP = new Map([
  [walk, Commands.WALK],
  [look, Commands.LOOK],
  [pickup, Commands.PICKUP],
  [use, Commands.USE],
]);
const byCommand = command => intent => INTENT_COMMANDS_MAP.get(intent) === command;
const getCommand = intent => INTENT_COMMANDS_MAP.get(intent);
const getIntent = command => [...INTENT_COMMANDS_MAP.keys()].find(byCommand(command));
const byCommandSyn = (command, argument) => commandSyn => {
  return (commandSyn.fromCommand === command) && (argument === commandSyn.arg);
};
const checkForSyns = originalIntent => scure => (conv, args) => {
  const argument = getArgument(args, 'arg');
  const command = getCommand(originalIntent);
  const commandToReplace = scure.data.commandSyns ?
    scure.data.commandSyns.find(byCommandSyn(command, argument)) : null;
  const updatedIntent = commandToReplace ? getIntent(commandToReplace.toCommand) : originalIntent;
  updatedIntent(scure)(conv, args);
};

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
