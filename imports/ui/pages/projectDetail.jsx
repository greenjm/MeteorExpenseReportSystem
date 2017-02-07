import { Meteor } from 'meteor/meteor';
import { hashHistory } from 'react-router';
import { TableRow, TableRowColumn }
  from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import { List, ListItem } from 'material-ui/List';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import '../../api/projects/projects.js';
import Header from '../components/header.jsx';


/* global Projects:true*/

const React = require('react');

// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const ProjectDetail = React.createClass({
  propTypes() {
    return {
      location: React.object,
    };
  },

  getInitialState() {
    return {
      projectId: '',
      Name: '',
      inactiveDate: null,
      Managers: [],
      ManagerNames: [],
      Employees: [],
      EmployeeNames: [],
      BornOn: '',
      Active: false,
      users: [],
      nameError: '',
      employeeSelected: '',
      employeeSelectedError: '',
      mode: 'view',
      dialogError: '',
      dialogSuccess: '',
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user || (!nextProps.isAdmin && nextProps.mode === 'edit')) {
      hashHistory.push('/');
    }

    const projectIdChange = this.state.projectId !== nextProps.projectId;
    const nameChange = this.state.Name !== nextProps.name;
    const managersChange = this.state.Managers !== nextProps.managers;
    const employeesChange = this.state.Employees !== nextProps.employees;
    const bornOnChange = this.state.BornOn !== nextProps.bornOn;
    const activeChange = this.state.Active !== nextProps.active;
    const allEmployeeChange = this.state.allEmployees !== nextProps.users;
    const inactiveDateChange = this.state.inactiveDate !== nextProps.inactiveDate;

    this.setState({
      projectId: projectIdChange ? nextProps.projectId : this.state.projectId,
      Name: nameChange ? nextProps.name : this.state.Name,
      Managers: managersChange ? nextProps.managers : this.state.Managers,
      Employees: employeesChange ? nextProps.employees : this.state.Employees,
      BornOn: bornOnChange ? nextProps.bornOn.toString() : this.state.BornOn,
      Active: activeChange ? nextProps.active : this.state.Active,
      users: allEmployeeChange ? nextProps.users : this.state.users,
      inactiveDate: inactiveDateChange ? nextProps.inactiveDate : this.state.inactiveDate,
      mode: nextProps.mode,
    });
  },

  createUserRow(item) {
    return (
      <TableRow key={item._id} selectable={false}>
        <TableRowColumn>{item.profile.name}</TableRowColumn>
      </TableRow>);
  },

  // State Bindings
  toggleActive() {
    this.setState({ Active: !this.state.Active });
  },

  changeName(event) {
    this.setState({ Name: event.target.value });
  },

  handleEmployeeSelect(event, index) {
    const users = this.state.users;
    const selected = users.splice(index, 1);
    const employees = this.state.Employees;
    employees.push(selected[0]);
    this.setState({ users, Employees: employees });
  },

  handleManagerSelect(event, index) {
    const users = this.state.users;
    const selected = users.splice(index, 1);
    const managers = this.state.Managers;
    managers.push(selected[0]);
    this.setState({ users, Managers: managers });
  },

  editProject(e) {
    e.preventDefault();
    if (this.state.Name === '') {
      this.setState({ nameError: 'This field is required.' });
      return;
    }
    Meteor.call('projects.edit', this.state.projectId,
      this.state.Name,
      !!this.state.Active,
      this.state.Employees,
      this.state.Managers,
      (err) => {
        if (err != null) {
          this.setState({ dialogError: `Error: ${err.error}. Reason: ${err.reason}` });
          return;
        }
        this.setState({ dialogSuccess: 'Project successfully updated.', dialogError: '' });

        this.closeProjectDialog();
      }
    );
  },

  createEmployeeMenuItem(item) {
    return (
      <MenuItem value={item._id} primaryText={item.profile.name} key={item._id} />
    );
  },

  cancelEdit() {
    hashHistory.push('/adminDashboard');
  },

  createEmployeeListItem(item, index) {
    const rightIcon = (
      <IconButton
        tooltip="remove"
        onTouchTap={() => { this.removeProjectEmployee(index); }}
      >
        <ContentClear />
      </IconButton>
    );
    return (
      <ListItem
        rightIconButton={this.state.mode === 'edit' ? rightIcon : null}
        primaryText={item.profile.name}
      />
    );
  },

  removeProjectEmployee(index) {
    const users = this.state.users;
    const employees = this.state.Employees;
    const removed = employees.splice(index, 1);
    users.push(removed[0]);
    this.setState({ users, selectedEmployees: employees });
  },

  createManagerListItem(item, index) {
    const rightIcon = (
      <IconButton
        tooltip="remove"
        onTouchTap={() => { this.removeProjectManager(index); }}
      >
        <ContentClear />
      </IconButton>
    );
    return (
      <ListItem
        rightIconButton={this.state.mode === 'edit' ? rightIcon : null}
        primaryText={item.profile.name}
      />
    );
  },

  removeProjectManager(index) {
    const users = this.state.users;
    const managers = this.state.Managers;
    const removed = managers.splice(index, 1);
    users.push(removed[0]);
    this.setState({ users, Managers: managers });
  },

  render() {
    const date = new Date(this.state.BornOn);
    let inactiveDate = this.state.inactiveDate;
    if (inactiveDate !== null) {
      inactiveDate = new Date(inactiveDate);
    }
    return (
      <div>
        <Header isAdmin={this.props.isAdmin} />
        <Paper style={paperStyle} zDepth={1}>Project Detail: {this.state.Name}</Paper>
        <br />
        <br />
        <Grid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Paper style={{ textAlign: 'center', padding: '10px' }} zDepth={1}>
                <form onSubmit={this.editProject}>
                  <TextField
                    floatingLabelText="Project Name"
                    hintText="Name"
                    value={this.state.Name}
                    onChange={this.changeName}
                    errorText={this.state.nameError}
                    fullWidth
                    readOnly={this.state.mode === 'view'}
                  />
                  <div style={{ textAlign: 'left' }} >
                    <p><strong>Date Created: </strong><span>{date.toDateString()}</span></p>
                  </div>
                  { inactiveDate !== null &&
                    <div style={{ textAlign: 'left' }} >
                      <p><strong>Date Inactivated: </strong>
                        <span>{inactiveDate.toDateString()}</span>
                      </p>
                    </div>
                  }
                  <Checkbox
                    label="Is Active?"
                    checked={!!this.state.Active}
                    onClick={this.toggleActive}
                    disabled={this.state.mode === 'view'}
                    style={{ textAlign: 'left' }}
                  />
                  <div style={{ display: 'inline' }} >
                    <SelectField
                      floatingLabelText="Add Employee"
                      style={{ float: 'right' }}
                      onChange={this.handleEmployeeSelect}
                      disabled={this.state.mode === 'view'}
                    >
                      {this.state.users.map(this.createEmployeeMenuItem)}
                    </SelectField>
                    <List style={{ width: '30%' }} >
                      <ListItem primaryText="Employees" style={{ fontWeight: 'bold' }} />
                      {this.state.Employees.map(this.createEmployeeListItem)}
                    </List>
                  </div>
                  <div style={{ display: 'inline' }} >
                    <SelectField
                      floatingLabelText="Add Manager"
                      onChange={this.handleManagerSelect}
                      style={{ float: 'right' }}
                      disabled={this.state.mode === 'view'}
                    >
                      {this.state.users.map(this.createEmployeeMenuItem)}
                    </SelectField>
                    <List style={{ width: '30%' }} >
                      <ListItem primaryText="Managers" style={{ fontWeight: 'bold' }} />
                      {this.state.Managers.map(this.createManagerListItem)}
                    </List>
                  </div>
                  <div style={{ color: 'red' }}>{this.state.dialogError}</div>
                  <div style={{ color: 'green' }}>{this.state.dialogSuccess}</div>
                  { this.state.mode === 'edit' &&
                    <div style={{ float: 'right', margin: '10px' }}>
                      <FlatButton label="Cancel" onTouchTap={this.cancelEdit} />
                      <FlatButton type="submit" label="Save" primary />
                    </div>
                  }
                </form>
              </Paper>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
});

module.exports = ProjectDetail;
