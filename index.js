var express = require('express');
var request = require('request');
require('dotenv').load()
var app = express();

var workspace = process.env.WORKSPACE;
var token = process.env.TOKEN;

var firstOfCurrentMonth = function(date){
  var date = new Date();
  date.setDate(1);
  var currentMonth = (date.getMonth() + 1);
  var since = (date.getFullYear() + '-' + currentMonth + '-01');
  return since;
}

var since = firstOfCurrentMonth();

var detailtedReportUrl = "https://toggl.com/reports/api/v2/details?workspace_id=" + workspace + "&since=" + since + "&user_agent=api_test";
var auth = {
  'auth': {
    'user': token,
    'pass': 'api_token'
  }
}

app.locals.moment = require('moment');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  request.get(detailtedReportUrl, auth, function (err, response, body) {
    body = JSON.parse(body);
    console.log(body);
    res.render('index', { task_entries: body.data, since: since});
  })
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

//curl -v -u c31953257cdee55f45f5d30a0c736ba1:api_token -X GET "https://toggl.com/reports/api/v2/details?workspace_id=846698&since=2015-01-01&user_agent=api_test"
