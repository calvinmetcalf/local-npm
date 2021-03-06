#!/usr/bin/env node

'use strict';

var express = require('express');
var corser  = require('corser');
var favicon = require('serve-favicon');
var argv    = require('optimist').argv;
var port    = argv.P || argv['pouch-port'] || 16984;
var logger  = argv.l || argv.log || 'dev';
var app     = express();

app.use(favicon(__dirname + '/favicon.ico'));
app.use(corser.create({
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  supportsCredentials: true,
  requestHeaders: corser.simpleRequestHeaders.concat(["Authorization", "Origin", "Referer"])
}));

if (logger !== 'off') {
  app.use(require('morgan')(logger));
}

var expressPouchDB = require('express-pouchdb');
var PouchDB = require('pouchdb');
app.use(expressPouchDB(PouchDB));
app.listen(port, function () {
  console.log('\nPouchDB Server listening on port ' + port + '.');
  console.log('Navigate to http://localhost:' + port + '/_utils for the Fauxton UI.');
}).on('error', function (e) {
  if (e.code === 'EADDRINUSE') {
    console.error('\nError: Port ' + port + ' is already in use.');
    console.error('Try another one, e.g. pouchdb-server -p ' +
      (parseInt(port) + 1) + '\n');
  } else {
    console.error('Uncaught error: ' + e);
    console.error(e.stack);
  }
});

exports.app = app;
exports.PouchDB = PouchDB;
