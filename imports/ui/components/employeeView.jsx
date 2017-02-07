import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import { Tabs, Tab } from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Search from 'material-ui/svg-icons/action/search';
import RaisedButton from 'material-ui/RaisedButton';
import { hashHistory } from 'react-router';

const React = require('react');

const EmployeeView = React.createClass({
  propTypes: {
    projects: React.PropTypes.array,
    requests: React.PropTypes.array,
    currentTab: React.PropTypes.number,
    updateTab: React.PropTypes.any,
  },

  getInitialState() {
    return {
      projects: this.props.projects,
      requests: this.props.requests,
    };
  },

  componentWillReceiveProps(nextProps) {
    const projectsChange = this.state.projects !== nextProps.projects;
    const requestsChange = this.state.requests !== nextProps.requests;

    this.setState({
      projects: projectsChange ? nextProps.projects : this.state.projects,
      requests: requestsChange ? nextProps.requests : this.state.requests,
    });
  },

  goTo(url) {
    hashHistory.push(url);
  },

  createProjectRow(item) {
    return (
      <TableRow selectable={false}>
        <TableRowColumn>{item.name}</TableRowColumn>
        <TableRowColumn>
          <RaisedButton
            onTouchTap={() => { this.goTo(`/project/view/${item._id}`); }}
            label="View Project Details"
            style={{ margin: '3px' }}
            primary
          />
          <RaisedButton
            onTouchTap={() => { this.goTo(`/submitRequest/${item._id}`); }}
            label="Submit New MPA"
            style={{ margin: '3px' }}
            primary
          />
        </TableRowColumn>
      </TableRow>
    );
  },

  createRequestRow(item) {
    let projectName = '';
    for (let i = 0; i < this.state.projects.length; i += 1) {
      const p = this.state.projects[i];
      if (p._id === item.projectId) {
        projectName = p.name;
        break;
      }
    }

    let status = '';
    if (item.status === undefined) {
      status = 'Pending';
    } else if (item.status) {
      status = 'Approved';
    } else {
      status = 'Denied';
    }

    return (
      <TableRow selectable={false}>
        <TableRowColumn>{projectName}</TableRowColumn>
        <TableRowColumn>{status}</TableRowColumn>
        <TableRowColumn>{item.statMsg}</TableRowColumn>
        <TableRowColumn>{item.estCost}</TableRowColumn>
        <TableRowColumn>
          <RaisedButton style={{ margin: '3px' }} onTouchTap={() => { this.goTo(`/requestDetail/${item._id}`); }}>
            <Search />
          </RaisedButton>
        </TableRowColumn>
      </TableRow>
    );
  },

  createReportRow(item) {
    let projectName = '';
    for (let i = 0; i < this.state.projects.length; i += 1) {
      const p = this.state.projects[i];
      if (p._id === item.projectId) {
        projectName = p.name;
        break;
      }
    }

    let status = '';
    const style = {};
    if (item.status === undefined) {
      status = 'Pending';
      style.backgroundColor = '#fff;';
    } else if (item.status) {
      status = 'Approved';
      style.backgroundColor = '#a8ffa0;';
    } else {
      status = 'Denied';
    }

    if (status !== 'Denied') {
      return (
        <TableRow selectable={false} style={style}>
          <TableRowColumn>{projectName}</TableRowColumn>
          <TableRowColumn>{status}</TableRowColumn>
          <TableRowColumn>{item.statMsg}</TableRowColumn>
          <TableRowColumn>{item.estCost}</TableRowColumn>
          <TableRowColumn>
            <RaisedButton style={{ margin: '3px' }} onTouchTap={() => { this.goTo(`/requestDetail/${item._id}`); }}>
              <Search />
            </RaisedButton>
          </TableRowColumn>
        </TableRow>
      );
    }
    return '';
  },

  submitReport() {
    const approvedRequests = [];
    for (let x = 0; x < this.state.requests.length; x += 1) {
      if (this.state.requests[x].status) {
        approvedRequests.push(this.state.requests[x]);
      }
    }

    // there is no user passed in on this one. Meteor.getUser() I guess
    const reportItem = {
      requests: approvedRequests,
      month: new Date().getMonth(),
      year: new Date().getYear(),
    };

    // send reportItem. Modify if necessary.
    console.log(reportItem);
  },

  render() {
    return (
      <div>
        <Tabs initialSelectedIndex={this.props.currentTab}>
          <Tab index={0} label="Projects" onActive={this.props.updateTab} >
            <Table selectable={false}>
              <TableHeader displaySelectAll={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn>Project Name</TableHeaderColumn>
                  <TableHeaderColumn>Actions</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.projects.length > 0 ?
                  this.state.projects.map(this.createProjectRow) :
                  (
                  <TableRow selectable={false}>
                    <TableRowColumn>You do not belong to any projects.</TableRowColumn>
                    <TableRowColumn />
                  </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </Tab>
          <Tab index={1} label="Material Purchase Approvals" onActive={this.props.updateTab} >
            <div>
              <Table selectable={false}>
                <TableHeader displaySelectAll={false}>
                  <TableRow selectable={false}>
                    <TableHeaderColumn>Project Name</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                    <TableHeaderColumn>Status Message</TableHeaderColumn>
                    <TableHeaderColumn>Cost</TableHeaderColumn>
                    <TableHeaderColumn>Actions</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {this.state.requests.length > 0 ?
                    this.state.requests.map(this.createRequestRow) :
                    (
                    <TableRow selectable={false}>
                      <TableRowColumn>You have not submitted any requests yet.</TableRowColumn>
                      <TableRowColumn />
                    </TableRow>
                    )
                  }
                </TableBody>
              </Table>
              <RaisedButton
                primary
                label="Submit New MPA"
                style={{ float: 'right', margin: '10px' }}
                onTouchTap={() => { this.goTo('/submitRequest'); }}
              />
            </div>
          </Tab>
          <Tab
            index={2}
            label="Monthly Expense Report"
            onActive={this.props.updateTab}
          >
            <Table selectable={false}>
              <TableBody displayRowCheckbox={false}>
                {this.state.requests.length > 0 ?
                  this.state.requests.map(this.createReportRow) :
                  (
                  <TableRow selectable={false}>
                    <TableRowColumn>You have not submitted any requests yet.</TableRowColumn>
                    <TableRowColumn />
                  </TableRow>
                  )
                }
                <FlatButton
                  label="Submit Monthly Report"
                  primary
                  onTouchTap={this.submitReport}
                  disabled={this.state.requests > 0}
                />
              </TableBody>
            </Table>
          </Tab>
        </Tabs>
      </div>
    );
  },
});

module.exports = EmployeeView;
