/*
- Tasks Box
  - Month Selector
  - PDF Download
  - TaskList
*/
var request = window.superagent;
var parts = window.location.href.split('/');
var id = parts[parts.length-1]

var CustomerInfo = React.createClass({
  render: function(){
    return <p className="lead">Tasks working for {this.props.client.name} since {this.props.since}</p>
  }
});

var TasksList = React.createClass({
  render: function() {
    var createTask = function(task, index) {
      return <tr>
        <td><strong>{moment(task.start).format('DD/MM/YYYY')}</strong></td>
        <td>{task.description}</td>
        <td className="label label-default">{task.dur/(3600*1000)}</td>
        <td>{task.project}</td>
      </tr>;
    };
    return <table className="table table-condensed">
      <thead>
        <tr><th>Date</th><th>Task</th><th>Time</th><th>Project</th></tr>
      </thead>
      <tbody>
        {this.props.tasks.map(createTask)}
      </tbody>
    </table>;
  }
});

var TasksBox = React.createClass({
  getInitialState: function() {
    return {
      tasks: [],
      since: '',
      downloadPdfUrl: '/pdf/' + id,
      client: {name: ''},
    };
  },
  componentDidMount: function(){
    request.get('/api/'+ id)
      .end(function(err, result) {
      console.log(result.body)
      if (this.isMounted()) {
        this.setState({
          tasks: result.body.tasks,
          client: result.body.client,
          since: result.body.since
        });
      }
    }.bind(this));
  },
  render: function() {
    return <div className="page-header">
        <h1>Toggl detailed report</h1>
        <CustomerInfo client={this.state.client} since={this.state.since}/>
        <div className="container" id="main">
          <p>
            <a className="btn btn-success" href={this.state.downloadPdfUrl}>Download PDF Report</a>
          </p>
          <TasksList tasks={this.state.tasks}/>
        </div>
      </div>;
  }
});

ReactDOM.render(
  <TasksBox/>,
  document.getElementById('app')
);