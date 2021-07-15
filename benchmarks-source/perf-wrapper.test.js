const { extractLineStat } = require('./perf-wrapper');
const fs = require('fs');
const file = fs.readFileSync(__dirname + '/perf.test.file').toString();

describe('perf wrapper', () => {
  describe('extractLineStat', () => {
    test('it should get the total time spent', () => {
      const lines = file.split('\n');
      expect(extractLineStat(lines[14])).toEqual('1.031732300');
    });
  });
})