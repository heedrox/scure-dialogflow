const { getArgumentList } = require('../lib/common');
const { scureUse } = require('scure').commands;
const { processContext, overwriteDataFrom, sendResponse } = require('../lib/common');

const use = scure => (conv, args) => {
  const items = getArgumentList(args, 'arg');

  const scureResponse = scureUse(items, conv.data, scure);

  overwriteDataFrom(scureResponse, conv);
  processContext(conv);

  sendResponse(conv, scure, scureResponse);
};

exports.use = use;
