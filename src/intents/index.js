const { walk } = require('./walk');
const { look } = require('./look');
const { pickup } = require('./pickup');
const { use } = require('./use');
const { inventory } = require('./inventory');
const { help } = require('./help');
const { fallback } = require('./fallback');
const { welcome } = require('./welcome');
const { bye } = require('./bye');
const { timeOver } = require('./time-over');
const { answer } = require('./answer');

module.exports =
  { walk, look, pickup, use, inventory, help, fallback, welcome, bye, timeOver, answer };
