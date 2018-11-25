const { getArgument } = require('../lib/common');
const { overwriteDataFrom } = require('../lib/common');
const { sendResponse } = require('../lib/common');

const { scurePickup } = require('scure').commands;

const pickup = scure => (conv, args) => {
  const itemName = getArgument(args, 'arg');

  const scureResponse = scurePickup(itemName, conv.data, scure);

  overwriteDataFrom(scureResponse, conv);
  sendResponse(conv, scure, scureResponse);
};

exports.pickup = pickup;
