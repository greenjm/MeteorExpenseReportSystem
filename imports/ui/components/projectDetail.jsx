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
      Employees: [],
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
          Employees: project.employees,
          BornOn: project.bornOn.toString(),
          Active: !!project.isActive,
        });
        Meteor.subscribe('users', () => {
          console.log(Meteor.users.find().fetch());
          this.setState({ allEmployees: Meteor.users.find().fetch() });
        });
      });
    });
  },

  createUserRow(item) {
    return (
      <TableRow key={item._id} selectable={false}>
        <TableRowColumn>{item.profile.name}</TableRowColumn>
      </TableRow>);
  },

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
        Meteor.call('projects.activate', this.state.projectId, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    } else {
      Tracker.autorun(() => {
        Meteor.call('projects.deactivate', this.state.projectId, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    }

    Tracker.autorun(() => {
      Meteor.call('projects.editName', this.state.projectId, this.state.Name, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  },

  createEmployeeMenuItem(item) {
    return (
      <MenuItem value={item.profile.name} primaryText={item.name} key={item._id} />
    );
  },

  addEmployee() {
    const selected = this.state.employeeSelected;
    const arr = this.state.Employees.slice();
    arr.push(selected.profile.name);

    Tracker.autorun(() => {
      Meteor.call('projects.addEmployee', this.state.projectId, this.state.allEmployees[index]._id, (err) => {
        if (err) {
          console.log(err);
        } else {
          this.setState({ Employees: arr });
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
                <form onSubmit={this.submitRequest}>
                  <TextField
                    hintText="Name"
                    value={this.state.Name}
                    onChange={this.changeName}
                    errorText={this.state.nameError}
                    fullWidth
                  />
                  <TextField
                    hintText="Managers"
                    value={this.state.Managers.join(', ')}
                    fullWidth
                    readOnly
                  />
                  <TextField
                    hintText="Employees"
                    value={this.state.Employees.join(', ')}
                    fullWidth
                    readOnly
                  />
                  <TextField
                    hintText="Start Date"
                    value={this.state.BornOn}
                    fullWidth
                  />
                  <Checkbox
                    label="Active"
                    checked={!!this.state.Active}
                  />
                  <SelectField
                    floatingLabelText="Add Employee"
                    value={this.state.employeeSelected}
                    onChange={this.addEmployee}
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
