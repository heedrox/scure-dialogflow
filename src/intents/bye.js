const { scureBye } = require('scure').commands;

const bye = scure => (conv) => {
  const response = scureBye(conv.data, scure);
  conv.data = null;
  conv.close(response.sentence);
};

exports.bye = bye;
