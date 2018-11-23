const { fallback, timeOver } = require('../intents/index');
const { scureInitializeState } = require('scure').commands;
const { isTimeOver } = require('./common');


const isBeginning = (scure, conv) => conv.data.numCommands < scure.getInit().welcome.length;
const getIntentToUse = (scure, conv, intentFunction) => {
  if (isBeginning(scure, conv)) {
    return fallback;
  } else if (isTimeOver(conv.data)) {
    return timeOver;
  }
  return intentFunction;
};

const intentProcessor = scure => intentFunction => (conv, args) => {
  // eslint-disable-next-line no-console
  console.log(`Intent: ${conv.data && conv.data.numCommands}`);

  conv.data = scureInitializeState(scure, conv.data);
  const intentToUse = getIntentToUse(scure, conv, intentFunction);
  intentToUse(scure)(conv, args);
};

exports.intentProcessor = intentProcessor;
