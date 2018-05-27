const { getArgument } = require('../lib/common');
const { overwriteDataFrom } = require('../lib/common');
const { scureWalk } = require('scure').commands;

const walk = scure => (conv, args) => {
  const arg = getArgument(args, 'arg');

  const scureResponse = scureWalk(arg, conv.data, scure);

  overwriteDataFrom(scureResponse, conv);
  conv.ask(scureResponse.sentence);
};

exports.walk = walk;
