import { hashHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
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

const actionsColStyle= {
  paddingLeft: '50px',
};

const AdminDashboard = React.createClass({
  getInitialState() {
    return {
      projectNames: [],
      projectIds: [],
      users: [],
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
          <FloatingActionButton mini>
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
            <FloatingActionButton mini>
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

  render() {
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
                      <TableHeaderColumn colSpan="3" tooltip="Users" style={{ textAlign: 'center' }}>
                        Users
                      </TableHeaderColumn>
                    </TableRow>
                    <TableRow selectable={false}>
                      <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Email">Email</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Actions">Actions</TableHeaderColumn>
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
                      <TableHeaderColumn colSpan="2" tooltip="Projects" style={{ textAlign: 'center' }}>
                        Projects
                      </TableHeaderColumn>
                    </TableRow>
                    <TableRow selectable={false}>
                      <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Actions">Actions</TableHeaderColumn>
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
      </div>
      );
  },
});

module.exports = AdminDashboard;
