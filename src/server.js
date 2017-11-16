const express = require("express");
const fbHanle = require('./fbHandle.js')
const models = require('./models.js');

models.initModels();

var app = express();

app.get('/haar', function(req, res) {
  fbHanle.handle('haar', req, res);
});

app.get('/lbp', function(req, res) {
  fbHanle.handle('lbp', req, res);
});

app.get('/cool', function(req, res) {
  fbHanle.handle('cool', req, res);
});

app.listen(8888);