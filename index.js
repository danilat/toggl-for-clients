var express = require('express');
var request = require('request');
var fs = require('fs');
if(process.env.NODE_ENV != 'production'){
  require('dotenv').load();
}
var app = express();

var workspace = process.env.WORKSPACE;
var token = process.env.TOKEN;

app.locals.moment = require('moment');
app.set('view engine', 'jade');
app.use(express.static('public'));
require('./actions')(app);

var server = app.listen((process.env.PORT || 3000), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
