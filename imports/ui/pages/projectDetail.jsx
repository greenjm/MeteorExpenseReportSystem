import { Meteor } from 'meteor/meteor';
import { hashHistory } from 'react-router';
import { Tracker } from 'meteor/tracker';
import { TableRow, TableRowColumn }
  from 'material-ui/Table';
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
      projectId: this.props.location.query.id,
      Name: '',
      Managers: [],
      ManagerNames: [],
      Employees: [],
      EmployeeNames: [],
      BornOn: '',
      Active: '',
      allEmployees: [],
      nameError: '',
      employeeSelected: '',
      employeeSelectedError: '',
      mode: 'view',
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user || (!nextProps.isAdmin && nextProps.mode === 'edit')) {
      hashHistory.push('/');
    }

    const nameChange = this.state.Name !== nextProps.name;
    const managersChange = this.state.Managers !== nextProps.managers;
    const employeesChange = this.state.Employees !== nextProps.employees;
    const bornOnChange = this.state.BornOn !== nextProps.bornOn;
    const activeChange = this.state.Active !== nextProps.isActive;
    const allEmployeeChange = this.state.allEmployees !== nextProps.users;

    if (managersChange) {
      this.getNames(nextProps.managers, 'ManagerNames');
    }
    if (employeesChange) {
      this.getNames(nextProps.employees, 'EmployeeNames');
    }

    this.setState({
      Name: nameChange ? nextProps.name : this.state.Name,
      Managers: managersChange ? nextProps.managers : this.state.Managers,
      Employees: employeesChange ? nextProps.employees : this.state.Employees,
      BornOn: bornOnChange ? nextProps.bornOn.toString() : this.state.BornOn,
      Active: activeChange ? nextProps.isActive : this.state.Active,
      allEmployees: allEmployeeChange ? nextProps.users : this.state.allEmployees,
      mode: nextProps.mode,
    });
  },

  getNames(people, stateField) {
    const ans = [];
    const thisClass = this;

    if (people) {
      for (let x = 0; x < people.length; x += 1) {
        Meteor.call('users.getOne', people[x], (err, res) => {
          ans.push(res.profile.name);
          const obj = {};
          obj[stateField] = ans;
          thisClass.setState(obj);
        });
      }
    }
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

  handleEmployeeSelect(event, index, value) {
    this.setState({ employeeSelected: value, employeeSelectedError: '' });
  },

  editProject() {
    if (this.state.Active) {
      Tracker.autorun(() => {
        Meteor.call('projects.activate', this.state.projectId);
      });
    } else {
      Tracker.autorun(() => {
        Meteor.call('projects.deactivate', this.state.projectId);
      });
    }

    if (this.state.employeeSelected) {
      this.addEmployee();
    }

    Tracker.autorun(() => {
      Meteor.call('projects.editName', this.state.projectId, this.state.Name);
    });
  },

  createEmployeeMenuItem(item) {
    return (
      <MenuItem value={item._id} primaryText={item.profile.name} key={item._id} />
    );
  },

  addEmployee() {
    const selected = this.state.employeeSelected;
    let index = -1;

    for (let x = 0; x < this.state.allEmployees.length; x += 1) {
      if (selected === this.state.allEmployees[x]._id) {
        index = x;
        break;
      }
    }

    const arrIds = this.state.Employees.slice();
    const arrNames = this.state.EmployeeNames.slice();

    arrIds.push(this.state.allEmployees[index].profile._id);
    arrNames.push(this.state.allEmployees[index].profile.name);

    Tracker.autorun(() => {
      Meteor.call('projects.addEmployee', this.state.projectId, this.state.allEmployees[index]._id, (err) => {
        if (!err) {
          this.setState({ Employees: arrIds, EmployeeNames: arrNames });
        }
      });
    });
  },

  cancelEdit() {
    hashHistory.push('/adminDashboard');
  },

  render() {
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
                    hintText="Name"
                    value={this.state.Name}
                    onChange={this.changeName}
                    errorText={this.state.nameError}
                    fullWidth
                    readOnly={this.state.mode === 'view'}
                  />
                  <TextField
                    hintText="Managers"
                    value={this.state.ManagerNames.join(', ')}
                    fullWidth
                    readOnly
                  />
                  <TextField
                    hintText="Employees"
                    value={this.state.EmployeeNames.join(', ')}
                    fullWidth
                    readOnly
                  />
                  <TextField
                    hintText="Start Date"
                    value={this.state.BornOn}
                    fullWidth
                    readOnly
                  />
                  <Checkbox
                    label="Active"
                    checked={!!this.state.Active}
                    onClick={this.toggleActive}
                    disabled={this.state.mode === 'view'}
                  />
                  <SelectField
                    floatingLabelText="Add Employee"
                    value={this.state.employeeSelected}
                    onChange={this.handleEmployeeSelect}
                    errorText={this.state.employeeSelectedError}
                    fullWidth
                    disabled={this.state.mode === 'view'}
                  >
                    {this.state.allEmployees.map(this.createEmployeeMenuItem)}
                  </SelectField>
                  <div style={{ color: 'red' }}>{this.state.dialogError}</div>
                  { this.state.mode === 'edit' &&
                    <div style={{ float: 'right', margin: '10px' }}>
                      <FlatButton label="Cancel" onTouchTap={this.cancelEdit} />
                      <FlatButton type="submit" label="Submit" primary />
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
