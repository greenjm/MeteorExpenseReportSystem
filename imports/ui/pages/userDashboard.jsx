import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import { hashHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { Tabs, Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import ActionReceipt from 'material-ui/svg-icons/action/receipt';
import Description from 'material-ui/svg-icons/action/description';
import Assignment from 'material-ui/svg-icons/action/assignment';
import DeveloperBoard from 'material-ui/svg-icons/hardware/developer-board';
import ViewList from 'material-ui/svg-icons/action/view-list';
import Header from '../components/header.jsx';

const React = require('react');

// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const leftColStyle = {
  borderRight: '2px solid grey',
};

const buttonStyle = {
  width: '100%',
  fontSize: '2em',
  marginTop: '10px',
  height: '50px',
};

const tableHeaderButtonStyle = {
  float: 'right',
};

const actionsColStyle = {
  paddingLeft: '50px',
};

function  createProjectRow(item, index) {
  const url = `/#/project/${this.state.projectIds[index]}`;
  return (
    <TableRow key={this.state.projectIds[index]} selectable={false}>
      <TableRowColumn>{item}</TableRowColumn>
      <TableRowColumn style={actionsColStyle}>
        <a href={url}>
          <FloatingActionButton mini zDepth={1}>
            <i className="material-icons">search</i>
          </FloatingActionButton>
        </a>
      </TableRowColumn>
    </TableRow>);
}

function ManagerView(props) {
  return (
    <div>
      <Tabs>
        <Tab label="Projects" >
          <div>
            <Table selectable={false}>
              <TableHeader displaySelectAll={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn colSpan="2" style={{ textAlign: 'center' }}>
                    <RaisedButton label="New" primary style={tableHeaderButtonStyle} onTouchTap={this.openProjectDialog} />
                    Projects
                  </TableHeaderColumn>
                </TableRow>
                <TableRow selectable={false}>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Actions</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                showRowHover
                displayRowCheckbox={false}
              >
                {props.projects.map(createProjectRow)}
              </TableBody>
            </Table>
          </div>
        </Tab>
        <Tab label="Requests" >
          <div>
            <h2>Tab Two</h2>
            <p>
              This is another example tab.
            </p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

ManagerView.propTypes = {
  projects: React.propTypes.array,
  // requests: React.propTypes.array,
};

function EmployeeView() {
  return (
    <div>
      <Tabs>
        <Tab label="Projects" >
          <div>
            <h2>Tab One</h2>
            <p>
              This is an example tab.
            </p>
            <p>
              You can put any sort of HTML or react component in here.
              It even keeps the component state!
            </p>
          </div>
        </Tab>
        <Tab label="Requests" >
          <div>
            <h2>Tab Two</h2>
            <p>
              This is another example tab.
            </p>
          </div>
        </Tab>
        <Tab
          label="Report"
        >
          <div>
            <h2>Tab Three</h2>
            <p>
              This is a third example tab.
            </p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

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
        <div style={{ float: 'right', marginRight: '10px' }}>
          <Toggle
            label={this.state.viewToggle ? 'Manager View' : 'Employee View'}
            toggled={this.state.viewToggle}
            onToggle={this.toggleView}
          />
        </div>
        <br />
        { this.state.viewToggle ? (
          <ManagerView
            projects={this.state.managerProjects}
            requests={this.state.managerRequests}
          />
        ) : (
          <EmployeeView />
        )
        }
      </div>
    );
  },
});

/*
        <br />
        <div>
          <Grid>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Paper
                  style={paperStyle}
                  zDepth={2}
                >
                  Welcome, {this.state.name}
                </Paper>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col xs={12} sm={12} md={6} lg={6} style={leftColStyle}>
                <Paper style={paperStyle} zDepth={1}>For Employees</Paper>
                <RaisedButton
                  label="Submit A New Request"
                  labelPosition="before"
                  style={buttonStyle}
                  icon={<ActionReceipt />}
                  primary
                  onTouchTap={this.submitRequest}
                />
                <br />
                <RaisedButton
                  label="View My Requests"
                  labelPosition="before"
                  style={buttonStyle}
                  icon={<Description />}
                  primary
                  onTouchTap={this.viewRequests}
                />
                <br />
                <RaisedButton
                  label="Generate Monthly Report"
                  labelPosition="before"
                  style={buttonStyle}
                  icon={<Assignment />}
                  secondary
                  onTouchTap={this.submitReport}
                />
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} >
                <Paper style={paperStyle} zDepth={1}>For Managers</Paper>
                <RaisedButton
                  label="Manage Projects"
                  labelPosition="before"
                  style={buttonStyle}
                  icon={<DeveloperBoard />}
                  primary
                />
                <br />
                <RaisedButton
                  label="Manage Requests"
                  labelPosition="before"
                  style={buttonStyle}
                  icon={<ViewList />}
                  secondary
                  onTouchTap={this.manageRequests}
                />
              </Col>
            </Row>
          </Grid>
        </div>
        */

module.exports = UserDashboard;
