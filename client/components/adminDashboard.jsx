// This is a placeholder file for what happens when there is a successful login.
// This page is shown when the login button is clicked and it's determined to be a successful login.

const React = require('react');

const AdminDashboard = React.createClass({
  getInitialState() {
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

  render() {
    return (
      <div>
        <div className="dashTitle">Admin Dashboard</div>
        <div className="dashboard">
          {this.state.projectNames.map(this.createItem)}
        </div>
      </div>

      );
  },
});

module.exports = AdminDashboard;
