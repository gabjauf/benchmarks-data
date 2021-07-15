#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const languages = require('./languages.json');

const directory = `${__dirname}/docker/nix/`;


function getTemplate(lang) {
  return `
  FROM language-bench-nix/perf
  
  WORKDIR /app
  ENV BENCHMARKED_LANG ${lang.name}
  ENV OS nix
  
  RUN nix-env -iA ${lang.packages.nix}
  COPY ./package.json ./package.json
  RUN npm i --only=production
  
  COPY ./benchmarks-source ./benchmarks-source
  COPY ./languages.json ./languages.json
  COPY ./public ./public
  # VOLUME ./public/results /app/public/results
  
  ENTRYPOINT ["./benchmarks-source/run.js"]
  `.trim();
}

function getFilename(lang) {
  return `Dockerfile.nix.${lang.name}.docker`;
}

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory);
}

Promise.all(languages.map(lang => {
  const template = getTemplate(lang);
  const filename = getFilename(lang);
  return fs.promises.writeFile(directory + filename, template);
}));

