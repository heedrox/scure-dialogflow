/* eslint-disable no-console */
const { appMock } = require('./mock/app-mock');
const { aDfaV2Request, getDfaV2App } = require('./mock/dialogflowapp-mock');
const { buildScureFor } = require('scure').scure;

const getDfaV2Conv = () => getDfaV2App().conv;

const isQueryTextBasedOnData = qt => (qt && qt.indexOf('data.') >= 0);
const getDataValueOfQuery = (qt, data) => {
  const qtr = qt.replace('data.', '');
  return `${data[qtr]}`;
};
const parseQueryText = (queryText, data) =>
  (isQueryTextBasedOnData(queryText) ? getDataValueOfQuery(queryText, data) : queryText);

const runWalkthrough = (scureData, commands) => {
  console.log('Executing walkthrough... ');

  global.buildScure = () => buildScureFor(scureData);

  const appMockData = appMock(scureData);

  commands.forEach((command) => {
    console.log('\n\x1b[33mcommand', command, '\x1b[0m');
    const data = getDfaV2Conv() ? getDfaV2Conv().data : null;

    const queryText = parseQueryText(command.queryText, data);

    const request = aDfaV2Request()
      .withIntent(command.intent)
      .withArgs({ arg: command.arg })
      .withData(data)
      .withQueryText(queryText)
      .build();

    appMockData(request);

    const conv = getDfaV2Conv();

    if (conv.lastAsk) {
      console.log('Data', conv.data);
      console.log('It says: \x1b[31m', conv.lastAsk, '\x1b[0m');
    } else {
      console.log('\x1b[41m **** ENDING SCENE ***** \x1b[0m');
      console.log('Data', conv.data);
      console.log('It says: \x1b[31m', conv.lastClose, '\x1b[0m');
      console.log('\x1b[41m **** ENDING SCENE ***** \x1b[0m');
    }
  });
};

exports.runWalkthrough = runWalkthrough;
