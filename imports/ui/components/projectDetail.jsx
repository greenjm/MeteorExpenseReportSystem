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
        Id: 1,
        Name: 'Project1',
        Managers: ['Steve', 'Bob', 'Joe'],
        Employees: ['Susan', 'Sarah', 'Billy-Bob'],
        BornOn: 'October 3 2006',
        Active: 'true',
        TotalCost: '$55,000',
      },
    };
  },

  componentWillMount() {
    // make api call using this.state.projectId and set projectDetails
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
        <p>Total Cost: {this.state.projectDetails.TotalCost}</p>
      </div>
    );
  },
});

module.exports = ProjectDetail;
