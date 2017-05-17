import { Meteor } from 'meteor/meteor';
import { hashHistory } from 'react-router';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import '../../api/projects/projects.js';
import Header from '../components/header.jsx';

/* global Projects localStorage:true*/
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

const actionsColStyle = {
  paddingLeft: '50px',
};

const tableHeaderButtonStyle = {
  float: 'right',
};

const switchStyle = {
  width: '50%',
};

const AdminDashboard = React.createClass({
  propTypes: {
    isAdmin: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      breadcrumbs: [],
      projects: [],
      users: [],
      reports: [],
      listUsers: [],
      allUsers: [],
      selectedEmployees: [],
      editUserDialogOpen: false,
      newProjectDialogOpen: false,
      editUserId: '',
      userName: '',
      userNameError: '',
      emailError: '',
      isAdmin: false,
      dialogError: '',
      newProjectName: '',
      projectNameError: '',
      managerError: '',
      employeeError: '',
      userFilter: null,
      projectFilter: null,
      startingTab: +localStorage.getItem('adminTab') || 0,
      projectSelectVal: 1
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user || !nextProps.isAdmin) {
      hashHistory.push('/');
    }

    if (nextProps.projectReady) {
      this.setState({ projects: nextProps.projects });
    }
    if (nextProps.userReady) {
      const userList = [];
      for (let i = 0; i < nextProps.users.length; i += 1) {
        userList.push(nextProps.users[i]);
      }
      this.setState({ users: userList, listUsers: userList.slice(), allUsers: userList.slice() });
    }
    if (nextProps.reportReady) {
      this.setState({ reports: nextProps.reports });
    }
    this.setState({ userFilter: nextProps.userFilter,
      projectFilter: nextProps.projectFilter,
      breadcrumbs: nextProps.breadcrumbs,
    });
  },

  updateTab(tab) {
    localStorage.setItem('adminTab', +tab.props.index);
  },

  createBreadcrumb(item) {
    return (
      <li><a href={item.url}>{item.page}</a></li>
    );
  },

  createUserCard(item) {
    return (
      <Col xs={12} sm={12} md={6} lg={4} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Card>
          <CardHeader
            title={item.profile.name}
            subtitle={`Email: ${item.emails[0].address}`}
          />
          <CardActions>
            <RaisedButton
              label="Edit User"
              onTouchTap={() => this.editUser(item)}
              primary
            />
          </CardActions>
        </Card>
      </Col>);
  },

  createProjectCard(item) {
    const showAll = this.state.projectSelectVal === 0;
    const activeFilter = this.state.projectSelectVal === 1 && item.isActive;
    const inactiveFilter = this.state.projectSelectVal === 2 && !item.isActive;
    if (showAll || activeFilter || inactiveFilter) {
      const date = new Date(item.bornOn);
      const url = `/#/project/edit/${item._id}`;
      let style = {}
      if (!item.isActive) {
        style = { backgroundColor: '#ccc' }
      }
      return (
        <Col xs={12} sm={12} md={6} lg={6} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
          <Card style={style}>
            <CardHeader
              title={item.name}
              subtitle={`Created on ${dateFormat(item.bornOn, 'mmmm d, yyyy')}`}
            />
            <CardText>
              <strong>Current Status: </strong>{item.isActive ? 'Active' : 'Inactive'}
            </CardText>
            <CardActions>
              <a href={url}>
                <RaisedButton
                  label="Edit Project"
                  primary
                />
              </a>
            </CardActions>
          </Card>
        </Col>);
    }
    return null;
  },

  // User Dialog functions
  submitUser() {
    if (this.state.userName === '') {
      this.setState({ userNameError: 'This field is required.' });
      return;
    }
    const profile = {
      name: this.state.userName,
      isAdmin: this.state.isAdmin,
    };
    Meteor.call('users.update', this.state.editUserId,
      profile,
      (error, result) => {
        if (error != null) {
          this.setState({ dialogError: `Error: ${error.error}. Reason: ${error.reason}` });
          return;
        }
        if (result) {
          this.setState({ dialogError: '' });
        }
        this.closeUserDialog();
      });
  },

  closeUserDialog() {
    this.setState({
      editUserDialogOpen: false,
      newUserName: '',
      newUserEmail: '',
      isAdmin: false,
    });
  },

  // State Bindings
  openUserDialog() {
    this.setState({ editUserDialogOpen: true });
  },

  closeProjectDialog() {
    this.setState({
      newProjectDialogOpen: false,
      selectedEmployees: [],
      users: this.state.listUsers.slice(),
    });
  },

  openProjectDialog() {
    this.setState({ newProjectDialogOpen: true, dialogError: '' });
  },

  handleProjectNameChange(event) {
    this.setState({ newProjectName: event.target.value, projectNameError: '' });
  },

  handleEmployeeChange(event, index) {
    const users = this.state.users;
    const selected = users.splice(index, 1);
    const employees = this.state.selectedEmployees;
    employees.push({ isManager: false, item: selected[0] });
    this.setState({ users, selectedEmployees: employees, employeeError: '' });
  },

  editUser(user) {
    this.setState({
      editUserId: user._id,
      userName: user.profile.name,
      userNameError: '',
      isAdmin: user.profile.isAdmin,
      dialogError: '',
    });
    this.openUserDialog();
  },

  handleUserNameChange(event) {
    this.setState({ userName: event.target.value, userNameError: '' });
  },

  handleIsAdminChange() {
    this.setState({ isAdmin: !this.state.isAdmin });
  },

  // Project Dialog functions
  emptyProjectFieldError() {
    if (this.state.newProjectName === '') {
      this.setState({ projectNameError: 'This field is required.' });
    }
  },

  submitProject() {
    if (this.state.newProjectName === '') {
      this.emptyProjectFieldError();
      return;
    }
    const employees = [];
    const managers = [];
    for (let i = 0; i < this.state.selectedEmployees.length; i += 1) {
      const item = this.state.selectedEmployees[i];
      employees.push(item.item);
      if (item.isManager) {
        managers.push(item.item);
      }
    }
    Meteor.call('projects.create', this.state.newProjectName,
      employees,
      managers,
      (err) => {
        if (err != null) {
          this.setState({ dialogError: `Error: ${err.error}. Reason: ${err.reason}` });
          return;
        }
        this.setState({ dialogError: '', newProjectName: '' });

        this.closeProjectDialog();
      }
    );
  },

  createUserMenuItem(item) {
    return (
      <MenuItem value={item._id} key={item._id} primaryText={item.profile.name} />
    );
  },

  createEmployeeListItem(item, index) {
    const leftIcon = (
      <Checkbox
        onCheck={() => { this.toggleIsManager(index); }}
      />
    );
    const rightIcon = (
      <IconButton
        tooltip="remove"
        onTouchTap={() => { this.removeProjectEmployee(index); }}
      >
        <ContentClear />
      </IconButton>
    );
    return (
      <ListItem
        leftCheckbox={leftIcon}
        rightIconButton={rightIcon}
        primaryText={`(${item.isManager ? "Manager" : "Employee"}) ${item.item.profile.name}`}
      />
    );
  },

  removeProjectEmployee(index) {
    const users = this.state.users;
    const employees = this.state.selectedEmployees;
    const removed = employees.splice(index, 1);
    users.push(removed[0].item);
    this.setState({ users, selectedEmployees: employees });
  },

  toggleIsManager(index) {
    const employees = this.state.selectedEmployees;
    employees[index].isManager = !employees[index].isManager;
    this.setState({ selectedEmployees: employees });
  },

  createReportCard(item) {
    const url = `/#/report/${item._id}`;
    let userName = '';
    for (let i = 0; i < this.state.allUsers.length; i += 1) {
      const currUser = this.state.allUsers[i];
      if (currUser._id === item.userId) {
        userName = currUser.profile.name;
      }
    }
    return (
      <Col xs={12} sm={12} md={6} lg={4} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Card>
          <CardHeader
            title={`Submitted by ${userName}`}
            subtitle={`Submitted on ${item.month + 1}/${item.year}`}
          />
          <CardText>
            <strong>Number of MPAs: </strong>{item.approvedRequests.length}
          </CardText>
          <CardActions>
            <a href={url}>
              <RaisedButton
                label="View Report"
                primary
              />
            </a>
          </CardActions>
        </Card>
      </Col>);
  },

  // Filters
  handleUserFilterChange(e) {
    const regex = new RegExp(e.target.value, 'i');
    this.setState({ listUsers: this.state.userFilter(regex) });
  },

  handleProjectFilterChange(e) {
    const regex = new RegExp(e.target.value, 'i');
    this.setState({ projects: this.state.projectFilter(regex) });
  },

  handleProjectSelectChange(e, index, value) {
    this.setState({ projectSelectVal: value });
  },

  render() {
    const userDialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.closeUserDialog}
      />,
      <FlatButton
        label="Save"
        primary
        onTouchTap={this.submitUser}
      />,
    ];

    const projectDialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.closeProjectDialog}
      />,
      <FlatButton
        label="Add"
        primary
        onTouchTap={this.submitProject}
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
        <br />
        <Tabs initialSelectedIndex={this.state.startingTab}>
          <Tab index={0} label="Users" onActive={this.updateTab}>
            <Table selectable={false}>
              <TableHeader displaySelectAll={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn colSpan="3">
                    <TextField
                      hintText="Name"
                      floatingLabelText="Search Users"
                      onChange={this.handleUserFilterChange}
                    />
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
            </Table>
            <Grid style={{ width: '95%' }}>
              <Row>
                {this.state.listUsers.length > 0 ?
                  this.state.listUsers.map(this.createUserCard) :
                  (
                  <Col lg={12} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <Card>
                      <CardHeader
                        title="There are no users in the system"
                      />
                    </Card>
                  </Col>
                  )
                }
              </Row>
            </Grid>
          </Tab>
          <Tab index={1} label="Projects" onActive={this.updateTab}>
            <Table selectable={false}>
              <TableHeader displaySelectAll={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn>
                    <TextField
                      hintText="Name"
                      floatingLabelText="Search Projects"
                      onChange={this.handleProjectFilterChange}
                    />
                  </TableHeaderColumn>
                  <TableHeaderColumn style={{ textAlign: 'left' }}>
                    <SelectField
                      value={this.state.projectSelectVal}
                      onChange={this.handleProjectSelectChange}
                      floatingLabelText="Filter Projects"
                    >
                      <MenuItem value={0} key={0} primaryText={"Show All"} />
                      <MenuItem value={1} key={1} primaryText={"Show Active"} />
                      <MenuItem value={2} key={2} primaryText={"Show Inactive"} />
                    </SelectField>
                  </TableHeaderColumn>
                  <TableHeaderColumn style={{ textAlign: 'center' }}>
                    <RaisedButton label="New" primary style={tableHeaderButtonStyle} onTouchTap={this.openProjectDialog} />
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
            </Table>
            <Grid style={{ width: '95%' }}>
              <Row>
                {this.state.projects.length > 0 ?
                  this.state.projects.map(this.createProjectCard) :
                  (
                  <Col lg={12} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <Card>
                      <CardHeader
                        title="There are no projects in the system"
                      />
                    </Card>
                  </Col>
                  )
                }
              </Row>
            </Grid>
          </Tab>
          <Tab
            index={2}
            label="Monthly Expense Reports"
            onActive={this.updateTab}
          >
            <Grid style={{ width: '95%' }}>
              <Row>
                {this.state.reports.length > 0 ?
                  this.state.reports.map(this.createReportCard) :
                  (
                  <Col lg={12} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <Card>
                      <CardHeader
                        title="No MERs have been submitted"
                      />
                    </Card>
                  </Col>
                  )
                }
              </Row>
            </Grid>
          </Tab>
        </Tabs>

        <Dialog
          title="Edit User"
          actions={userDialogActions}
          modal={false}
          open={this.state.editUserDialogOpen}
          onRequestClose={this.closeUserDialog}
        >
          <TextField
            hintText="name"
            floatingLabelText="Full Name"
            fullWidth
            value={this.state.userName}
            errorText={this.state.userNameError}
            name="userName"
            onChange={this.handleUserNameChange}
          />
          <br />
          <Toggle
            label="Is Admin?"
            style={switchStyle}
            toggled={this.state.isAdmin}
            onToggle={this.handleIsAdminChange}
          />
          <div style={{ color: 'red' }}>{this.state.dialogError}</div>
        </Dialog>

        <Dialog
          title="Add New Project"
          actions={projectDialogActions}
          modal={false}
          open={this.state.newProjectDialogOpen}
          onRequestClose={this.closeProjectDialog}
        >
          <TextField
            hintText="name"
            floatingLabelText="Project Name"
            fullWidth
            value={this.state.newProjectName}
            errorText={this.state.projectNameError}
            name="newProjectName"
            onChange={this.handleProjectNameChange}
          />
          <SelectField
            value=""
            onChange={this.handleEmployeeChange}
            errorText={this.state.employeeError}
            floatingLabelText="Select Employees"
            fullWidth
          >
            {this.state.users.map(this.createUserMenuItem)}
          </SelectField>
          <List>
            {this.state.selectedEmployees.map(this.createEmployeeListItem)}
          </List>
          <div style={{ color: 'red' }}>{this.state.dialogError}</div>
        </Dialog>
      </div>
    );
  },
});

module.exports = AdminDashboard;
