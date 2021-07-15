#!/usr/bin/env node
const glob = require('tiny-glob');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const languages = require('../languages.json');
const perf = require('./perf-wrapper');
const time = require('./time-wrapper');

const benchmarkerMap = {
  time,
  perf,
};

const benchmarkerName = process.env.BENCHMARKER || 'time';
const benchmarker = benchmarkerMap[benchmarkerName];

const lang = process.env.BENCHMARKED_LANG;
const OS = process.env.OS;

const langConfig = languages.find(el => el.name === lang);

if (require.main === module) {
  const version = getVersionNumber();

  /**
 * 
 * @param {string} data 
 */
  function formatOutput(executionData, compilingData) {
    // let res = [];
    // res.push(new Date());
    // res.push(lang);
    // res.push(version);
    // res.push(...dataToArray(executionData));
    // res.push(...dataToArray(compilingData));
    // return res.join(";") + '\n';
    return {
      date: new Date(),
      lang,
      version,
      execution: executionData,
      compiling: compilingData,
    };
  }

  const benchmarks = fs.readdirSync(`${__dirname}/benchmarks`, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  benchmarks.forEach(bench => {
    glob(`${__dirname}/benchmarks/${bench}/*.${langConfig.extension}`).then(files => {
      files.forEach(file => {
        const outputDir = `${__dirname}/../public/results/${bench}`;
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir);
        }
        const outputFileName = `${outputDir}/${OS}-${getBasenameWithoutExtension(file)}-${langConfig.name}.json`;
        if (langConfig.compile) {
          const compileRes = benchmarker.exec(`${langConfig.commands.compile} ${path.basename(file)}`, { cwd: `${__dirname}/benchmarks/${bench}` });
          const compiledData = benchmarker.parseOutput(compileRes);
          const res = benchmarker.exec(`./${getBasenameWithoutExtension(file)}`, { cwd: `${__dirname}/benchmarks/${bench}` });
          const executionData = benchmarker.parseOutput(res);
          appendToFile(outputFileName, formatOutput(executionData, compiledData));
        } else {
          const res = benchmarker.exec(`${langConfig.name} ${path.basename(file)}`, { cwd: `${__dirname}/benchmarks/${bench}` });
          appendToFile(outputFileName, formatOutput(benchmarker.parseOutput(res)));
        }
      });
    }).catch(err => {
      console.error(err);
    });
  });
}

/**
 * 
 * @param {string} filename 
 */
function getBasenameWithoutExtension(filename) {
  return path.basename(filename).replace(`.${langConfig.extension}`, '');
}

/**
 * 
 * @param {string} file 
 * @param {string} appendFile 
 */
function appendToFile(file, appendFile) {
  // const data = fs.readFileSync(file);
  const exists = fs.existsSync(file);
  let data = [];
  if (exists) {
    data = require(file).data;
  }
  data.push(appendFile);
  fs.writeFileSync(file, JSON.stringify({ data }));
}

function getVersionNumber() {
  return extractVersionNumber(execSync(langConfig.commands.version).toString());
}

/**
 * 
 * @param {string} versionOutput 
 */
function extractVersionNumber(versionOutput) {
  const versionRegex = /(?:0|[1-9]\d*)(?:\.(?:0|[1-9]\d*))+/;
  const matched = versionOutput.match(versionRegex);
  return matched ? matched[0] : '';
}

/**
 * 
 * @param {Object} data 
 * @returns {Array}
 */
function dataToArray(data) {
  if (!data) {
    return [];
  }
  return Object.values(data);
}

module.exports = {
  getBasename: getBasenameWithoutExtension,
  extractVersionNumber,
};
