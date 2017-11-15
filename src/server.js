var haar = require('./haar.js')
var express = require("express");

var app = express();

app.get('/', function(request, response) {
  haar.haarHandle(request, response);
  console.log("Web page rendered.");
});

app.listen(8888);