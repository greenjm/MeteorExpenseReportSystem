// This is a placeholder file for what happens when there is a successful login.
// This page is shown when the login button is clicked and it's determined to be a successful login.
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import '../../imports/api/projects/projects.js';

/* global Projects:true*/
/* eslint no-undef: "error"*/

const React = require('react');

const sub = Meteor.subscribe('projects');

Tracker.autorun(() => {
  if (sub.ready()) {
    console.log(Projects.find().fetch());
  }
});

const AdminDashboard = React.createClass({
  getInitialState() {
    // console.log('Temp');
    return {
      projectNames: ['Project1', 'Project2', 'Project3'],
      projectIds: [1, 2, 3],
    };
  },

  componentWillMount() {
    // make api call to get projects and their ids. Set projectNames and projectIds
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

  render() {
    return (
      <div>
        <input type="button" value="New Project" onClick={this.showForm} className="newProjButton" />
        <div className="dashTitle">Admin Dashboard</div>
        <form className="projectForm" id="projectForm">
          Name:
          <input type="text" id="name" placeholder="Name" />
          Project:
          <input type="text" id="project" placeholder="Project" />
          <button type="submit" className="projectInput" onClick={this.newProject(document.getElementById('project'))}>Submit</button>
          <button type="submit" className="projectCancel" onClick={this.hideForm}>Cancel</button>
        </form>
        <div className="dashboard">
          {this.state.projectNames.map(this.createItem)}
        </div>
      </div>
      );
  },
});

module.exports = AdminDashboard;
