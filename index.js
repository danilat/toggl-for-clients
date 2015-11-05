var express = require('express');
var request = require('request');
var fs = require('fs');
if(process.env.NODE_ENV != 'production'){
  require('dotenv').load();
}
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
app.use(express.static('public'));

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
  var clientUrl = 'https://www.toggl.com/api/v8/clients/' + client;
  request.get(clientUrl, auth, function(err, response, body){
    if(response.statusCode == 200){
      var customer = JSON.parse(body).data;
      request.get(detailtedReportUrl, auth, function (err, response, body) {
        body = JSON.parse(body);
        res.render('index', { task_entries: body.data, since: since, client: customer});
      });
    }else{
      res.status(404).send('Not found');
    }
  });
});

app.get('/pdf/:id', function (req, res) {
  var since = firstOfMonth(new Date());
  var client = req.params.id;
  var detailtedPdfReportUrl = "https://toggl.com/reports/api/v2/details.pdf?workspace_id=" + workspace + "&since=" + since + "&client_ids="+ client +"&user_agent=api_test";
  var auth = {
    'auth': {
      'user': token,
      'pass': 'api_token'
    }
  }
  request.get(detailtedPdfReportUrl, auth).pipe(res);
});

var server = app.listen((process.env.PORT || 3000), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
