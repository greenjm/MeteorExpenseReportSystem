// This is a placeholder file for what happens when there is a successful login.
// This page is shown when the login button is clicked and it's determined to be a successful login.
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import '../../api/projects/projects.js';

/* global Projects:true*/
/* eslint no-undef: "error"*/

const React = require('react');

const sub = Meteor.subscribe('projects');

const AdminDashboard = React.createClass({
  getInitialState() {
    return {
      projectNames: [],
      projectIds: [],
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
        this.update(projectNames, projectIds);
      }
    });
  },

  update(projectNames, projectIds) {
    this.setState({ projectNames, projectIds });
  },

  createItem(item, index) {
    const url = `/#/project?id=${this.state.projectIds[index]}`;
    return <a href={url}><div className="project" key={index}>{item}</div></a>;
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
        <input type="button" value="New Project" onClick={this.showForm} className="newProjButton" />
        <input type="button" value="New User" onClick={this.showUserForm} className="newUserButton" />
        <div className="dashTitle">Admin Dashboard</div>
        <form className="projectForm" id="projectForm">
          Name:
          <input type="text" id="name" placeholder="Name" />
          Project:
          <input type="text" id="project" placeholder="Project" />
          <button type="submit" className="projectInput" onClick={this.newProject(document.getElementById('project'))}>Submit</button>
          <button type="submit" className="projectCancel" onClick={this.hideForm}>Cancel</button>
        </form>
        <form className="userForm" id="userForm">
          Name:
          <input type="text" id="userName" placeholder="Name" />
          User ID:
          <input type="text" id="userID" placeholder="userID" />
          <button type="submit" className="userInput" onClick={this.newProject(document.getElementById('userForm'))}>Submit</button>
          <button type="submit" className="userCancel" onClick={this.hideUserForm}>Cancel</button>
        </form>
        <div className="dashboard">
          {this.state.projectNames.map(this.createItem)}
        </div>
      </div>
      );
  },
});

module.exports = AdminDashboard;
