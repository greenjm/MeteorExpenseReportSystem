import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { hashHistory } from 'react-router';
import Toggle from 'material-ui/Toggle';
import { Tabs, Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Search from 'material-ui/svg-icons/action/search';
import Header from '../components/header.jsx';

const React = require('react');

// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

function ManagerView(props) {
  function createProjectRow(item) {
    return (
      <TableRow selectable={false}>
        <TableRowColumn>{item.name}</TableRowColumn>
        <TableRowColumn>
          <FloatingActionButton mini style={{ margin: '3px' }} href={`/#/project/view/${item._id}`}>
            <Search />
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
    );
  }

  function createRequestRow(item) {
    let projectName = '';
    for (let i = 0; i < props.projects.length; i += 1) {
      const p = props.projects[i];
      if (p._id === item.projectId) {
        projectName = p.name;
        break;
      }
    }

    let status = '';
    if (item.status === undefined) {
      status = 'Pending';
    } else if (item.status) {
      status = 'Approved';
    } else {
      status = 'Denied';
    }

    return (
      <TableRow selectable={false}>
        <TableRowColumn>{projectName}</TableRowColumn>
        <TableRowColumn>{status}</TableRowColumn>
        <TableRowColumn>{item.statMsg}</TableRowColumn>
        <TableRowColumn>{item.estCost}</TableRowColumn>
        <TableRowColumn>
          <FloatingActionButton mini style={{ margin: '3px' }}>
            <Search />
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
    );
  }

  return (
    <div>
      <Tabs>
        <Tab label="Projects" >
          <Table selectable={false}>
            <TableHeader displaySelectAll={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn>Project Name</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {props.projects.length > 0 ?
                props.projects.map(createProjectRow) :
                (
                <TableRow selectable={false}>
                  <TableRowColumn>You do not belong to any projects.</TableRowColumn>
                  <TableRowColumn />
                </TableRow>
                )
              }
            </TableBody>
          </Table>
        </Tab>
        <Tab label="Requests" >
          <Table selectable={false}>
            <TableHeader displaySelectAll={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn>Project Name</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
                <TableHeaderColumn>Status Message</TableHeaderColumn>
                <TableHeaderColumn>Cost</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {props.requests.length > 0 ?
                props.requests.map(createRequestRow) :
                (
                <TableRow selectable={false}>
                  <TableRowColumn>You have not submitted any requests yet.</TableRowColumn>
                  <TableRowColumn />
                </TableRow>
                )
              }
            </TableBody>
          </Table>
        </Tab>
      </Tabs>
    </div>
  );
}

ManagerView.propTypes = {
  projects: React.PropTypes.array,
  requests: React.PropTypes.array,
};

function EmployeeView(props) {
  function createProjectRow(item) {
    return (
      <TableRow selectable={false}>
        <TableRowColumn>{item.name}</TableRowColumn>
        <TableRowColumn>
          <FloatingActionButton mini style={{ margin: '3px' }} href={`/#/project/view/${item._id}`}>
            <Search />
          </FloatingActionButton>
          <FloatingActionButton mini style={{ margin: '3px' }} href={`/#/submitRequest/${item._id}`}>
            <ContentAdd />
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
    );
  }

  function createRequestRow(item) {
    let projectName = '';
    for (let i = 0; i < props.projects.length; i += 1) {
      const p = props.projects[i];
      if (p._id === item.projectId) {
        projectName = p.name;
        break;
      }
    }

    let status = '';
    if (item.status === undefined) {
      status = 'Pending';
    } else if (item.status) {
      status = 'Approved';
    } else {
      status = 'Denied';
    }

    return (
      <TableRow selectable={false}>
        <TableRowColumn>{projectName}</TableRowColumn>
        <TableRowColumn>{status}</TableRowColumn>
        <TableRowColumn>{item.statMsg}</TableRowColumn>
        <TableRowColumn>{item.estCost}</TableRowColumn>
        <TableRowColumn>
          <FloatingActionButton mini style={{ margin: '3px' }}>
            <Search />
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
    );
  }

  return (
    <div>
      <Tabs>
        <Tab label="Projects" >
          <Table selectable={false}>
            <TableHeader displaySelectAll={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn>Project Name</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {props.projects.length > 0 ?
                props.projects.map(createProjectRow) :
                (
                <TableRow selectable={false}>
                  <TableRowColumn>You do not belong to any projects.</TableRowColumn>
                  <TableRowColumn />
                </TableRow>
                )
              }
            </TableBody>
          </Table>
        </Tab>
        <Tab label="Requests" >
          <Table selectable={false}>
            <TableHeader displaySelectAll={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn>Project Name</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
                <TableHeaderColumn>Status Message</TableHeaderColumn>
                <TableHeaderColumn>Cost</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {props.requests.length > 0 ?
                props.requests.map(createRequestRow) :
                (
                <TableRow selectable={false}>
                  <TableRowColumn>You have not submitted any requests yet.</TableRowColumn>
                  <TableRowColumn />
                </TableRow>
                )
              }
            </TableBody>
          </Table>
        </Tab>
        <Tab
          label="Report"
        >
          <div>
            <h2>TODO</h2>
            <p>
              Still waiting on client feedback.
              This tab may or may not exist in the future depending on necessity.
            </p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

EmployeeView.propTypes = {
  projects: React.PropTypes.array,
  requests: React.PropTypes.array,
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
      viewToggle: this.props.isManager && !this.props.isEmployee,
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
      viewToggle: nextProps.isManager && !nextProps.isEmployee,
    });
  },

  // Helpers
  toggleView() {
    this.setState({ viewToggle: !this.state.viewToggle });
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
        <Paper style={paperStyle} zDepth={1}>User Dashboard</Paper>
        <br />
        {this.state.isManager &&
          <div style={{ float: 'right', marginRight: '10px' }}>
            <Toggle
              label={this.state.viewToggle ? 'Manager View' : 'Employee View'}
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
          />
        ) : (
          <EmployeeView projects={this.state.employeeProjects} requests={this.state.myRequests} />
        )
        }
      </div>
    );
  },
});

module.exports = UserDashboard;
