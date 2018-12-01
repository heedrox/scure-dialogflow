const { getCommandSyn } = require('scure').lib;
const { getArgument } = require('./common');
const { getCommandForIntent, getIntentForCommand } = require('./intent-command-mapper.js');

const checkForSyns = originalIntent => scure => (conv, args) => {
  const argument = getArgument(args, 'arg');
  const command = getCommandForIntent(originalIntent);
  const commandToReplace = getCommandSyn(command, argument, conv.data, scure);
  const updatedIntent = commandToReplace ? getIntentForCommand(commandToReplace) : originalIntent;
  updatedIntent(scure)(conv, args);
};

exports.checkForSyns = checkForSyns;
