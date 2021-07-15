#!/usr/bin/env node

import yaml from 'js-yaml';
import fs from 'fs';
import got from 'got';

const languages = await got('https://raw.githubusercontent.com/gabjauf/benchmarks/master/languages.json').json();

const githubWorkflowFilePath = '.github/workflows/blank.yml'

const doc = yaml.load(fs.readFileSync(githubWorkflowFilePath, 'utf8'));

doc.jobs = formatJobs();

function formatJobs() {
  let res = doc.jobs;
  languages.forEach(langConfig => {
    res[langConfig.name] = {
      "runs-on": "ubuntu-latest",
      needs: ['pre-run'],
      steps: [
        {
          uses: "actions/checkout@v2"
        },
        {
          uses: "actions/download-artifact@v2",
          with: {
            name: "results",
            path: "public/results/"
          },
        },
        {
          name: "Build docker images",
          run: `./build-docker.sh ${langConfig.name}`,
        },
        {
          name: "Run one container",
          run: `./run-container.sh ${langConfig.name}`,
        },
        {
          uses: "actions/upload-artifact@v2",
          with: {
            name: 'results',
            path: `public/results/**/*${langConfig.name}.json`
          }
        }
      ],
    };
  });
  res['compute'] = {
    "runs-on": "ubuntu-latest",
    needs: languages.map(el => el.name),
    steps: [
      {
        uses: "actions/checkout@v2",
      },
      {
        uses: "actions/download-artifact@v2",
        with: {
          name: 'results',
          path: 'public/results/'
        }
      },
      {
        name: "Deendency install",
        run: "npm i"
      },
      {
        name: "Compute Stats",
        run: "node ./benchmarks-source/compute-stats.js"
      },
      {
        uses: "actions/upload-artifact@v2",
        with: {
          name: 'results',
          path: `public/results/`
        }
      }
    ],
  };
  res['commit_results'] = {
    "runs-on": "ubuntu-latest",
    "needs": ["compute"],
    steps: [
      {
        uses: "actions/checkout@v2",
        with: {
          ref: 'data'
        }
      },
      {
        uses: "actions/download-artifact@v2",
        with: {
          name: 'results',
          path: 'public/results/'
        }
      },
      {
        name: "Configurate git",
        run: `git config --global user.name 'Benchmark bot'
          git config --global user.email 'your-username@users.noreply.github.com'
          git config pull.rebase false
        `
      },
      {
        name: "Commit results",
        run: `git add ./public/results
          git commit -m "Benchmark result update"
          while ! git push; do git pull; done
        `
      },
    ]
  }
  return res;
}

const serializedYaml = yaml.dump(doc);

fs.writeFileSync(githubWorkflowFilePath, serializedYaml);


