process.env.DEBUG = 'actions-on-google:*';
const { dialogflow } = require('actions-on-google');
const { appExecutor } = require('./lib/app-executor');

const app = (data) => {
  const dflow = dialogflow();
  return appExecutor(dflow)(data);
};

exports.app = app;
