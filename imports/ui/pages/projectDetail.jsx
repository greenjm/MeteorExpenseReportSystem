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
import CircularProgress from 'material-ui/CircularProgress';
import '../../api/projects/projects.js';
import Header from '../components/header.jsx';


/* global Projects:true*/
/* eslint no-undef: "error"*/

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
      breadcrumbs: [],
      projectId: '',
      Name: '',
      inactiveDate: null,
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
      successfulSubmission: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user || (!nextProps.isAdmin && nextProps.mode === 'edit')) {
      hashHistory.push('/');
    }

    const projectIdChange = this.state.projectId !== nextProps.projectId;
    const nameChange = this.state.Name !== nextProps.name;
    const employeesChange = this.state.Employees !== nextProps.employees;
    const bornOnChange = this.state.BornOn !== nextProps.bornOn;
    const activeChange = this.state.Active !== nextProps.active;
    const allEmployeeChange = this.state.allEmployees !== nextProps.users;
    const inactiveDateChange = this.state.inactiveDate !== nextProps.inactiveDate;

    this.setState({
      projectId: projectIdChange ? nextProps.projectId : this.state.projectId,
      Name: nameChange ? nextProps.name : this.state.Name,
      Employees: employeesChange ? nextProps.employees : this.state.Employees,
      BornOn: bornOnChange ? nextProps.bornOn.toString() : this.state.BornOn,
      Active: activeChange ? nextProps.active : this.state.Active,
      users: allEmployeeChange ? nextProps.users : this.state.users,
      inactiveDate: inactiveDateChange ? nextProps.inactiveDate : this.state.inactiveDate,
      mode: nextProps.mode,
      breadcrumbs: nextProps.breadcrumbs,
    });
  },

  createBreadcrumb(item) {
    return (
      <li><a href={item.url}>{item.page}</a></li>
    );
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
    employees.push({ isManager: false, item: selected[0] });
    this.setState({ users, Employees: employees });
  },

  editProject(e) {
    e.preventDefault();
    if (this.state.Name === '') {
      this.setState({ nameError: 'This field is required.' });
      return;
    }
    const employees = [];
    const managers = [];
    for (let i = 0; i < this.state.Employees.length; i += 1) {
      const item = this.state.Employees[i];
      employees.push(item.item);
      if (item.isManager) {
        managers.push(item.item);
      }
    }
    Meteor.call('projects.edit', this.state.projectId,
      this.state.Name,
      !!this.state.Active,
      employees,
      managers,
      (err) => {
        if (err != null) {
          this.setState({ dialogError: `Error: ${err.error}. Reason: ${err.reason}` });
        } else {
          setTimeout(this.dismissSpinner, 2000);
          this.setState({ successfulSubmission: true });
        }
      }
    );
  },

  dismissSpinner() {
    this.setState({ successfulSubmission: false });
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
    const leftIcon = (
      <Checkbox
        checked={item.isManager}
        onCheck={() => { this.toggleIsManager(index); }}
        disabled={this.state.mode === 'view'}
      />
    );
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
        leftCheckbox={leftIcon}
        rightIconButton={this.state.mode === 'edit' ? rightIcon : null}
        primaryText={item.item.profile.name}
      />
    );
  },

  removeProjectEmployee(index) {
    const users = this.state.users;
    const employees = this.state.Employees;
    const removed = employees.splice(index, 1);
    users.push(removed[0].item);
    this.setState({ users, Employees: employees });
  },

  toggleIsManager(index) {
    const employees = this.state.Employees;
    employees[index].isManager = !employees[index].isManager;
    this.setState({ Employees: employees });
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
        <Paper style={paperStyle} zDepth={1}>
          <ul className="breadcrumb">
            {this.state.breadcrumbs.map(this.createBreadcrumb)}
          </ul>
        </Paper>
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
                  <SelectField
                    floatingLabelText="Add Employee"
                    style={{ float: 'right' }}
                    onChange={this.handleEmployeeSelect}
                    disabled={this.state.mode === 'view'}
                    fullWidth
                  >
                    {this.state.users.map(this.createEmployeeMenuItem)}
                  </SelectField>
                  <br /><br /><br />
                  <List style={{ textAlign: 'left' }}>
                    {this.state.Employees.map(this.createEmployeeListItem)}
                  </List>
                  <div style={{ color: 'red' }}>{this.state.dialogError}</div>
                  {this.state.successfulSubmission && (
                    <div>
                      <div style={{ display: 'inline-block' }}>Your project was updated successfully. </div>
                      <CircularProgress size={20} style={{ margin: '3px' }} />
                    </div>
                  )}
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
