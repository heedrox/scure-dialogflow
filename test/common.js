require('babel-register');
const actionsOnGoogle = require('actions-on-google');
const testData = require('./data/data-test').data;
const { DialogflowV2Mock, aDfaV2Request, getDfaV2App } = require('./mock/dialogflowapp-mock');
const { buildScureFor } = require('scure').scure;

global.chai = require('chai');
global.sinon = require('sinon');

global.chai.should();

global.expect = global.chai.expect;

actionsOnGoogle.dialogflow = DialogflowV2Mock;

// admin.initializeApp = () => { };
// functions.config = () => ({ firebase: {} });

global.aDfaV2Request = aDfaV2Request;
global.getDfaV2App = getDfaV2App;
global.getDfaV2Conv = () => getDfaV2App().conv;

global.buildScure = () => buildScureFor(testData);
