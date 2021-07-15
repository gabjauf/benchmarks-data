#!/usr/bin/env node
const glob = require('tiny-glob');
const fs = require('fs');

const statsPath = `${__dirname}/../public/results/stats.json`;
const exclude = ['public/results/stats.json'];

if (require.main === module) {

  const res = {};
  glob(`${__dirname}/../public/results/**/*.json`).then(files => {
    files.forEach(file => {
      if (exclude.includes(file)) {
        return;
      }
      const content = require(`${__dirname}/../${file}`);
      const benchmark = file.split('/')[2];
      const lastRow = content.data[content.data.length - 1];
      res[benchmark] = [...(res[benchmark] || []), lastRow];
    });
    console.log(res);
    fs.writeFileSync(statsPath, JSON.stringify(res));
  });
}
