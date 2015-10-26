var express = require('express');
var request = require('request');
require('dotenv').load()
var app = express();

var workspace = process.env.WORKSPACE;
var token = process.env.TOKEN;

var firstOfMonth = function(date){
  date.setDate(1);
  var currentMonth = (date.getMonth() + 1);
  var since = (date.getFullYear() + '-' + currentMonth + '-01');
  return since;
}

app.locals.moment = require('moment');
app.set('view engine', 'jade');

app.get('/:id', function (req, res) {
  var since = firstOfMonth(new Date());
  var client = req.params.id;
  var detailtedReportUrl = "https://toggl.com/reports/api/v2/details?workspace_id=" + workspace + "&since=" + since + "&client_ids="+ client +"&user_agent=api_test";
  var auth = {
    'auth': {
      'user': token,
      'pass': 'api_token'
    }
  }

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
