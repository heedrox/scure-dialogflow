/* eslint-disable prefer-destructuring */
class DialogflowV2ContextsMock {
  constructor() {
    this.contexts = {};
  }

  set(name, lifespan) {
    this.contexts[name] = lifespan;
  }

  getLifespan(name) {
    return this.contexts[name];
  }
}

class DialogflowV2ConvMock {
  constructor({ request, intent, data, locale, capabilities, body }) {
    this.request = request;
    this.data = data;
    this.locale = locale;
    this.capabilities = capabilities;
    this.intent = intent;
    this.body = body;

    this.lastAsk = '';
    this.lastClose = '';
    this.contexts = new DialogflowV2ContextsMock();
    this.surface = {
      capabilities: {
        has: capability =>
          this.capabilities && (this.capabilities.indexOf(capability) >= 0),
      },
    };
  }

  ask(...sentence) {
    if (sentence && sentence.length === 1) {
      this.lastAsk = sentence[0];
    } else if (sentence && sentence.length > 1) {
      this.lastAsk = { items: sentence };
    }
  }

  close(sentence) {
    this.lastClose = sentence;
  }
}

class DialogflowV2AppMock {
  constructor() {
    this.conv = null;
    this.handlers = [];
    this.data = null;
    this.locale = null;
    this.capabilities = null;
    global.dfaV2App = this;
  }

  setRequest(request) {
    this.request = request;
    this.data = request.body.data;
    this.locale = request.body.locale;
    this.capabilities = request.body.capabilities;
    this.body = request.body;
  }

  intent(name, fn) {
    this.handlers[name] = fn;
  }

  executeIntent(name) {
    const options = {
      request: this.request,
      data: this.data,
      locale: this.locale,
      capabilities: this.capabilities,
      intent: name,
      body: this.body,
    };
    this.conv = new DialogflowV2ConvMock(options);
    const intent = this.handlers[name];
    if (!intent) {
      throw Error(`Intent to be mocked not found: ${name}`);
    }
    intent(this.conv, this.request.body.args);
  }
}

class DfaV2RequestBuilder {
  constructor() {
    this.intent = '';
    this.args = [];
    this.data = {};
    this.rawInput = null;
    this.queryText = null;
    this.locale = null;
    this.capabilities = ['actions.capability.AUDIO_OUTPUT', 'actions.capability.SCREEN_OUTPUT'];
  }

  withSurfaceCapabilities(capabilities) {
    this.capabilities = capabilities;
    return this;
  }

  withIntent(intent) {
    this.intent = intent;
    return this;
  }

  withArgs(args) {
    this.args = args;
    return this;
  }

  withData(data) {
    this.data = data;
    if (this.data && !this.data.numCommands) this.data.numCommands = 20;
    return this;
  }

  withRawInput(rawInput) {
    this.rawInput = rawInput;
    return this;
  }

  withQueryText(rawInput) {
    this.queryText = rawInput;
    return this;
  }

  withLocale(locale) {
    this.locale = locale;
    return this;
  }

  build() {
    return {
      body: {
        intent: this.intent,
        args: this.args,
        data: this.data,
        queryResult: {
          queryText: this.queryText,
        },
        result: {
          resolvedQuery: this.rawInput,
        },
        locale: this.locale,
        capabilities: this.capabilities,
      },
      headers: [],
    };
  }
}

const DialogflowV2Mock = () => {
  global.dfaV2App = new DialogflowV2AppMock();
  const mock = (request) => {
    global.dfaV2App.setRequest(request);
    global.dfaV2App.executeIntent(request.body.intent);
  };
  mock.intent = (name, fn) => {
    global.dfaV2App.intent(name, fn);
  };
  return mock;
};

const aDfaV2Request = () => new DfaV2RequestBuilder();

exports.DialogflowV2Mock = DialogflowV2Mock;
exports.DfaV2RequestBuilder = DfaV2RequestBuilder;

exports.aDfaV2Request = aDfaV2Request;
exports.getDfaV2App = () => global.dfaV2App;
