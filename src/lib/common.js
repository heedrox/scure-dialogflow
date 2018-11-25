const forceItemsToBeArray = (items) => {
  if (items && typeof items === 'object' && typeof items.length === 'number') return items;
  return [items];
};

exports.getArgument = (args, argName) => {
  const value = args[argName];
  if (!value) return null;
  if (typeof value === 'object' && typeof value.length === 'number') return value[0];
  return value;
};

exports.getArgumentList = (args, argName) => forceItemsToBeArray(args[argName]);

exports.isEmptyArg = (arg) => {
  if (!arg) return true;
  if (typeof arg.length !== 'undefined' && arg.length === 0) return true;
  if (JSON.stringify(arg).trim() === '[]') return true;
  if (JSON.stringify(arg).trim() === '{}') return true;
  if (arg.trim && (arg.trim() === '')) return true;
  return false;
};

exports.overwriteDataFrom = (scureResponse, conv) => {
  if (scureResponse.data) {
    conv.data = scureResponse.data;
  }
};

exports.isTimeOver = (data, scure) => {
  const startTime = new Date(JSON.parse(data.startTime || JSON.stringify(new Date())));
  const currentTime = new Date();
  return (currentTime.getTime() - startTime.getTime()) > (scure.data.init.totalMinutes * 60 * 1000);
};

exports.cleanData = (conv) => {
  conv.data.numCommands = 0;
  conv.data.roomId = null;
  conv.data.startTime = null;
  conv.data.inventory = [];
  conv.data.picked = [];
  return conv;
};

exports.baseChars = str => str.toLowerCase().replace(/[áäàÀÁÂÃÄÅ]/g, 'a')
  .replace(/[èéèÈÉÊË]/g, 'e')
  .replace(/[íìIÎ]/g, 'i')
  .replace(/[óòÓÔ]/g, 'o')
  .replace(/[úùüÙ]/g, 'u')
  .replace(/[çÇ]/g, 'c')
  .replace(/[ñÑ]/g, 'n')
  .replace(/[-\\?]/g, '');

exports.processContext = (conv) => {
  if (conv.data.lastContext) {
    conv.contexts.set(conv.data.lastContext, 1);
    conv.data.lastContext = undefined;
  }
};

exports.sendResponse = (conv, scure, scureResponse) => {
  const finalSentence = scureResponse.sentence;
  if (finalSentence.isEndingScene) {
    const timeLeft = scure.getLeftTimeFrom(conv.data.startTime);
    const endingRemainingTime =
      scure.sentences.get('ending-remaining-time', { timeLeft });
    const finalWords = `${finalSentence.description} ${endingRemainingTime}`;
    conv.close(finalWords);
  } else {
    conv.ask(finalSentence);
  }
};
