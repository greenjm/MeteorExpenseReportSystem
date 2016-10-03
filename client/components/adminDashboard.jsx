// This is a placeholder file for what happens when there is a successful login.
// This page is shown when the login button is clicked and it's determined to be a successful login.

const React = require('react');

const AdminDashboard = React.createClass({
  getInitialState() {
    return {
      projects: ['Project1', 'Project2', 'Project3'],
    };
  },

  createItem(item) {
    return <div className="project">{item}</div>;
  },

  render() {
    return (
      <div>
        <div className="dashTitle">Admin Dashboard</div>
        <div className="dashboard">
          {this.state.projects.map(this.createItem)}
        </div>
      </div>

      );
  },
});

module.exports = AdminDashboard;
