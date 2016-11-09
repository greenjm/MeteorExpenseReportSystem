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

// Subscriptions
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
      newUserDialogOpen: false,
      newProjectDialogOpen: false,
      newUserEmail: '',
      newUserName: '',
      emailError: '',
      userNameError: '',
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
          <FloatingActionButton mini zDepth={1}>
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

  // User Dialog functions
  emptyUserFieldError() {
    if (this.state.newUserEmail === '') {
      this.setState({ emailError: 'This field is required.' });
    }
    if (this.state.newUserName === '') {
      this.setState({ userNameError: 'This field is required.' });
    }
  },

  submitUser() {
    if (this.state.newUserEmail === '' || this.state.newUserName === '') {
      this.emptyUserFieldError();
      return;
    }
    Meteor.call('users.new', this.state.newUserEmail,
      this.state.newUserName,
      this.state.isAdmin,
      (error, result) => {
        if (error != null) {
          this.setState({ dialogError: `Error: ${error.error}. Reason: ${error.reason}` });
          return;
        }
        if (result) {
          this.setState({ dialogError: '', newUserName: '', newUserEmail: '', isAdmin: false });
        }
        this.closeUserDialog();
      });
  },

  closeUserDialog() {
    this.setState({
      newUserDialogOpen: false,
      newUserName: '',
      newUserEmail: '',
      isAdmin: false,
    });
  },

  // State Bindings
  openUserDialog() {
    this.setState({ newUserDialogOpen: true });
  },

  handleEmailChange(event) {
    this.setState({ newUserEmail: event.target.value, emailError: '' });
  },

  handleUserNameChange(event) {
    this.setState({ newUserName: event.target.value, userNameError: '' });
  },

  handleIsAdminChange() {
    this.setState({ isAdmin: !this.state.isAdmin });
  },

  closeProjectDialog() {
    this.setState({ newProjectDialogOpen: false });
  },

  openProjectDialog() {
    this.setState({ newProjectDialogOpen: true });
  },

  handleProjectNameChange(event) {
    this.setState({ newProjectName: event.target.value, projectNameError: '' });
  },

  handleManagerChange(event, index, value) {
    this.setState({ projectManager: value, managerError: '' });
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
    Meteor.call('projects.create', this.state.newProjectName, this.state.projectManager, (err) => {
      if (err) {
        this.setState({ dialogError: `Error: ${err.error}. Reason: ${err.reason}` });
        return;
      }

      this.setState({ dialogError: '', newProjectName: '', projectManager: '' });
      this.closeProjectDialog();
    });
  },

  createUserMenuItem(item) {
    return (
      <MenuItem value={item._id} key={item._id} primaryText={item.profile.name} />
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
        label="Add"
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
                <Table selectable={false}>
                  <TableHeader displaySelectAll={false}>
                    <TableRow selectable={false}>
                      <TableHeaderColumn colSpan="3" style={{ textAlign: 'center' }}>
                        <RaisedButton label="New" primary style={tableHeaderButtonStyle} onTouchTap={this.openUserDialog} />
                        Users
                      </TableHeaderColumn>
                    </TableRow>
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
            </Row>
          </Grid>
        </div>
        <Dialog
          title="Add New User"
          actions={userDialogActions}
          modal={false}
          open={this.state.newUserDialogOpen}
          onRequestClose={this.closeUserDialog}
        >
          <TextField
            hintText="email"
            floatingLabelText="Email Address"
            fullWidth
            value={this.state.newUserEmail}
            errorText={this.state.emailError}
            name="newUserEmail"
            onChange={this.handleEmailChange}
          />
          <TextField
            hintText="name"
            floatingLabelText="Full Name"
            fullWidth
            value={this.state.newUserName}
            errorText={this.state.userNameError}
            name="newUserEmail"
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
            name="newUserEmail"
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
