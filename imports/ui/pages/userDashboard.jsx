import { Meteor } from 'meteor/meteor';
import { hashHistory } from 'react-router';
import { Table, TableHeader, TableHeaderColumn, TableRow }
  from 'material-ui/Table';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
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
const dateFormat = require('dateformat');

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
    projectNames: React.PropTypes.array,
    isManager: React.PropTypes.bool,
    isEmployee: React.PropTypes.bool,
    merDates: React.PropTypes.bool,
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
      projectNames: [],
      isManager: false,
      isEmployee: false,
      viewToggle: localStorage.getItem('viewToggle') === 'true' || false,
      currentEmployeeTab: +localStorage.getItem('currentEmployeeTab') || 0,
      requestDialogOpen: false,
      statMsg: '',
      requestToDeny: {},
      merDates: false,
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
      projectNames: this.props.projectNames,
      isManager: this.props.isManager,
      isEmployee: this.props.isEmployee,
      viewToggle: this.state.viewToggle && this.props.isManager,
      merDates: this.props.merDates,
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
    const projectNamesChange = this.state.projectNames !== nextProps.projectNames;
    const isManagerChange = this.state.isManager !== nextProps.isManager;
    const isEmployeeChange = this.state.isEmployee !== nextProps.isEmployee;
    const merDatesChange = this.state.merDates !== nextProps.merDates;

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
      projectNames: projectNamesChange ? nextProps.projectNames : this.state.projectNames,
      isManager: isManagerChange ? nextProps.isManager : this.state.isManager,
      isEmployee: isEmployeeChange ? nextProps.isEmployee : this.state.isEmployee,
      viewToggle: this.state.viewToggle && this.props.isManager,
      breadcrumbs: nextProps.breadcrumbs,
      merDates: merDatesChange ? nextProps.merDates : this.state.merDates,
    });
  },

  // Helpers
  getUserName(userId) {
    for (let i = 0; i < this.state.users.length; i += 1) {
      if (this.state.users[i]._id === userId) {
        return this.state.users[i].profile.name;
      }
    }
    return '';
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

  createProjectCard(item) {
    return (
      <Col xs={12} sm={12} md={6} lg={6} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Card>
          <CardHeader
            title={item.name}
            subtitle={`Project started ${dateFormat(item.bornOn, 'mmmm d, yyyy')}`}
          />
          <CardActions>
            <RaisedButton
              label="View Project Details"
              onTouchTap={() => { this.goTo(`/project/view/${item._id}`); }}
              primary
            />
            <RaisedButton
              label="Submit New MPA"
              onTouchTap={() => { this.goTo(`/submitRequest/${item._id}`); }}
              primary
            />
          </CardActions>
        </Card>
      </Col>
    );
  },

  createRequestCard(item) {
    let projectName = '';
    for (let i = 0; i < this.state.projectNames.length; i += 1) {
      const nextProject = this.state.projectNames[i];
      if (nextProject._id === item.projectId) {
        projectName = nextProject.name;
      }
    }

    let status = '';
    if (item.status === undefined || item.status === null) {
      status = 'Pending';
    } else if (item.status) {
      status = 'Approved';
    } else {
      status = 'Denied';
    }

    return (
      <Col xs={12} sm={12} md={6} lg={4} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Card>
          <CardHeader
            title={projectName}
            subtitle={`Submitted on ${dateFormat(item.bornOn, 'mmmm d, yyyy')}`}
            actAsExpander
            showExpandableButton
          />
          <CardText>
            <strong>Current Status: </strong>{status}
          </CardText>
          <CardActions>
            <RaisedButton
              label="View"
              onTouchTap={() => { this.goTo(`/requestDetail/${item._id}`); }}
              primary
            />
            <RaisedButton
              label="Delete"
              onTouchTap={() => {
                Meteor.call('requests.delete', item._id);
                this.removeItem(item._id);
              }}
              primary
            />
          </CardActions>
          <CardText expandable>
            <strong>Vendor: </strong>{item.vendor}<br />
            <strong>Description: </strong>{item.description}<br />
            <strong>Part Number: </strong>{item.partNo}<br />
            <strong>Quantity: </strong>{item.quantity}<br />
            <strong>Unit Cost: </strong>{item.unitCost}<br />
            <strong>Estimated Cost: </strong>{item.estCost}<br />
            <strong>Date Required: </strong>{dateFormat(item.dateRequired, 'mmmm d, yyyy')}<br />
            <strong>Intended Usage: </strong>{item.intendedUsage}<br />
          </CardText>
        </Card>
      </Col>
    );
  },

  createReportCard(item) {
    if (item.status) {
      let projectName = '';
      for (let i = 0; i < this.state.employeeProjects.length; i += 1) {
        const p = this.state.employeeProjects[i];
        if (p._id === item.projectId) {
          projectName = p.name;
          break;
        }
      }

      const style = {};
      if (item.receipt) {
        style.backgroundColor = '#a8ffa0';
      }

      return (
        <Col xs={12} sm={12} md={6} lg={4} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
          <Card style={style}>
            <CardHeader
              title={projectName}
              subtitle={`Submitted on ${dateFormat(item.bornOn, 'mmmm d, yyyy')}`}
              actAsExpander
              showExpandableButton
            />
            <CardActions>
              <RaisedButton
                label="View"
                onTouchTap={() => { this.goTo(`/requestDetail/${item._id}`); }}
                primary
              />
            </CardActions>
            <CardText expandable>
              <strong>Date Required: </strong>{dateFormat(item.dateRequired, 'mmmm d, yyyy')}<br />
              <strong>Vendor: </strong>{item.vendor}<br />
              <strong>Description: </strong>{item.description}<br />
              <strong>Intended Usage: </strong>{item.intendedUsage}<br />
              <strong>Estimated Cost: </strong>{item.estCost}<br />
            </CardText>
          </Card>
        </Col>
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
        } else {
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

  createBreadcrumb(item) {
    return (
      <li><a href={item.url}>{item.page}</a></li>
    );
  },

  goTo(url) {
    hashHistory.push(url);
  },

  createManagerRequestCard(item) {
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
        <Col xs={12} sm={12} md={6} lg={4} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
          <Card>
            <CardHeader
              title={projectName}
              subtitle={`Submitted by ${this.getUserName(item.userId)} on ${dateFormat(item.bornOn, 'mmmm d, yyyy')}`}
              actAsExpander
              showExpandableButton
            />
            <CardActions>
              <RaisedButton
                label="Approve"
                onTouchTap={() => { this.handleConfirmPress(item); }}
                primary
              />
              <RaisedButton
                label="Deny"
                onTouchTap={() => { this.handleDenyPress(item); }}
                primary
              />
              <RaisedButton
                label="View"
                onTouchTap={() => { this.goTo(`/requestDetail/${item._id}`); }}
                primary
              />
            </CardActions>
            <CardText expandable>
              <strong>Vendor: </strong>{item.vendor}<br />
              <strong>Description: </strong>{item.description}<br />
              <strong>Quantity: </strong>{item.quantity}<br />
              <strong>Estimated Cost: </strong>{item.estCost}<br />
              <strong>Date Required: </strong>{dateFormat(item.dateRequired, 'mmmm d, yyyy')}<br />
              <strong>Intended Usage: </strong>{item.intendedUsage}<br />
            </CardText>
          </Card>
        </Col>
      );
    }
    return null;
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
              <Grid style={{ width: '95%' }}>
                <Row>
                  {this.state.employeeProjects.length > 0 ?
                    this.state.employeeProjects.map(this.createProjectCard) :
                    (
                    <Col lg={12} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                      <Card>
                        <CardHeader
                          title="You do not currently belong to any projects"
                        />
                      </Card>
                    </Col>
                    )
                  }
                </Row>
              </Grid>
            </Tab>
            <Tab value={1} index={1} label="My MPAs" onActive={this.updateEmployeeTab} >
              <div style={{ width: '95%', margin: '0 auto' }}>
                <div>
                  <RaisedButton
                    primary
                    label="Submit New MPA"
                    style={{ float: 'right', marginTop: '10px' }}
                    onTouchTap={() => { this.goTo('/submitRequest'); }}
                  />
                </div>
                <div style={{ clear: 'both', position: 'relative' }} />
                <div>
                  <Grid style={{ width: '100%' }}>
                    <Row>
                      {this.state.myRequests.length > 0 ?
                        this.state.myRequests.map(this.createRequestCard) :
                        (
                        <Col lg={12} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                          <Card>
                            <CardHeader
                              title="You have no outstanding MPAs"
                            />
                          </Card>
                        </Col>
                        )
                      }
                    </Row>
                  </Grid>
                </div>
              </div>
            </Tab>
            <Tab
              value={2}
              index={2}
              label="My MER"
              onActive={this.updateEmployeeTab}
            >
              <div style={{ width: '95%', margin: '0 auto' }}>
                <Grid style={{ width: '100%' }}>
                  <Row>
                    {this.state.myRequests.length > 0 ?
                      this.state.myRequests.map(this.createReportCard) :
                      (
                      <Col lg={12} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                        <Card>
                          <CardHeader
                            title="You have no outstanding MPAs"
                          />
                        </Card>
                      </Col>
                      )
                    }
                  </Row>
                </Grid>
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
                  disabled={!this.state.merDates}
                  label="Submit MER"
                  primary
                  style={{ float: 'right', marginTop: '10px', marginLeft: '10px' }}
                  onTouchTap={this.submitReport}
                />
                <RaisedButton
                  label="Include Internet Receipt"
                  primary
                  style={{ float: 'right', marginTop: '10px', marginLeft: '10px' }}
                />
                <RaisedButton
                  label="Include Phone Receipt"
                  primary
                  style={{ float: 'right', marginTop: '10px' }}
                />
              </div>
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
                          onTouchTap={() => { this.setState({ requestFilter: null }); }}
                        />
                      </TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                </Table>
                <Grid style={{ width: '95%' }}>
                  <Row>
                    {this.state.managerRequests.length > 0 ?
                      this.state.managerRequests.map(this.createManagerRequestCard) :
                      (
                      <Col lg={12} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                        <Card>
                          <CardHeader
                            title="No MPAs require your attention at this moment"
                          />
                        </Card>
                      </Col>
                      )
                    }
                  </Row>
                </Grid>
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
