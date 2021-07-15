const execSync = require('child_process').execSync;

const measuresMap = {
  'time elapsed': 14,
  'user': 16,
  'system': 17,
  'task-clock': 5,
  'context-switches': 6,
  'cpu-migrations': 7,
  'page-faults': 8
};

/**
 * 
 * @param {string} command 
 * @returns {string}
 */
 function exec(command, options) {
  try {
    execSync(`perf stat -o ${__dirname}/tmp ${command}`, options);
  } catch (e) {
    throw e;
  }
  const res = execSync(`cat ${__dirname}/tmp`).toString();
  return res;
}

/**
 * 
 * @param {string} perfOutput 
 */
 function parseOutput(perfOutput) {
  const lines = perfOutput.split('\n');
  return {
    'time elapsed': extractLineStat(lines[14]),
    'user': extractLineStat(lines[16]),
    'system': extractLineStat(lines[17]),
    'task-clock': extractLineStat(lines[5]),
    'context-switches': extractLineStat(lines[6]),
    'cpu-migrations': extractLineStat(lines[7]),
    'page-faults': extractLineStat(lines[8]),
  };
}

/**
 * 
 * @param {string} line
 */
 function extractLineStat(line) {
  return line.trim().split(/\s+/).map(item => item.trim())[0];
}

module.exports = {
  exec,
  parseOutput,
  extractLineStat,
}
