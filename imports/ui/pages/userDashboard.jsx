import { hashHistory } from 'react-router';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';
import Header from '../components/header.jsx';
import ManagerView from '../components/managerView.jsx';
import EmployeeView from '../components/employeeView.jsx';
import TextField from 'material-ui/TextField'

const React = require('react');

// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const UserDashboard = React.createClass({
  propTypes: {
    isAdmin: React.PropTypes.bool,
    name: React.PropTypes.string,
    employeeProjects: React.PropTypes.array,
    managerProjects: React.PropTypes.array,
    myRequests: React.PropTypes.array,
    managerRequests: React.PropTypes.array,
    users: React.PropTypes.array,
    isManager: React.PropTypes.bool,
    isEmployee: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      name: '',
      employeeProjects: [],
      managerProjects: [],
      myRequests: [],
      managerRequests: [],
      users: [],
      isManager: false,
      isEmployee: false,
      viewToggle: false,
      currentEmployeeTab: 0,
      currentManagerTab: 0,
    };
  },

  componentWillMount() {
    this.setState({
      name: this.props.name,
      employeeProjects: this.props.employeeProjects,
      managerProjects: this.props.managerProjects,
      myRequests: this.props.myRequests,
      managerRequests: this.props.managerRequests,
      users: this.props.users,
      isManager: this.props.isManager,
      isEmployee: this.props.isEmployee,
      viewToggle: this.state.viewToggle || (this.props.isManager && !this.props.isEmployee),
    });
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user) {
      hashHistory.push('/');
    }

    const nameChange = this.state.name !== nextProps.name;
    const employeeProjectsChange = this.state.employeeProjects !== nextProps.employeeProjects;
    const managerProjectsChange = this.state.managerProjects !== nextProps.managerProjects;
    const myRequestsChange = this.state.myRequests !== nextProps.myRequests;
    const managerRequestsChange = this.state.managerRequests !== nextProps.managerRequests;
    const usersChange = this.state.users !== nextProps.users;
    const isManagerChange = this.state.isManager !== nextProps.isManager;
    const isEmployeeChange = this.state.isEmployee !== nextProps.isEmployee;

    this.setState({
      name: nameChange ? nextProps.name : this.state.name,
      employeeProjects: employeeProjectsChange ?
        nextProps.employeeProjects : this.state.employeeProjects,
      managerProjects: managerProjectsChange ?
        nextProps.managerProjects : this.state.managerProjects,
      myRequests: myRequestsChange ? nextProps.myRequests : this.state.myRequests,
      managerRequests: managerRequestsChange ?
        nextProps.managerRequests : this.state.managerRequests,
      users: usersChange ? nextProps.users : this.state.users,
      isManager: isManagerChange ? nextProps.isManager : this.state.isManager,
      isEmployee: isEmployeeChange ? nextProps.isEmployee : this.state.isEmployee,
      viewToggle: this.state.viewToggle || (this.props.isManager && !this.props.isEmployee),
    });
  },

  // Helpers
  toggleView() {
    this.setState({ viewToggle: !this.state.viewToggle });
  },

  updateEmployeeTab(tab) {
    this.setState({ currentEmployeeTab: +tab.props.index });
  },

  updateManagerTab(tab) {
    this.setState({ currentManagerTab: +tab.props.index });
  },

  // Links
  submitRequest() {
    hashHistory.push('/submitRequest');
  },

  manageRequests() {
    hashHistory.push('/manageRequests');
  },

  viewRequests() {
    hashHistory.push('/viewRequests');
  },

  submitReport() {
    hashHistory.push('/submitReport');
  },

  render() {
    return (
      <div>
        <Header isAdmin={this.props.isAdmin} />
        <Paper style={paperStyle} zDepth={1}>{this.state.viewToggle ? 'Employee Dashboard' : 'Manager Dashboard'}</Paper>
        <br />
        <div>
        </div>
        {this.state.isManager &&
          <div style={{ float: 'right', marginRight: '10px' }}>
            <Toggle
              label={!this.state.viewToggle ? 'Employee View' : 'Manager View'}
              toggled={this.state.viewToggle}
              onToggle={this.toggleView}
            />
          </div>
        }
        <br />
        { this.state.viewToggle ? (
          <ManagerView
            projects={this.state.managerProjects}
            requests={this.state.managerRequests}
            currentTab={this.state.currentManagerTab}
            updateTab={this.updateManagerTab}
          />
        ) : (
          <EmployeeView
            projects={this.state.employeeProjects}
            requests={this.state.myRequests}
            currentTab={this.state.currentEmployeeTab}
            updateTab={this.updateEmployeeTab}
          />
        )
        }
      </div>
    );
  },
});

module.exports = UserDashboard;
