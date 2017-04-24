import { hashHistory } from 'react-router';
import Toggle from 'material-ui/Toggle';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Header from '../components/header.jsx';

/* global localStorage:true*/
/* eslint no-undef: "error"*/

const React = require('react');

// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const UserDashboard = React.createClass({
  propTypes: {
    breadcrumbs: React.PropTypes.array,
    isAdmin: React.PropTypes.bool,
    name: React.PropTypes.string,
    employeeProjects: React.PropTypes.array,
    managerProjects: React.PropTypes.array,
    myRequests: React.PropTypes.array,
    managerRequests: React.PropTypes.array,
    users: React.PropTypes.array,
    isManager: React.PropTypes.bool,
    isEmployee: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      breadcrumbs: [],
      incompleteRequests: 0,
      requestFilter: null,
      name: '',
      employeeProjects: [],
      managerProjects: [],
      myRequests: [],
      managerRequests: [],
      users: [],
      isManager: false,
      isEmployee: false,
      viewToggle: localStorage.getItem('viewToggle') === 'true' || false,
      currentEmployeeTab: +localStorage.getItem('currentEmployeeTab') || 0,
      requestDialogOpen: false,
      statMsg: '',
      requestToDeny: {},
    };
  },

  componentWillMount() {
    this.setState({
      breadcrumbs: this.props.breadcrumbs,
      name: this.props.name,
      employeeProjects: this.props.employeeProjects,
      managerProjects: this.props.managerProjects,
      myRequests: this.props.myRequests,
      managerRequests: this.props.managerRequests,
      users: this.props.users,
      isManager: this.props.isManager,
      isEmployee: this.props.isEmployee,
      viewToggle: this.state.viewToggle && this.props.isManager,
    });
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user) {
      hashHistory.push('/');
    }

    const nameChange = this.state.name !== nextProps.name;
    const employeeProjectsChange = this.state.employeeProjects !== nextProps.employeeProjects;
    const managerProjectsChange = this.state.managerProjects !== nextProps.managerProjects;
    const myRequestsChange = this.state.myRequests !== nextProps.myRequests;
    const managerRequestsChange = this.state.managerRequests !== nextProps.managerRequests;
    const usersChange = this.state.users !== nextProps.users;
    const isManagerChange = this.state.isManager !== nextProps.isManager;
    const isEmployeeChange = this.state.isEmployee !== nextProps.isEmployee;

    this.setState({
      name: nameChange ? nextProps.name : this.state.name,
      employeeProjects: employeeProjectsChange ?
        nextProps.employeeProjects : this.state.employeeProjects,
      managerProjects: managerProjectsChange ?
        nextProps.managerProjects : this.state.managerProjects,
      myRequests: myRequestsChange ? nextProps.myRequests : this.state.myRequests,
      managerRequests: managerRequestsChange ?
        nextProps.managerRequests : this.state.managerRequests,
      users: usersChange ? nextProps.users : this.state.users,
      isManager: isManagerChange ? nextProps.isManager : this.state.isManager,
      isEmployee: isEmployeeChange ? nextProps.isEmployee : this.state.isEmployee,
      viewToggle: this.state.viewToggle && this.props.isManager,
      breadcrumbs: nextProps.breadcrumbs,
    });
  },

  createBreadcrumb(item) {
    return (
      <li><a href={item.url}>{item.page}</a></li>
    );
  },

  // Helpers
  goTo(url) {
    hashHistory.push(url);
  },

  serveRequest(request, approved, message) {
    Meteor.call('requests.statEdit', request._id, approved, message, (err) => {
      if (err) {
        console.log(err);
      }
    });
    Meteor.call('notifications.respondHelper', approved,
      request._id,
      request.userId,
      // (error) => {
      //   if (error != null) {
      //     this.setState({ dialogError: `Error: ${error.error}. ${error.reason}` });
      //     return;
      //   }
      //   return;
      // }
    );
  },

  handleConfirmPress(req) {
    this.serveRequest(req, true, '');
  },

  handleDenyPress(request) {
    this.setState({
      requestDialogOpen: true,
      requestToDeny: request });
  },

  denyRequest() {
    this.serveRequest(this.state.requestToDeny, false, this.state.statMsg);
    this.setState({
      requestToDeny: {},
      statMsg: '',
      requestDialogOpen: false,
    });
  },

  handleCancelPress() {
    this.setState({
      requestToDeny: {},
      requestDialogOpen: false,
      statMsg: '',
    });
  },

  denialChange(e) {
    this.setState({ statMsg: e.target.value });
  },

  updateEmployeeTab(tab) {
    this.setState({ currentEmployeeTab: +tab.props.index });
    localStorage.setItem('currentEmployeeTab', +tab.props.index);
  },

  removeItem(index) {
    const filteredRequests = [];
    for (let i = this.state.myRequests.length - 1; i >= 0; i -= 1) {
      if (i !== index) {
        filteredRequests.push(this.state.myRequests[i]);
      }
    }

    this.setState({
      myRequests: filteredRequests,
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
    Meteor.call('projects.name', item.projectId, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        this.projectName = results;
      }
    });

    let status = '';
    if (item.status === undefined || item.status === null) {
      status = 'Pending';
    } else if (item.status) {
      status = 'Approved';
    } else {
      status = 'Denied';
    }

    return (
      <TableRow>
        <TableRowColumn style={{ width: '5%', textAlign: 'left', wordWrap: 'break-word' }}>{index}</TableRowColumn>
        <TableRowColumn style={{ width: '8%', textAlign: 'left', wordWrap: 'break-word' }}>{this.projectName}</TableRowColumn>
        <TableRowColumn style={{ width: '15%', textAlign: 'left', wordWrap: 'break-word' }}>{item.vendor}</TableRowColumn>
        <TableRowColumn style={{ width: '15%', textAlign: 'left', wordWrap: 'break-word' }}>{item.description}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left', wordWrap: 'break-word' }}>{item.partNo}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left', wordWrap: 'break-word' }}>{item.quantity}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left', wordWrap: 'break-word' }}>{item.unitCost}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left', wordWrap: 'break-word' }}>{item.estCost}</TableRowColumn>
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
    for (let i = 0; i < this.state.employeeProjects.length; i += 1) {
      const p = this.state.employeeProjects[i];
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
          <TableRowColumn style={{ width: '10%' }}>{item.estCost}</TableRowColumn>
          <TableRowColumn style={{ width: '15%' }}>&nbsp;</TableRowColumn>
          <TableRowColumn style={{ width: '15%' }}>{item.estCost}</TableRowColumn>
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
    const notApprovedRequests = [];
    for (let x = 0; x < this.state.myRequests.length; x += 1) {
      if (this.state.myRequests[x].status) {
        if (this.state.myRequests[x].receipt) {
          approvedRequests.push(this.state.myRequests[x]._id);
        }
        else {
          notApprovedRequests.push(this.state.myRequests[x]);
        }
      }
    }

    if (approvedRequests.length === 0) {
      if (notApprovedRequests.length > 0) {
        this.setState({ incompleteRequests: notApprovedRequests.length });
      }
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
            myRequests: notApprovedRequests,
            incompleteRequests: notApprovedRequests.length,
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

  createManagerRequestRow(item, index) {
    if (this.state.requestFilter === null || item.projectId === this.state.requestFilter) {
      let projectName = '';
      for (let i = 0; i < this.state.managerProjects.length; i += 1) {
        const p = this.state.managerProjects[i];
        if (p._id === item.projectId) {
          projectName = p.name;
          break;
        }
      }

      return (
        <TableRow key={index} selectable={false}>
          <TableRowColumn style={{ width: '8%', textAlign: 'left' }}>{projectName}</TableRowColumn>
          <TableRowColumn style={{ width: '15%', textAlign: 'left' }}>{item.vendor}</TableRowColumn>
          <TableRowColumn style={{ width: '15%', textAlign: 'left' }}>{item.description}</TableRowColumn>
          <TableRowColumn style={{ width: '3%', textAlign: 'left' }}>{item.quantity}</TableRowColumn>
          <TableRowColumn style={{ width: '3%', textAlign: 'left' }}>{item.estCost}</TableRowColumn>
          <TableRowColumn style={{ width: '8%', textAlign: 'left' }}>{item.dateRequired}</TableRowColumn>
          <TableRowColumn style={{ width: '10%', textAlign: 'left' }}>{item.intendedUsage}</TableRowColumn>
          <TableRowColumn>
            <RaisedButton
              label="Approve"
              primary
              onTouchTap={() => { this.handleConfirmPress(item); }}
              style={{ margin: '3px' }}
            />
            <RaisedButton
              label="Deny"
              primary
              onTouchTap={() => { this.handleDenyPress(item); }}
              style={{ margin: '3px' }}
            />
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
  },

  createRequestFilterItem(item) {
    return (
      <MenuItem value={item._id} primaryText={item.name} />
    );
  },

  handleRequestFilterChange(event, index, value) {
    this.setState({ requestFilter: value });
  },

  render() {
    let tab = this.state.currentEmployeeTab;
    if (tab === 3 && !this.state.isManager) {
      tab = 0;
    }
    const requestDialogActions = [
      <FlatButton
        label="Confirm"
        primary
        onTouchTap={this.denyRequest}
      />,
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleCancelPress}
      />,
    ];
    return (
      <div>
        <Header isAdmin={this.props.isAdmin} />
        <Paper style={paperStyle} zDepth={1}>
          <ul className="breadcrumb">
            {this.state.breadcrumbs.map(this.createBreadcrumb)}
          </ul>
        </Paper>
        <br />
        <div>
          <Tabs value={tab}>
            <Tab value={0} index={0} label="Projects" onActive={this.updateEmployeeTab} >
              <Table selectable={false}>
                <TableHeader displaySelectAll={false}>
                  <TableRow selectable={false}>
                    <TableHeaderColumn>Project Name</TableHeaderColumn>
                    <TableHeaderColumn>Actions</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {this.state.employeeProjects.length > 0 ?
                    this.state.employeeProjects.map(this.createProjectRow) :
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
            <Tab value={1} index={1} label="My MPAs" onActive={this.updateEmployeeTab} >
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
                    {this.state.myRequests.length > 0 ?
                      this.state.myRequests.map(this.createRequestRow) :
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
              value={2}
              index={2}
              label="My MER"
              onActive={this.updateEmployeeTab}
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
                  {this.state.myRequests.length > 0 ?
                    this.state.myRequests.map(this.createReportRow) :
                    (
                    <TableRow selectable={false}>
                      <TableRowColumn>You have not submitted any requests yet.</TableRowColumn>
                      <TableRowColumn />
                    </TableRow>
                    )
                  }
                </TableBody>
              </Table>
              {this.state.incompleteRequests !== 0 && (
                <div
                  style={{ float: 'left', color: '#f44336', margin: '10px' }}
                >
                  There {this.state.incompleteRequests === 1 ? 'is' : 'are'} {this.state.incompleteRequests} approved
                  MPA{this.state.incompleteRequests === 1 ? '' : 's'} missing a receipt.
                  {this.state.incompleteRequests === 1 ? 'It was ' : 'They were '} not submitted.
                </div>
              )}
              <RaisedButton
                label="Submit MER"
                primary
                style={{ float: 'right', margin: '10px' }}
                onTouchTap={this.submitReport}
              />
            </Tab>
            {this.state.isManager &&
            <Tab
              value={3}
              index={3}
              label="Manage MPAs"
              onActive={this.updateEmployeeTab}
            >
              <Table selectable={false}>
                <TableHeader displaySelectAll={false}>
                  <TableRow selectable={false}>
                    <TableHeaderColumn>
                      <SelectField
                        floatingLabelText="Filter by Project"
                        value={this.state.requestFilter}
                        style={{ verticalAlign: 'bottom' }}
                        onChange={this.handleRequestFilterChange}
                      >
                        {this.state.managerProjects.map(this.createRequestFilterItem)}
                      </SelectField>
                      <FlatButton
                        label="Clear Filter"
                        primary
                        onTouchTap={() => { this.setState({ requestFilter: null }) }}
                      />
                    </TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  <TableRow selectable={false} style={{ color: 'rgb(158, 158, 158)' }}>
                    <TableRowColumn style={{ width: '8%', textAlign: 'left', fontSize: '12px' }}>Project Name</TableRowColumn>
                    <TableRowColumn style={{ width: '15%', textAlign: 'left', fontSize: '12px' }}>
                      Vendor Name, Address, Phone Number, & Website
                    </TableRowColumn>
                    <TableRowColumn style={{ width: '15%', textAlign: 'left', fontSize: '12px' }}>Item Description</TableRowColumn>
                    <TableRowColumn style={{ width: '3%', textAlign: 'left', fontSize: '12px' }}>Quantity</TableRowColumn>
                    <TableRowColumn style={{ width: '3%', textAlign: 'left', fontSize: '12px' }}>Total Cost</TableRowColumn>
                    <TableRowColumn style={{ width: '8%', textAlign: 'left', fontSize: '12px' }}>Date Required</TableRowColumn>
                    <TableRowColumn style={{ width: '10%', textAlign: 'left', fontSize: '12px' }}>Intended Program Usage</TableRowColumn>
                  </TableRow>
                  {this.state.managerRequests.length > 0 ?
                    this.state.managerRequests.map(this.createManagerRequestRow) :
                    (
                    <TableRow selectable={false}>
                      <TableRowColumn>No requests require your attention.</TableRowColumn>
                      <TableRowColumn />
                    </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </Tab>
            }
          </Tabs>
        </div>
        <div>
          <Dialog
            title="Respond to request"
            actions={requestDialogActions}
            modal={false}
            open={this.state.requestDialogOpen}
          >
            <TextField
              name="denialText"
              hintText="Reasons for denial"
              floatingLabelText="Denial Message"
              onChange={this.denialChange}
              fullWidth
            />
          </Dialog>
        </div>
      </div>
    );
  },
});

module.exports = UserDashboard;
