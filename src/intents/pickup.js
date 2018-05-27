const { getArgument } = require('../lib/common');
const { overwriteDataFrom } = require('../lib/common');

const { scurePickup } = require('scure').commands;

const pickup = scure => (conv, args) => {
  const itemName = getArgument(args, 'arg');

  const scureResponse = scurePickup(itemName, conv.data, scure);

  overwriteDataFrom(scureResponse, conv);
  conv.ask(scureResponse.sentence);
};

exports.pickup = pickup;
