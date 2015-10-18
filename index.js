var express = require('express');
var request = require('request');
var app = express();

var workspace = 846698;
var since = '2015-01-01';

var detailtedReportUrl = "https://toggl.com/reports/api/v2/details?workspace_id=" + workspace + "&since=" + since + "&user_agent=api_test";
var auth = {
  'auth': {
    'user': 'c31953257cdee55f45f5d30a0c736ba1',
    'pass': 'api_token'
  }
}

app.get('/', function (req, res) {
  request.get(detailtedReportUrl, auth, function (err, response, body) {
    console.log(body);
    res.send('Hello World!');
  })
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

//curl -v -u c31953257cdee55f45f5d30a0c736ba1:api_token -X GET "https://toggl.com/reports/api/v2/details?workspace_id=846698&since=2015-01-01&user_agent=api_test"
