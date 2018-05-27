const { sendResponse } = require('../lib/common');
const { scureHelp } = require('scure').commands;
const { Image } = require('actions-on-google');

const helpWithMap = scure => (conv) => {
  const response = scureHelp(conv.data, scure);
  const mapImage = new Image({
    url: scure.getMapImage().url,
    alt: scure.getMapImage().alt,
  });
  conv.ask(response.sentence, mapImage);
};

const helpWithoutMap = scure => (conv) => {
  const response = scureHelp(conv.data, scure);

  sendResponse(conv, scure, response);
};

// eslint-disable-next-line no-confusing-arrow
const help = scure => conv =>
  conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT') ?
    helpWithMap(scure)(conv) :
    helpWithoutMap(scure)(conv);


exports.help = help;
