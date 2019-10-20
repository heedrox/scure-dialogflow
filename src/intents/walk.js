const { getArgument } = require('../lib/common');
const { overwriteDataFrom } = require('../lib/common');
const { scureWalk } = require('scure').commands;
const { sendResponse } = require('../lib/common');

const hasValue = x => (typeof x !== 'undefined') && (x!=='');

const addWalkingSound = (response, scure) => {
  const walkingSound = scure.sentences.get('walking-sound');
  if (hasValue(walkingSound)) {
    response.sentence = walkingSound + response.sentence;
  }
};

const addWalkingSoundIfRoomChanges = (scureResponse, previousRoom, conv, scure) => {
  const newRoom = conv.data.roomId;

  if (newRoom !== previousRoom) {
    addWalkingSound(scureResponse, scure);
  }
};

const walk = scure => (conv, args) => {
  const arg = getArgument(args, 'arg');
  const previousRoom = conv.data.roomId;

  const scureResponse = scureWalk(arg, conv.data, scure);

  overwriteDataFrom(scureResponse, conv);
  addWalkingSoundIfRoomChanges(scureResponse, previousRoom, conv, scure);
  sendResponse(conv, scure, scureResponse);
};

exports.walk = walk;
