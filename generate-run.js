const fs = require('fs');
const path = require('path');
const languages = require('./languages.json');

const directory = `${__dirname}/docker/runners/`;

function getResultsFileName(lang) {
  return `/app/results/$dir-${lang.name}-$(date +%Y-%m-%d)`;
}

function getCompileTemplate(lang) {
  return `
    perf stat -o ./res ${lang.commands.compile} $file
    cat ./res | /app/run.js >> $filename
    perf stat -o ./res ./$(basename $file .${lang.extension})
    cat ./res | /app/run.js >> $filename
  `;
}

function getRegularTemplate(lang) {
  return `
    perf stat -o ./res $BENCHMARKED_LANG 
    cat ./res | /app/run.js >> $filename
  `;
}


function getTemplate(lang) {
  return `
    #!/bin/sh
    cd ./benchmarks
    for dir in ./*
    do
      dir=\${dir##*/\}
      filename="${getResultsFileName(lang)}"

      touch $filename
      cd $dir
      for file in $(find -type f -name "*.${lang.extension}");
      do
      ${lang.compile ? getCompileTemplate(lang) : getRegularTemplate(lang)}
      done;
      cd ..
    done
  `.trim();
}

function getFilename(lang) {
  return `run.${lang.name}.sh`;
}

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory);
}

Promise.all(languages.map(lang => {
  const template = getTemplate(lang);
  const filename = getFilename(lang);
  return fs.promises.writeFile(directory + filename, template);
}));

