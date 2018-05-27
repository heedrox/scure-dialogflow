const { scureTimeover } = require('scure').commands;

const timeOver = scure => (conv) => {
  const response = scureTimeover(conv.data, scure);
  conv.close(response.sentence);
};

exports.timeOver = timeOver;
