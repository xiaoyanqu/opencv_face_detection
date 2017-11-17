const express = require("express");
const fbHanle = require('./fbHandle.js')

var app = express();

app.get('/perf/haar', function(req, res) {
  fbHanle.runPerf('haar', req, res);
});

app.get('/perf/lbp', function(req, res) {
  fbHanle.runPerf('lbp', req, res);
});

app.get('/show/haar', function(req, res) {
  fbHanle.showExample('haar', req, res);
});

app.get('/show/lbp', function(req, res) {
  fbHanle.showExample('lbp', req, res);
});

app.listen(8888);