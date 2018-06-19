#!/usr/local/bin/node

const Octokat = require("octokat");
const request = require("request-promise-native");
const path = require('path');
const replace = require('replace-in-file');
const rimraf = require('rimraf');
const fs = require('fs');
const { exec } = require('child_process');
const { uniq } = require('ramda');

var clone = require('git-clone');

const filePath = '**';
const github_search = 'GITHUB_SEARCH';
const finds = [/displayVersion.*/i];
const replaces = ['displayVersion = 0.10.0'];

const org = 'TheAdsOnTop'; // Input org here

const token = process.env.GITHUB_TOKEN;

const access_token_qs = `access_token=${token}`;
const octo = new Octokat({ token });
var options = {
  uri: `https://api.github.com/search/code?q=${github_search}+org:${org}&${access_token_qs}&per_page=100`,
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
    repo_urls = uniq(repo_urls);

    repo_urls.forEach(async url => {
        const dir = path.basename(url);

        const repo = clone(url, dir, () => {
            finds.forEach((from, idx) => {
                const options = {
                  files: `${dir}/${filePath}`,
                  from,
                  to: replaces[idx],
                };
                replace.sync(options);
            });
            exec(`cd ${dir} && git checkout -B fix/find-replace && git add . && git commit -m "fix: Find and replace" && git push`, () => {
                rimraf(dir, () => { console.log(`${dir} completed`) });
            })

        });
    });
}

search_repos()
