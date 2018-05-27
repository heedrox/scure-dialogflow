const { sendResponse } = require('../lib/common');
const { scureWelcome } = require('scure').commands;

const welcome = scure => (conv) => {
  const response = scureWelcome(conv.data, scure);

  sendResponse(conv, scure, response);
};

exports.welcome = welcome;
