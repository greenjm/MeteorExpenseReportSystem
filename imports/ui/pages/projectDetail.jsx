import { Meteor } from 'meteor/meteor';
import { hashHistory } from 'react-router';
import { Tracker } from 'meteor/tracker';
import { Table, TableHeader, TableRow, TableRowColumn }
  from 'material-ui/Table';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import Paper from 'material-ui/Paper';
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
      projectId: this.props.location.query.id,
      Name: '',
      Managers: [],
      Employees: [],
      BornOn: '',
      Active: '',
      allEmployees: [],
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user || !nextProps.isAdmin) {
      hashHistory.push('/');
    }

    const nameChange = this.state.Name !== nextProps.name;
    const managersChange = this.state.Managers !== nextProps.manager;
    const employeesChange = this.state.Employees !== nextProps.employees;
    const bornOnChange = this.state.BornOn !== nextProps.bornOn;
    const activeChange = this.state.Active !== nextProps.isActive;
    const allEmployeeChange = this.state.allEmployees !== nextProps.users;
    this.setState({
      Name: nameChange ? nextProps.name : this.state.Name,
      Managers: managersChange ? nextProps.managers : this.state.Managers,
      Employees: employeesChange ? nextProps.employees : this.state.Employees,
      BornOn: bornOnChange ? nextProps.bornOn.toString() : this.state.BornOn,
      Active: activeChange ? nextProps.isActive : this.state.Active,
      allEmployees: allEmployeeChange ? nextProps.users : this.state.allEmployees,
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

  showEmployee(item, i) {
    return (<option key={i}>{item.profile.name}</option>);
  },

  addEmployee() {
    const index = document.getElementById('employeeList').selectedIndex;
    const arr = this.state.Employees.slice();
    arr.push(this.state.allEmployees[index].profile.name);

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
              <Table>
                <TableHeader displaySelectAll={false}>
                  <TableRow>
                    <TableRowColumn>
                      <div>
                        <label htmlFor="name">Name: </label>
                        <input name="name" type="text" value={this.state.Name} onChange={this.changeName} />
                      </div>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <div>Managers: {this.state.Managers.join(', ')}</div>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>
                      <div>Employees: {this.state.Employees.join(', ')}</div>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>
                      <label htmlFor="active">Active: </label>
                      <input name="active" type="checkbox" checked={this.state.Active} onClick={this.toggleActive} />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>
                      <div>Start Date: {this.state.BornOn}</div>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>
                      <div>
                        Add Employees: <select id="employeeList">{this.state.allEmployees.map(this.showEmployee)}</select> <button onClick={this.addEmployee}>Add Employee</button>
                      </div>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>
                      <button onClick={this.editProject}>Save Changes</button>
                    </TableRowColumn>
                  </TableRow>
                </TableHeader>
              </Table>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
});

module.exports = ProjectDetail;
