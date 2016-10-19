import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import '../../api/projects/projects.js';
import Paper from 'material-ui/Paper';
import Header from './header.jsx';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


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

const tableHeaderButtonStyle = {
  float: 'right',
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
    	<Header />
	    <Paper style={paperStyle} zDepth={1}>Project Details</Paper>
	    <br />
	    
		<div>
          <Grid>
          <Row>
          	<Table selectable={false}>
          	<TableHeader displaySelectAll={false}>
          		<TableRow selectable={false}>
                  <TableHeaderColumn style={{ textAlign: 'center' }}>
                    <div>
	    <label htmlFor="name">Name:</label>
        <input name="name" type="text" value={this.state.Name} onChange={this.changeName} />
        <p>Start Date: {this.state.BornOn}</p>
	    </div>
                  </TableHeaderColumn>
                </TableRow>
          	</TableHeader>
          	</Table>
          </Row>
            <Row>
              <Col xs={12} sm={12} md={6} lg={6}>
              <Table
                  selectable={false}
                >
			<TableHeader displaySelectAll={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn style={{ textAlign: 'center' }}>
                    Users
                  </TableHeaderColumn>
                </TableRow>
                <TableRow selectable={false}>
                  <TableHeaderColumn>Manager: {this.state.Managers.join(', ')}</TableHeaderColumn>
                </TableRow>
				<TableRow selectable={false}>
                  <TableHeaderColumn>Employees: {this.state.Employees.join(', ')}</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                showRowHover
                displayRowCheckbox={false}
              >
              <div>
              <label htmlFor="active">Active:</label>
        <input name="active" type="checkbox" checked={this.state.Active} onClick={this.toggleActive} />

              	<br /><br />
		        <select id="employeeList">
		          {this.state.allEmployees.map(this.showEmployee)}
		        </select>
		        <br />
		        <button onClick={this.addEmployee}>Add Employee</button>

		        <br /><br />
		        <button onClick={this.editProject}>Save Changes</button>
              </div>
              </TableBody>
            </Table>
          </Col>
      </Row>
      </Grid>
      </div>
      </div>
    );
  },
});
                    // {this.state.users.map(this.createUserRow)}

module.exports = ProjectDetail;


// <div className="dashboard">
//         <label htmlFor="name">Name:</label>
//         <input name="name" type="text" value={this.state.Name} onChange={this.changeName} />

//         <p>Managers: {this.state.Managers.join(', ')}</p>
//         <p>Employees: {this.state.Employees.join(', ')}</p>

//         <p>Start Date: {this.state.BornOn}</p>

//         <label htmlFor="active">Active:</label>
//         <input name="active" type="checkbox" checked={this.state.Active} onClick={this.toggleActive} />

//         <br /><br />
//         <select id="employeeList">
//           {this.state.allEmployees.map(this.showEmployee)}
//         </select>
//         <br />
//         <button onClick={this.addEmployee}>Add Employee</button>

//         <br /><br />
//         <button onClick={this.editProject}>Save Changes</button>
//       </div>