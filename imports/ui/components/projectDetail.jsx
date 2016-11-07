import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Table, TableHeader, TableRow, TableRowColumn }
  from 'material-ui/Table';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import Paper from 'material-ui/Paper';
import '../../api/projects/projects.js';
import Header from './header.jsx';

/* global Projects:true*/
/* eslint no-undef: "error"*/

const React = require('react');

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
          ans.push(res.username);
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

  toggleActive() {
    this.setState({ Active: !this.state.Active });
  },

  changeName(event) {
    this.setState({ Name: event.target.value });
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

    Tracker.autorun(() => {
      Meteor.call('projects.editName', this.state.projectId, this.state.Name);
    });
  },

  showEmployee(item, i) {
    return (<option key={i}>{item.profile.name}</option>);
  },

  addEmployee() {
    const index = document.getElementById('employeeList').selectedIndex;
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
                      <div>Managers: {this.state.ManagerNames.join(', ')}</div>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>
                      <div>Employees: {this.state.EmployeeNames.join(', ')}</div>
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
