import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import '../../api/projects/projects.js';

/* global Projects:true*/
/* eslint no-undef: "error"*/

const React = require('react');

const ProjectDetail = React.createClass({
  propTypes() {
    return {
      location: React.object,
    };
  },

  getInitialState() {
    return {
      projectId: this.props.location.query.id,
      projectDetails: {
        Id: -1,
        Name: '',
        Managers: [],
        Employees: [],
        BornOn: '',
        Active: '',
      },
    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      Meteor.subscribe('projectGet', this.state.projectId, () => {
        const project = Projects.findOne();
        const proj = {
          Name: project.name,
          Managers: project.managers,
          Employees: project.employees,
          BornOn: project.bornOn.toString(),
          Active: project.isactive,
        };

        this.setState({ projectDetails: proj });
      });
      Meteor.subscribe('users', () => {
        const allUsers = Meteor.users.find().fetch();
      });
    });
  },

  showAddEmployee() {
    document.getElementById('addUserForm').style.display = 'block';
    var sel = document.getElementById('employeeDropDown');
    for (var i = 0; i < allUsers.length - 1; i++) {
      var opt = allUsers[i]
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      sel.appendChild(el);
    }
    // var options = 
  },

  hideForm() {
    document.getElementById('addUserForm').style.display = "none";
  },

  render() {
    return (
      <div className="dashboard">
        <p>Name: {this.state.projectDetails.Name}</p>
        <p>Project Id: {this.state.projectDetails.Id}</p>
        <p>Managers: {this.state.projectDetails.Managers.join(', ')}</p>
        <p>Employees: {this.state.projectDetails.Employees.join(', ')}</p>
        <p>Start Date: {this.state.projectDetails.BornOn}</p>
        <p>Active: {this.state.projectDetails.Active}</p>
        <input type="button" value="Add Employee" onClick={this.showAddEmployee} className="addUserButton" />
        <form className="addUserForm" id="addUserForm">
          <select className="employeeDropDown"></select>
          <button type="submit" className="employeeButton">Submit</button>
          <button type="submit" className="employeeButton" onClick={this.hideForm}>Cancel</button>
        </form>
      </div>

    );
  },
});

module.exports = ProjectDetail;
