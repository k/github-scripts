#!/usr/local/bin/node

var execa = require('execa')

var Octo = require('octokat')
var gh = new Octo({ token: process.env.GITHUB_TOKEN })


gh.orgs('theadsontop').repos
    .fetch()
    .then(r => r.fetchAll((err, result) => {
        execa('echo', result.map(item => item.sshUrl)).then(console.log)}
        ));
