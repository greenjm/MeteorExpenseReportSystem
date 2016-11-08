import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import '../../api/projects/projects.js';
import Header from './header.jsx';

/* global Projects:true*/
/* eslint no-undef: "error"*/

const React = require('react');

const sub = Meteor.subscribe('projects');
const userSub = Meteor.subscribe('users');

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
  getInitialState() {
    return {
      projectNames: [],
      projectIds: [],
      users: [],
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
      projectManager: '',
      managerError: '',
    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      if (sub.ready()) {
        const projects = Projects.find().fetch();
        const projectNames = [];
        const projectIds = [];
        for (let i = 0; i < projects.length; i += 1) {
          projectNames.push(projects[i].name);
          projectIds.push(projects[i]._id);
        }
        this.setState({ projectNames, projectIds });
      }
      if (userSub.ready()) {
        const users = Meteor.users.find().fetch();
        const userList = [];
        for (let i = 0; i < users.length; i += 1) {
          userList.push(users[i]);
        }
        this.setState({ users: userList });
      }
    });
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
    const url = `/#/project?id=${this.state.projectIds[index]}`;
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

  showForm() {
    document.getElementById('projectForm').style.display = 'block';
  },

  hideForm() {
    document.getElementById('projectForm').style.display = 'none';
    document.getElementById('name').value = '';
    document.getElementById('project').value = '';
  },

  showUserForm() {
    document.getElementById('userForm').style.display = 'block';
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
    this.setState({ editUserDialogOpen: false,
                    editUserId: '',
                    userName: '',
                    autoInternet: false,
                    autoPhone: false,
                    isAdmin: false });
  },

  openUserDialog() {
    this.setState({ editUserDialogOpen: true });
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
    if (this.state.projectManager === '') {
      this.setState({ managerError: 'This field is required.' });
    }
  },

  submitProject() {
    if (this.state.newProjectName === '' || this.state.projectManager === '') {
      this.emptyProjectFieldError();
      return;
    }
    Meteor.call('projects.create', this.state.newProjectName, this.state.projectManager, (err, res) => {
      if (err != null) {
        this.setState({ dialogError: `Error: ${err.error}. Reason: ${err.reason}` });
        return;
      }
      if (res) {
        this.setState({ dialogError: '', newProjectName: '', projectManager: '' });
      }
      this.closeProjectDialog();
    });
  },

  closeProjectDialog() {
    this.setState({ newProjectDialogOpen: false });
  },

  openProjectDialog() {
    this.setState({ newProjectDialogOpen: true, dialogError: '' });
  },

  handleProjectNameChange(event) {
    this.setState({ newProjectName: event.target.value, projectNameError: '' });
  },

  handleManagerChange(event, index, value) {
    this.setState({ projectManager: value, managerError: '' });
  },

  createUserMenuItem(item) {
    return (
      <MenuItem value={item._id} primaryText={item.profile.name} />
    );
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
        <Header />
        <Paper style={paperStyle} zDepth={1}>Admin Dashboard</Paper>
        <br />
        <br />
        <div>
          <Grid>
            <Row>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Table
                  selectable={false}
                >
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
                    {this.state.users.map(this.createUserRow)}
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
          <SelectField
            value={this.state.projectManager}
            onChange={this.handleManagerChange}
            errorText={this.state.managerError}
          >
            {this.state.users.map(this.createUserMenuItem)}
          </SelectField>
          <div style={{ color: 'red' }}>{this.state.dialogError}</div>
        </Dialog>
      </div>
      );
  },
});

module.exports = AdminDashboard;
