const index = require('./mock/server').server;

xdescribe('Ric Escape - adds platform for analytics', () => {
  const TEST_CASES = [
    { source: 'google', expectedPlatform: 'google' },
    { source: 'facebook', expectedPlatform: 'facebook' },
    { source: 'telegram', expectedPlatform: 'telegram' },
    { source: null, expectedPlatform: 'PREVIOUS_SETTED_PLATFORM' },
  ];

  TEST_CASES.forEach((test) => {
    it('adds google assistant when welcome', () => {
      const request = aDfaV2Request()
        .withIntent('look')
        .withData({ platform: 'PREVIOUS_SETTED_PLATFORM' })
        .build();
      request.body.originalRequest = { source: test.source };

      index.fulfillment(request);

      expect(getDfaV2Conv().data.platform).to.equal(test.expectedPlatform);
    });
  });
});
