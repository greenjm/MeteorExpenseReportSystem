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
    });
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
      </div>
    );
  },
});

module.exports = ProjectDetail;
