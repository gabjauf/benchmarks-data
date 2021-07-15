const { extractLineStat, durationToSeconds } = require('./time-wrapper');
const fs = require('fs');
const file = fs.readFileSync(__dirname + '/time.test.file').toString();

describe('time wrapper', () => {
  describe('extractLineStat', () => {
    test('it should get the total time spent', () => {
      const lines = file.split('\n');
      expect(extractLineStat(lines[4])).toEqual('0m 1.40s');
    });
  });

  describe('durationToSeconds', () => {
    test('it should parse seconds', () => {
      expect(durationToSeconds('0m 1.41s')).toEqual('1.41');
    });

    test('it should parse minutes', () => {
      expect(durationToSeconds('2m 1.42s')).toEqual('121.42');
    });

    test('it should parse hours', () => {
      expect(durationToSeconds('1h 0m 1.43s')).toEqual('3601.43');
    });
  })
});