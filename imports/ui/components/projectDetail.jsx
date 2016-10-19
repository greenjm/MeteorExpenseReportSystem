import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import '../../api/projects/projects.js';

/* global Projects:true*/
/* eslint no-undef: "error"*/

const React = require('react');

let allEmployees;

const ProjectDetail = React.createClass({
  propTypes() {
    return {
      location: React.object,
    };
  },

  getInitialState() {
    return {
      projectId: this.props.location.query.id,
      Name: '',
      Managers: [],
      Employees: [],
      BornOn: '',
      Active: '',
    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      Meteor.subscribe('projectGet', this.state.projectId, () => {
        const project = Projects.findOne();
        this.setState({
          Name: project.name,
          Managers: project.managers,
          Employees: project.employees,
          BornOn: project.bornOn.toString(),
          Active: !!project.isActive,
        });
        Meteor.subscribe('users', () => {
          allEmployees = Meteor.users.find().fetch();
        });
      });
    });
  },

  toggleActive() {
    this.setState({ Active: !this.state.Active });
  },

  changeName(event) {
    this.setState({ Name: event.target.value });
  },

  editProject() {
    if (this.state.projectDetails.Active) {
      Tracker.autorun(() => {
        Meteor.call('projects.activate', this.state.projectId, (err) => {
          console.log(err);
        });
      });
    } else {
      Tracker.autorun(() => {
        Meteor.call('projects.deactivate', this.state.projectId, (err) => {
          console.log(err);
        });
      });
    }

    Tracker.autorun(() => {
      Meteor.call('projects.editName', this.state.projectId, this.state.Name, (err) => {
        console.log(err);
      });
    });
  },

  addAllEmployees() {
    const sel = document.getElementById('employeeList');
    sel.style.display = 'block';
    for (let i = 0; i < allEmployees.length; i++) {
      const opt = allEmployees[i];
      const el = document.createElement('option');
      el.textContent = opt;
      el.value = opt;
      sel.appendChild(el);
    }
    this.setState({ Employees: allEmployees });
  },

  render() {
    return (
      <div className="dashboard">
        <label htmlFor="name">Name:</label>
        <input name="name" type="text" value={this.state.Name} onChange={this.changeName} />

        <p>Id: {this.state.projectId}</p>
        <p>Managers: {this.state.Managers.join(', ')}</p>
        <p>Employees: {this.state.Employees.join(', ')}</p>
        <select multiple className="employeeList" id="employeeList" display="none">All Employees</select>
        <p>Start Date: {this.state.BornOn}</p>

        <label htmlFor="active">Active:</label>
        <input name="active" type="checkbox" checked={this.state.Active} onClick={this.toggleActive} />

        <button onClick={this.addAllEmployees}>Add Employee</button>
        <button onClick={this.editProject}>Save Changes</button>
      </div>
    );
  },
});

module.exports = ProjectDetail;
