import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import { hashHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import Header from './header.jsx';

/* global Projects:true*/
/* eslint no-undef: "error"*/

const React = require('react');

// Subscriptions
const projectSub = Meteor.subscribe('projects');

// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const SubmitRequest = React.createClass({
  getInitialState() {
    return {
      projects: [],
      projectSelected: '',
      projectSelectedError: '',
      description: '',
      descriptionError: '',
      estimatedCost: '',
      estimatedCostError: '',
      vendor: '',
      vendorError: '',
      qty: '',
      qtyError: '',
      unitCost: '',
      unitCostError: '',
      partNum: '',
      partNumError: '',
    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      const user = Meteor.user();
      const profileExists = user && user.profile;
      if (profileExists) {
        this.setState({ name: user.profile.name });
      }
      if (projectSub.ready()) {
        const projects = Projects.find({ employees: Meteor.userId() }).fetch();
        this.setState({ projects });
      }
    });
  },

  cancelRequest() {
    hashHistory.push('/dashboard');
  },

  submitRequest() {
    this.setState({ projectSelected: '' });
  },

  // Project select methods
  handleProjectSelect(event, index, value) {
    this.setState({ projectSelected: value, projectSelectedError: '' });
  },

  createProjectMenuItem(item) {
    return (
      <MenuItem value={item._id} primaryText={item.name} />
    );
  },

  // Description methods
  handleDescriptionChange(event) {
    this.setState({ description: event.target.value, descriptionError: '' });
  },

  // Estimated cost methods
  handleEstimateChange(event) {
    this.setState({ estimatedCost: event.target.value, estimatedCostError: '' });
  },

  // Vendor methods
  handleVendorChange(event) {
    this.setState({ vendor: event.target.value, vendorError: '' });
  },

  // Quantity methods
  handleQtyChange(event) {
    this.setState({ qty: event.target.value, qtyError: '' });
  },

  // Unit cost methods
  handleUnitCostChange(event) {
    this.setState({ unitCost: event.target.value, unitCostError: '' });
  },

  // Part number methods
  handlePartNumChange(event) {
    this.setState({ partNum: event.target.value, partNumError: '' });
  },

  render() {
    return (
      <div>
        <Header />
        <Paper style={paperStyle} zDepth={1}>Submit a new Request</Paper>
        <br />
        <br />
        <div>
          <Grid>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Paper style={{ textAlign: 'center' }} zDepth={1}>
                  <form onSubmit={this.submitRequest}>
                    <SelectField
                      floatingLabelText="Select Project"
                      value={this.state.projectSelected}
                      onChange={this.handleProjectSelect}
                      errorText={this.state.projectSelectedError}
                      fullWidth
                    >
                      {this.state.projects.map(this.createProjectMenuItem)}
                    </SelectField>
                    <TextField
                      hintText="Description"
                      value={this.state.description}
                      onChange={this.handleDescriptionChange}
                      errorText={this.state.descriptionError}
                      fullWidth
                    />
                    <TextField
                      hintText="Estimated Cost"
                      value={this.state.estimatedCost}
                      onChange={this.handleEstimateChange}
                      errorText={this.state.estimatedCostError}
                      fullWidth
                    />
                    <TextField
                      hintText="Vendor Name"
                      value={this.state.vendor}
                      onChange={this.handleVendorChange}
                      errorText={this.state.vendorError}
                      fullWidth
                    />
                    <TextField
                      hintText="Quantity"
                      value={this.state.qty}
                      onChange={this.handleQtyChange}
                      errorText={this.state.qtyError}
                      fullWidth
                    />
                    <TextField
                      hintText="Unit Cost"
                      value={this.state.unitCost}
                      onChange={this.handleUnitCostChange}
                      errorText={this.state.unitCostError}
                      fullWidth
                    />
                    <TextField
                      hintText="Part No."
                      value={this.state.partNum}
                      onChange={this.handlePartNumChange}
                      errorText={this.state.partNumError}
                      fullWidth
                    />
                    <div style={{ float: 'right' }}>
                      <FlatButton label="Cancel" onTouchTap={this.cancelRequest} />
                      <FlatButton type="submit" label="Submit" primary />
                    </div>
                  </form>
                </Paper>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
      );
  },
});

module.exports = SubmitRequest;
