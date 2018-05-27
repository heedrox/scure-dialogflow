const { data } = require('../data/data-test');
const { app } = require('../../src/app');

const server = {
  fulfillment: (request) => {
    app(data)(request);
  },
};

exports.server = server;
