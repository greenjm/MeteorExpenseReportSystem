import { Meteor } from 'meteor/meteor';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import { Tabs, Tab } from 'material-ui/Tabs';
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

  removeItem(index) {
    const filteredRequests = [];
    for (let i = this.state.requests.length - 1; i >= 0; i -= 1) {
      if (i !== index) {
        filteredRequests.push(this.state.requests[i]);
      }
    }

    this.setState({
      requests: filteredRequests,
    });
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

  createRequestRow(item, index) {
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
      <TableRow>
        <TableRowColumn style={{ width: '5%', textAlign: 'left', wordWrap: 'break-word' }}>{index}</TableRowColumn>
        <TableRowColumn style={{ width: '8%', textAlign: 'left', wordWrap: 'break-word' }}>{projectName}</TableRowColumn>
        <TableRowColumn style={{ width: '15%', textAlign: 'left', wordWrap: 'break-word' }}>{item.vendor}</TableRowColumn>
        <TableRowColumn style={{ width: '15%', textAlign: 'left', wordWrap: 'break-word' }}>{item.description}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left', wordWrap: 'break-word' }}>{item.partNo}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left', wordWrap: 'break-word' }}>{item.quantity}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left', wordWrap: 'break-word' }}>${item.unitCost.toFixed(2)}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left', wordWrap: 'break-word' }}>${item.estCost.toFixed(2)}</TableRowColumn>
        <TableRowColumn style={{ width: '8%', textAlign: 'left', wordWrap: 'break-word' }}>{item.dateRequired}</TableRowColumn>
        <TableRowColumn style={{ width: '10%', textAlign: 'left', wordWrap: 'break-word' }}>{item.intendedUsage}</TableRowColumn>
        <TableRowColumn style={{ width: '5%' }}>{status}</TableRowColumn>
        <TableRowColumn>
          <RaisedButton
            onTouchTap={() => { this.goTo(`/requestDetail/${item._id}`); }}
            label="View"
            style={{ margin: '3px' }}
            primary
          />
          <RaisedButton
            onTouchTap={() => {
              Meteor.call('requests.delete', item._id);
              this.removeItem(item._id);
            }}
            label="Delete"
            style={{ margin: '3px' }}
            primary
          />
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

    if (status === 'Approved') {
      return (
        <TableRow selectable={false} style={style} key={item._id}>
          <TableRowColumn style={{ width: '10%' }}>{item.dateRequired}</TableRowColumn>
          <TableRowColumn style={{ width: '10%' }}>{projectName}</TableRowColumn>
          <TableRowColumn style={{ width: '35%' }}>{item.intendedUsage}</TableRowColumn>
          <TableRowColumn style={{ width: '10%' }}>${item.estCost.toFixed(2)}</TableRowColumn>
          <TableRowColumn style={{ width: '15%' }}>&nbsp;</TableRowColumn>
          <TableRowColumn style={{ width: '15%' }}>${item.estCost.toFixed(2)}</TableRowColumn>
          <TableRowColumn style={{ width: '8%' }}>{item.project}</TableRowColumn>
          <TableRowColumn>
            <RaisedButton
              onTouchTap={() => { this.goTo(`/requestDetail/${item._id}`); }}
              label="View"
              style={{ margin: '3px' }}
              primary
            />
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
        approvedRequests.push(this.state.requests[x]._id);
      }
    }

    if (approvedRequests.length === 0) {
      return;
    }

    const today = new Date();

    Meteor.call('reports.create', approvedRequests, today.getMonth(), today.getFullYear(),
      (error, result) => {
        if (error != null) {
          console.log(error);
        }
        if (result) {
          this.setState({
            requests: [],
          });
          for (let x = 0; x < approvedRequests.length; x += 1) {
            Meteor.call('requests.submission', approvedRequests[x], (err) => {
              if (err) {
                console.log('Could not mark request as submitted');
              }
            });
          }
        }
      });
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
              <Table selectable={false} style={{ tableLayout: 'auto', wordWrap: 'break-word' }}>
                <TableBody displayRowCheckbox={false}>
                  <TableRow selectable={false} style={{ color: 'rgb(158, 158, 158)' }}>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Item</TableRowColumn>
                    <TableRowColumn style={{ width: '8%', textAlign: 'left', fontSize: '12px' }}>Project Name</TableRowColumn>
                    <TableRowColumn style={{ width: '15%', textAlign: 'left', fontSize: '12px' }}>
                      Vendor Name, Address, Phone Number, & Website
                    </TableRowColumn>
                    <TableRowColumn style={{ width: '15%', textAlign: 'left', fontSize: '12px' }}>Item Description</TableRowColumn>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Part Number</TableRowColumn>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Quantity</TableRowColumn>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Unit Cost</TableRowColumn>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Total Cost</TableRowColumn>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Date Required</TableRowColumn>
                    <TableRowColumn style={{ width: '10%', textAlign: 'left', fontSize: '12px' }}>Intended Program Usage</TableRowColumn>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Status</TableRowColumn>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left' }}>&nbsp;</TableRowColumn>
                  </TableRow>
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
                <TableRow selectable={false} style={{ color: 'rgb(158, 158, 158)' }}>
                  <TableRowColumn style={{ width: '10%', textAlign: 'left', fontSize: '12px' }}>Date</TableRowColumn>
                  <TableRowColumn style={{ width: '35%', textAlign: 'left', fontSize: '12px' }}>Description and Purpose of Expenditure</TableRowColumn>
                  <TableRowColumn style={{ width: '10%', textAlign: 'left', fontSize: '12px' }}>Amount</TableRowColumn>
                  <TableRowColumn style={{ width: '20%', textAlign: 'left', fontSize: '12px' }}>Paid by Scientia</TableRowColumn>
                  <TableRowColumn style={{ width: '20%', textAlign: 'left', fontSize: '12px' }}>Due Employee</TableRowColumn>
                  <TableRowColumn style={{ width: '8%', textAlign: 'left', fontSize: '12px' }}>Project/Charge Number</TableRowColumn>
                </TableRow>
                {this.state.requests.length > 0 ?
                  this.state.requests.map(this.createReportRow) :
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
              label="Submit MER"
              primary
              style={{ float: 'right', margin: '10px' }}
              onTouchTap={this.submitReport}
            />
          </Tab>
        </Tabs>
      </div>
    );
  },
});

module.exports = EmployeeView;
