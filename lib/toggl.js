var request = require('request');
var token = process.env.TOKEN;
var auth = {
  'auth': {
    'user': token,
    'pass': 'api_token'
  }
}
var workspace = process.env.WORKSPACE;

var clients = function(callback){
  request.get("https://www.toggl.com/api/v8/clients", auth, function(err, response, body){
    callback(err, JSON.parse(body));
  });
}

var client = function(id, callback){
  var clientUrl = 'https://www.toggl.com/api/v8/clients/' + id;
  request.get(clientUrl, auth, function(err, response, body){
    callback(err, JSON.parse(body).data);
  });
}

var report = function(client, since, callback){
  var detailtedReportUrl = "https://toggl.com/reports/api/v2/details?workspace_id=" + workspace + "&since=" + since + "&client_ids="+ client +"&user_agent=api_test";
  request.get(detailtedReportUrl, auth, function (err, response, body) {
    callback(err, JSON.parse(body).data)
  });
}

var pdfReport = function(client, since, response){
  var detailtedPdfReportUrl = "https://toggl.com/reports/api/v2/details.pdf?workspace_id=" + workspace + "&since=" + since + "&client_ids="+ client +"&user_agent=api_test";
  request.get(detailtedPdfReportUrl, auth).pipe(response);
}

module.exports = {
  clients: clients,
  client: client,
  report: report,
  pdfReport: pdfReport
}