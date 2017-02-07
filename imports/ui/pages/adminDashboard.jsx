import { Meteor } from 'meteor/meteor';
import { hashHistory } from 'react-router';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import { Tabs, Tab } from 'material-ui/Tabs';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import '../../api/projects/projects.js';
import Header from '../components/header.jsx';
import muiThemeable from 'material-ui/styles/muiThemeable';

/* global Projects:true*/

const React = require('react');

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
      projects: [],
      users: [],
      reports: [],
      listUsers: [],
      allUsers: [],
      selectedEmployees: [],
      selectedManagers: [],
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
    this.setState({ userFilter: nextProps.userFilter, projectFilter: nextProps.projectFilter });
  },

  createUserRow(item) {
    return (
      <TableRow key={item._id} selectable={false}>
        <TableRowColumn>{item.profile.name}</TableRowColumn>
        <TableRowColumn>{item.emails[0].address}</TableRowColumn>
        <TableRowColumn style={actionsColStyle}>
<<<<<<< HEAD
          <RaisedButton zDepth={1} onTouchTap={() => this.editUser(item)}>
            Edit
          </RaisedButton>
=======
          <RaisedButton label="Edit User" primary onTouchTap={() => this.editUser(item)} />
>>>>>>> develop
        </TableRowColumn>
      </TableRow>);
  },

  createProjectRow(item) {
    const date = new Date(item.bornOn);
    const url = `/#/project/edit/${item._id}`;
    return (
      <TableRow key={item._id} selectable={false}>
        <TableRowColumn>{item.name}</TableRowColumn>
        <TableRowColumn>{date.toDateString()}</TableRowColumn>
        <TableRowColumn>{item.isActive ? 'Active' : 'Inactive'}</TableRowColumn>
        <TableRowColumn style={actionsColStyle}>
          <a href={url}>
<<<<<<< HEAD
            <RaisedButton zDepth={1}>
              View
            </RaisedButton>
=======
            <RaisedButton label="Edit Project" primary />
>>>>>>> develop
          </a>
        </TableRowColumn>
      </TableRow>);
  },

  newProject(projectName) {
    this.createItem(projectName, 4);
  },

  // User Dialog functions
  emptyUserFieldError() {
    if (this.state.newUserEmail === '') {
      this.setState({ emailError: 'This field is required.' });
    }
    if (this.state.newUserName === '') {
      this.setState({ userNameError: 'This field is required.' });
    }
  },

  hideUserForm() {
    document.getElementById('userForm').style.display = 'none';
    document.getElementById('userName').value = '';
    document.getElementById('userID').value = '';
  },

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
      selectedManagers: [],
      users: this.state.listUsers.slice(),
    });
  },

  openProjectDialog() {
    this.setState({ newProjectDialogOpen: true, dialogError: '' });
  },

  handleProjectNameChange(event) {
    this.setState({ newProjectName: event.target.value, projectNameError: '' });
  },

  handleManagerChange(event, index) {
    const users = this.state.users;
    const selected = users.splice(index, 1);
    const managers = this.state.selectedManagers;
    managers.push(selected[0]);
    this.setState({ users, selectedManagers: managers, managerError: '' });
  },

  handleEmployeeChange(event, index) {
    const users = this.state.users;
    const selected = users.splice(index, 1);
    const employees = this.state.selectedEmployees;
    employees.push(selected[0]);
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
    Meteor.call('projects.create', this.state.newProjectName,
      this.state.selectedEmployees,
      this.state.selectedManagers,
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
        rightIconButton={rightIcon}
        primaryText={item.profile.name}
      />
    );
  },

  removeProjectEmployee(index) {
    const users = this.state.users;
    const employees = this.state.selectedEmployees;
    const removed = employees.splice(index, 1);
    users.push(removed[0]);
    this.setState({ users, selectedEmployees: employees });
  },

  createManagerListItem(item, index) {
    const rightIcon = (
      <IconButton
        tooltip="remove"
        onTouchTap={() => { this.removeProjectManager(index); }}
      >
        <ContentClear />
      </IconButton>
    );
    return (
      <ListItem
        rightIconButton={rightIcon}
        primaryText={item.profile.name}
      />
    );
  },

  removeProjectManager(index) {
    const users = this.state.users;
    const managers = this.state.selectedManagers;
    const removed = managers.splice(index, 1);
    users.push(removed[0]);
    this.setState({ users, selectedManagers: managers });
  },

  createReportRow(item) {
    const url = `/#/report/${item._id}`;
    return (
      <TableRow key={item._id} selectable={false}>
        <TableRowColumn>{item.month}</TableRowColumn>
        <TableRowColumn>{item.year}</TableRowColumn>
        <TableRowColumn>{item.approvedRequests.length}</TableRowColumn>
        <TableRowColumn style={actionsColStyle}>
          <a href={url}>
            <RaisedButton label="View Report (TODO)" primary />
          </a>
        </TableRowColumn>
      </TableRow>);
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
        <Paper style={paperStyle} zDepth={1}>Admin Dashboard</Paper>
        <br />
        <br />
        <Tabs>
          <Tab index={0} label="Users" >
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
                <TableRow selectable={false}>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Email</TableHeaderColumn>
                  <TableHeaderColumn>Actions</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.listUsers.length > 0 ?
                  this.state.listUsers.map(this.createUserRow) :
                  (
                  <TableRow selectable={false}>
                    <TableRowColumn>No users found.</TableRowColumn>
                    <TableRowColumn />
                    <TableRowColumn />
                  </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </Tab>
          <Tab index={1} label="Projects" >
            <div>
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
                    <TableHeaderColumn colSpan="3" style={{ textAlign: 'center' }}>
                      <RaisedButton label="New" primary style={tableHeaderButtonStyle} onTouchTap={this.openProjectDialog} />
                    </TableHeaderColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableHeaderColumn>Project Name</TableHeaderColumn>
                    <TableHeaderColumn>Date Created</TableHeaderColumn>
                    <TableHeaderColumn>Is Active</TableHeaderColumn>
                    <TableHeaderColumn>Actions</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {this.state.projects.length > 0 ?
                    this.state.projects.map(this.createProjectRow) :
                    (
                    <TableRow selectable={false}>
                      <TableRowColumn>No projects found.</TableRowColumn>
                      <TableRowColumn />
                      <TableRowColumn />
                      <TableRowColumn />
                    </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </div>
          </Tab>
          <Tab
            index={2}
            label="Monthly Expense Reports"
          >
            <Table selectable={false}>
              <TableHeader displaySelectAll={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn>Month</TableHeaderColumn>
                  <TableHeaderColumn>Year</TableHeaderColumn>
                  <TableHeaderColumn># of Requests</TableHeaderColumn>
                  <TableHeaderColumn>Actions</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.reports.length > 0 ?
                  this.state.reports.map(this.createReportRow) :
                  (
                  <TableRow selectable={false}>
                    <TableRowColumn>No MERs submitted.</TableRowColumn>
                    <TableRowColumn />
                    <TableRowColumn />
                    <TableRowColumn />
                  </TableRow>
                  )
                }
              </TableBody>
            </Table>
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
          <div>
            <SelectField
              value=""
              onChange={this.handleEmployeeChange}
              errorText={this.state.employeeError}
              floatingLabelText="Select Employees"
            >
              {this.state.users.map(this.createUserMenuItem)}
            </SelectField>
            <SelectField
              value=""
              onChange={this.handleManagerChange}
              errorText={this.state.managerError}
              floatingLabelText="Select Managers"
              style={{ float: 'right' }}
            >
              {this.state.users.map(this.createUserMenuItem)}
            </SelectField>
          </div>
          <div>
            <List style={{ float: 'left' }} >
              {this.state.selectedEmployees.map(this.createEmployeeListItem)}
            </List>
            <List style={{ float: 'right' }} >
              {this.state.selectedManagers.map(this.createManagerListItem)}
            </List>
          </div>
          <div style={{ color: 'red' }}>{this.state.dialogError}</div>
        </Dialog>
      </div>
    );
  },
});

module.exports = AdminDashboard;
