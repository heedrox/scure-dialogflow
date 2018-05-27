const { getArgument } = require('../lib/common');
const { overwriteDataFrom } = require('../lib/common');
const { scureLook } = require('scure').commands;

const look = scure => (conv, args) => {
  const itemName = getArgument(args, 'arg');

  const scureResponse = scureLook(itemName, conv.data, scure);

  overwriteDataFrom(scureResponse, conv);
  conv.ask(scureResponse.sentence);
};

exports.look = look;
