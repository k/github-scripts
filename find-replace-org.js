#!/usr/local/bin/node

const Octokat = require("octokat");
const request = require("request-promise-native");
const path = require('path');
const replace = require('replace-in-file');
const rimraf = require('rimraf');
const fs = require('fs');
const { exec } = require('child_process');

var clone = require('git-clone');

const finds = ['FIND'];
const replaces = ['REPLACE'];


const org = 'ORG_NAME'; // Input org here

const token = process.env.GITHUB_TOKEN;

const access_token_qs = `access_token=${token}`;
const octo = new Octokat({ token });
var options = {
  uri: `https://api.github.com/search/code?q=${finds[0]}+org:${org}&${access_token_qs}&per_page=100`,
  headers: {
    'User-Agent': 'request',
  },
};

async function search_repos() {

    const res = await request(options);
    const parsed_response = JSON.parse(res);

    var repo_urls = parsed_response.items
            .map(item => item.repository.html_url)
            .map(https_url => https_url.replace('https://', 'git@').replace('m/', 'm:'));

    repo_urls.forEach(async url => {
        const dir = path.basename(url);

        const repo = clone(url, dir, () => {
            finds.forEach((from, idx) => {
                const options = {
                  files: `${dir}/**`,
                  from: from,
                  to: replaces[idx],
                };
                replace.sync(options);
            });
            exec(`cd ${dir} && git add . && git commit -m "build(secrets): Fix AWS secrets [ci skip]" && git push`, () => {
                rimraf(dir, `${dir} completed`);
            })

        });
    });
}

search_repos()
