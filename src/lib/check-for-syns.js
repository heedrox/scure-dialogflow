const { getArgument } = require('./common');
const { Commands } = require('scure').dsl;
const { getCommandSyn } = require('scure').lib;
const { look, pickup, use, walk } = require('../intents');


const INTENT_COMMANDS_MAP = new Map([
  [walk, Commands.WALK],
  [look, Commands.LOOK],
  [pickup, Commands.PICKUP],
  [use, Commands.USE],
]);

const byCommand = command => intent => INTENT_COMMANDS_MAP.get(intent) === command;
const getCommand = intent => INTENT_COMMANDS_MAP.get(intent);
const getIntent = command => [...INTENT_COMMANDS_MAP.keys()].find(byCommand(command));

const checkForSyns = originalIntent => scure => (conv, args) => {
  console.log('check for syns');
  const argument = getArgument(args, 'arg');
  const command = getCommand(originalIntent);
  const commandToReplace = getCommandSyn(command, argument, conv.data, scure);
  const updatedIntent = commandToReplace ? getIntent(commandToReplace) : originalIntent;
  updatedIntent(scure)(conv, args);
};

exports.checkForSyns = checkForSyns;
