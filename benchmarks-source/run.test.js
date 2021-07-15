const { extractVersionNumber } = require('./run');

describe('Run', () => {
  describe('extractVersionNumber', () => {
    test('it should find versions formatted like xx.xx', () => {
      expect(extractVersionNumber('go version go1.14 darwin/amd64')).toEqual('1.14');
    });

    test('it should find versions formatted like xx.xx.xx', () => {
      expect(extractVersionNumber('go version go1.14.2 darwin/amd64')).toEqual('1.14.2');
    });
  })
});