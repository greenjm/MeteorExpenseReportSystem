import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { TableRow, TableRowColumn }
  from 'material-ui/Table';
import { hashHistory } from 'react-router';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import '../../api/projects/projects.js';
import Header from './header.jsx';

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
    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      Meteor.subscribe('projectGet', this.state.projectId, () => {
        const project = Projects.findOne(this.state.projectId);
        this.setState({
          Name: project.name,
          Managers: project.managers,
          ManagerNames: this.getNames(project.managers),
          Employees: project.employees,
          EmployeeNames: this.getNames(project.employees),
          BornOn: project.bornOn.toString(),
          Active: !!project.isActive,
        });
        Meteor.subscribe('users', () => {
          this.setState({ allEmployees: Meteor.users.find().fetch() });
        });
      });
    });
  },

  getNames(people) {
    const ans = [];

    if (people) {
      for (let x = 0; x < people.length; x += 1) {
        Meteor.call('users.getOne', people[x], (err, res) => {
          ans.push(res.profile.name);
        });
      }
    }

    return ans;
  },

  createUserRow(item) {
    return (
      <TableRow key={item._id} selectable={false}>
        <TableRowColumn>{item.profile.name}</TableRowColumn>
      </TableRow>);
  },

  // State Bindings
  toggleActive() {
    const toggled = this.state.Active;
    this.setState({ Active: !toggled });
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
      Meteor.call('projects.addEmployee', this.state.projectId, selected, (err) => {
        if (!err) {
          this.setState({ Employees: arrIds, EmployeeNames: arrNames });
        }
      });
    });
  },

  cancelEdit() {
    hashHistory.push('/dashboard');
  },

  render() {
    return (
      <div>
        <Header />
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
                  />
                  <SelectField
                    floatingLabelText="Add Employee"
                    value={this.state.employeeSelected}
                    onChange={this.handleEmployeeSelect}
                    errorText={this.state.employeeSelectedError}
                    fullWidth
                  >
                    {this.state.allEmployees.map(this.createEmployeeMenuItem)}
                  </SelectField>
                  <div style={{ color: 'red' }}>{this.state.dialogError}</div>
                  <div style={{ float: 'right', margin: '10px' }}>
                    <FlatButton label="Cancel" onTouchTap={this.cancelEdit} />
                    <FlatButton type="submit" label="Submit" primary />
                  </div>
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
