process.env.DEBUG = 'actions-on-google:*';
const { DialogflowV2Mock } = require('./dialogflowapp-mock');
const { appExecutor } = require('../../lib/app-executor');

const appMock = (data) => {
  const dflowMock = DialogflowV2Mock();
  return appExecutor(dflowMock)(data);
};

exports.appMock = appMock;
