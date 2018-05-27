const { scureInventory } = require('scure').commands;

const inventory = scure => (conv) => {
  const scureResponse = scureInventory(conv.data, scure);

  conv.ask(scureResponse.sentence);
};

exports.inventory = inventory;
