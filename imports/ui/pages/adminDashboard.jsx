import { Meteor } from 'meteor/meteor';
import { hashHistory } from 'react-router';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import '../../api/projects/projects.js';
import Header from '../components/header.jsx';

/* global Projects:true*/
/* eslint no-undef: "error"*/

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
      projectNames: [],
      projectIds: [],
      users: [],
      listUsers: [],
      selectedEmployees: [],
      selectedManagers: [],
      editUserDialogOpen: false,
      newProjectDialogOpen: false,
      editUserId: '',
      userName: '',
      userNameError: '',
      autoInternet: false,
      autoPhone: false,
      emailError: '',
      isAdmin: false,
      dialogError: '',
      newProjectName: '',
      projectNameError: '',
      managerError: '',
      employeeError: '',
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user || !nextProps.isAdmin) {
      hashHistory.push('/');
    }

    if (nextProps.projectReady) {
      const projectNames = [];
      const projectIds = [];
      for (let i = 0; i < nextProps.projects.length; i += 1) {
        projectNames.push(nextProps.projects[i].name);
        projectIds.push(nextProps.projects[i]._id);
      }
      this.setState({ projectNames, projectIds });
    }
    if (nextProps.userReady) {
      const userList = [];
      for (let i = 0; i < nextProps.users.length; i += 1) {
        userList.push(nextProps.users[i]);
      }
      this.setState({ users: userList, listUsers: userList.slice() });
    }
  },

  createUserRow(item) {
    return (
      <TableRow key={item._id} selectable={false}>
        <TableRowColumn>{item.profile.name}</TableRowColumn>
        <TableRowColumn>{item.emails[0].address}</TableRowColumn>
        <TableRowColumn style={actionsColStyle}>
          <FloatingActionButton mini zDepth={1} onTouchTap={() => this.editUser(item)}>
            <i className="material-icons">edit</i>
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>);
  },

  createProjectRow(item, index) {
    const url = `/#/project/edit/${this.state.projectIds[index]}`;
    return (
      <TableRow key={this.state.projectIds[index]} selectable={false}>
        <TableRowColumn>{item}</TableRowColumn>
        <TableRowColumn style={actionsColStyle}>
          <a href={url}>
            <FloatingActionButton mini zDepth={1}>
              <i className="material-icons">search</i>
            </FloatingActionButton>
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
      autoInternet: this.state.autoInternet,
      autoPhone: this.state.autoPhone,
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
      autoInternet: user.profile.autoInternet,
      autoPhone: user.profile.autoPhone,
      isAdmin: user.profile.isAdmin,
      dialogError: '',
    });
    this.openUserDialog();
  },

  handleUserNameChange(event) {
    this.setState({ userName: event.target.value, userNameError: '' });
  },

  handleAutoInternetChange() {
    this.setState({ autoInternet: !this.state.autoInternet });
  },

  handleAutoPhoneChange() {
    this.setState({ autoPhone: !this.state.autoPhone });
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
        <div>
          <Grid>
            <Row>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Table selectable={false}>
                  <TableHeader displaySelectAll={false}>
                    <TableRow selectable={false}>
                      <TableHeaderColumn>Name</TableHeaderColumn>
                      <TableHeaderColumn>Email</TableHeaderColumn>
                      <TableHeaderColumn>Actions</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    showRowHover
                    displayRowCheckbox={false}
                  >
                    {this.state.listUsers.map(this.createUserRow)}
                  </TableBody>
                </Table>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Table selectable={false}>
                  <TableHeader displaySelectAll={false}>
                    <TableRow selectable={false}>
                      <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                        <RaisedButton label="New" primary style={tableHeaderButtonStyle} onTouchTap={this.openProjectDialog} />
                        Projects
                      </TableHeaderColumn>
                    </TableRow>
                    <TableRow selectable={false}>
                      <TableHeaderColumn>Name</TableHeaderColumn>
                      <TableHeaderColumn>Actions</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    showRowHover
                    displayRowCheckbox={false}
                  >
                    {this.state.projectNames.map(this.createProjectRow)}
                  </TableBody>
                </Table>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Table
                  selectable={false}
                >
                  <TableHeader displaySelectAll={false}>
                    <TableRow selectable={false}>
                      <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                        <RaisedButton label="New" primary style={tableHeaderButtonStyle} onTouchTap={this.openRequestDialog} />
                        Requests
                      </TableHeaderColumn>
                    </TableRow>
                    <TableRow selectable={false}>
                      <TableHeaderColumn>Name</TableHeaderColumn>
                      <TableHeaderColumn>Actions</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    showRowHover
                    displayRowCheckbox={false}
                  />
                </Table>
              </Col>
            </Row>
          </Grid>
        </div>

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
            label="Auto Internet?"
            style={switchStyle}
            toggled={this.state.autoInternet}
            onToggle={this.handleAutoInternetChange}
          />
          <br />
          <Toggle
            label="Auto Phone?"
            style={switchStyle}
            toggled={this.state.autoPhone}
            onToggle={this.handleAutoPhoneChange}
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
