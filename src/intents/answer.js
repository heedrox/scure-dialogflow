const { scureAnswer } = require('scure').commands;
const { overwriteDataFrom, processContext, sendResponse } = require('../lib/common');

const answer = scure => (conv) => {
  const userAnswer = conv.body.queryResult.queryText;

  const scureResponse = scureAnswer(userAnswer, conv.data, scure);

  overwriteDataFrom(scureResponse, conv);
  processContext(conv);

  sendResponse(conv, scure, scureResponse);
};

exports.answer = answer;
