var workspace = process.env.WORKSPACE;
var token = process.env.TOKEN;
var auth = require('./lib/auth');
var request = require('request');
var toggl = require('./lib/toggl');

var firstOfMonth = function(date){
  date.setDate(1);
  var currentMonth = (date.getMonth() + 1);
  var since = (date.getFullYear() + '-' + currentMonth + '-01');
  return since;
}

var actions = function(app){
  app.get('/:id', auth, function (req, res) {
    var since = firstOfMonth(new Date());
    toggl.client(req.params.id, function(err, client){
      if(!err){
        toggl.report(req.params.id, since, function (err, tasks) {
          res.render('index', { task_entries: tasks, since: since, client: client});
        });
      }else{
        res.status(404).send('Not found');
      }
    });
  });
  app.get('/pdf/:id', function (req, res) {
    var since = firstOfMonth(new Date());
    toggl.pdfReport(req.params.id, since, res);
  });
}

module.exports = actions;