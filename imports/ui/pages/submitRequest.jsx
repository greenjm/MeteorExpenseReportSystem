import { Meteor } from 'meteor/meteor';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import { hashHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Header from '../components/header.jsx';

const React = require('react');

// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const SubmitRequest = React.createClass({
  propTypes: {
    breadcrumbs: React.PropTypes.array,
    project: React.PropTypes.object,
    isAdmin: React.PropTypes.bool,
    projects: React.PropTypes.array,
  },

  getInitialState() {
    return {
      breadcrumbs: [],
      project: {},
      projects: [],
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
      dialogError: '',
      // projectType: '',
      // projectTypeError: '',
      dateRequired: '',
      dateRequiredError: '',
      intendedUsage: '',
      intendedUsageError: '',
      successfulSubmission: false,
    };
  },

  componentWillMount() {
    this.setState({
      breadcrumbs: this.props.breadcrumbs,
      project: this.props.project,
      projects: this.props.projects,
    });
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user) {
      hashHistory.push('/');
    }

    const projectChange = this.state.project !== nextProps.project;
    const projectsChange = this.state.projects !== nextProps.projects;
    this.setState({
      project: projectChange ? nextProps.project : this.state.project,
      projects: projectsChange ? nextProps.projects : this.state.projects,
      breadcrumbs: nextProps.breadcrumbs,
    });
  },

  createBreadcrumb(item) {
    return (
      <li><a href={item.url}>{item.page}</a></li>
    );
  },

  cancelRequest() {
    hashHistory.push('/dashboard');
  },

  submitRequest(e) {
    e.preventDefault();

    this.setState({ dialogError: '' });

    const requiredError = 'This field is required.';
    const numError = 'You must enter a number.';
    let hasError = false;

    if (this.state.description === '') {
      this.descriptionError(requiredError);
      hasError = true;
    }

    const estimatedCostNum = +this.state.estimatedCost;
    if (this.state.estimatedCost === '') {
      this.estimateError(requiredError);
      hasError = true;
    } else if (isNaN(estimatedCostNum)) {
      this.estimateError(numError);
      hasError = true;
    }

    if (this.state.vendor === '') {
      this.vendorError(requiredError);
      hasError = true;
    }

    if (this.state.projectType === '') {
      this.projectTypeError(requiredError);
      hasError = true;
    }

    if (this.state.dateRequired === '') {
      this.dateRequiredError(requiredError);
      hasError = true;
    }

    if (this.state.intendedUsage === '') {
      this.intendedUsageError(requiredError);
      hasError = true;
    }

    const qtyNum = +this.state.qty;
    if (this.state.qty === '') {
      this.qtyError(requiredError);
      hasError = true;
    } else if (isNaN(qtyNum)) {
      this.qtyError(numError);
      hasError = true;
    }

    const unitCostNum = +this.state.unitCost;
    if (this.state.unitCost === '') {
      this.unitCostError(requiredError);
      hasError = true;
    } else if (isNaN(unitCostNum)) {
      this.unitCostError(numError);
      hasError = true;
    }

    if (this.state.partNum === '') {
      this.partNumError(requiredError);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    Meteor.call('requests.create', this.state.project._id,
      this.state.description,
      +estimatedCostNum.toFixed(2),
      this.state.vendor,
      this.state.partNum,
      qtyNum,
      +unitCostNum.toFixed(2),
      this.state.dateRequired,
      this.state.intendedUsage,
      (error, result) => {
        if (error != null) {
          this.setState({ dialogError: `Error: ${error.error}. Reason: ${error.reason}` });
        } else {
          setTimeout(this.goToDashboard, 2000);
          Meteor.call('notifications.createHelper', this.state.project.name,
            this.state.project.managers,
            result,
          //   (error) => {
          //     if (error != null) {
          //       this.setState({ dialogError: `Error: ${error.error}. ${error.reason}` });
          //       return;
          //     }
          //       return;
          // }
          );
          this.setState({
            description: '',
            estimatedCost: '',
            vendor: '',
            partNum: '',
            qty: '',
            unitCost: '',
            snackbarOpen: true,
            successfulSubmission: true,
          });
          // setTimeout(this.goToDashboard, 2000);
        }
      });
  },

  // State Bindings
  // Description methods
  handleDescriptionChange(event) {
    this.setState({ description: event.target.value, descriptionError: '' });
  },

  descriptionError(err) {
    this.setState({ descriptionError: err });
  },

  // Estimated cost methods
  handleEstimateChange(event) {
    this.setState({ estimatedCost: event.target.value, estimatedCostError: '' });
  },

  estimateError(err) {
    this.setState({ estimatedCostError: err });
  },

  // Vendor methods
  handleVendorChange(event) {
    this.setState({ vendor: event.target.value, vendorError: '' });
  },

  vendorError(err) {
    this.setState({ vendorError: err });
  },

  // Quantity methods
  handleQtyChange(event) {
    const newState = {};

    if (this.state.unitCost) {
      newState.estimatedCost = this.state.unitCost * event.target.value;
    }

    newState.qty = event.target.value;
    newState.qtyError = '';

    this.setState(newState);
  },

  qtyError(err) {
    this.setState({ qtyError: err });
  },

  // Unit cost methods
  handleUnitCostChange(event) {
    const newState = {};

    if (this.state.qty) {
      newState.estimatedCost = this.state.qty * event.target.value;
    }

    newState.unitCost = event.target.value;
    newState.unitCostError = '';

    this.setState(newState);
  },

  unitCostError(err) {
    this.setState({ unitCostError: err });
  },

  // Part number methods
  handlePartNumChange(event) {
    this.setState({ partNum: event.target.value, partNumError: '' });
  },

  partNumError(err) {
    this.setState({ partNumError: err });
  },

  // Project Type methods
  // handleProjectTypeChange(event) {
  //   this.setState({ projectType: event.target.value, projectTypeError: '' });
  // },

  // projectTypeError(err) {
  //   this.setState({ projectTypeError: err });
  // },

  // Date Required methods
  handleDateRequiredChange(event) {
    this.setState({ dateRequired: event.target.value, dateRequiredError: '' });
  },

  dateRequiredError(err) {
    this.setState({ dateRequiredError: err });
  },

  // Intended Usage methods
  handleIntendedUsageChange(event) {
    this.setState({ intendedUsage: event.target.value, intendedUsageError: '' });
  },

  intendedUsageError(err) {
    this.setState({ intendedUsageError: err });
  },

  goToDashboard() {
    hashHistory.push('/dashboard');
  },

  createProjectItem(item) {
    return (<MenuItem value={item._id} key={item._id} primaryText={item.name} />);
  },

  handleProjectChange(event, index) {
    this.setState({ project: this.state.projects[index] });
  },

  render() {
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
        <div>
          <Grid>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Paper style={{ textAlign: 'center', padding: '10px' }} zDepth={1}>
                  {!this.state.successfulSubmission && (
                    <form onSubmit={this.submitRequest}>
                      {!!this.state.project.name && (
                        <TextField
                          readOnly
                          value={this.state.project.name}
                          floatingLabelText="Project Name"
                          fullWidth
                        />
                      )}
                      {!this.state.project.name && (
                        <SelectField
                          floatingLabelText="Project Name"
                          value={this.state.project}
                          onChange={this.handleProjectChange}
                          style={{ float: 'left' }}
                          floatingLabelStyle={{ fontSize: '20px', marginLeft: '-129px' }}
                        >
                          {this.state.projects.map(this.createProjectItem)}
                        </SelectField>
                      )}
                      <TextField
                        floatingLabelText="Vendor Name, Address, Phone Number & Website (if applicable)"
                        value={this.state.vendor}
                        onChange={this.handleVendorChange}
                        errorText={this.state.vendorError}
                        fullWidth
                      />
                      <TextField
                        floatingLabelText="Description"
                        value={this.state.description}
                        onChange={this.handleDescriptionChange}
                        errorText={this.state.descriptionError}
                        fullWidth
                      />
                      <TextField
                        floatingLabelText="Part Number"
                        value={this.state.partNum}
                        onChange={this.handlePartNumChange}
                        errorText={this.state.partNumError}
                        fullWidth
                      />
                      <TextField
                        floatingLabelText="Quantity"
                        value={this.state.qty}
                        onChange={this.handleQtyChange}
                        errorText={this.state.qtyError}
                        fullWidth
                      />
                      <TextField
                        floatingLabelText="Unit Cost"
                        value={this.state.unitCost.toFixed(2)}
                        onChange={this.handleUnitCostChange}
                        errorText={this.state.unitCostError}
                        fullWidth
                      />
                      <TextField
                        floatingLabelText="Date Required"
                        value={this.state.dateRequired}
                        onChange={this.handleDateRequiredChange}
                        errorText={this.state.dateRequiredError}
                        fullWidth
                      />
                      <TextField
                        floatingLabelText="Intended Program Usage"
                        value={this.state.intendedUsage}
                        onChange={this.handleIntendedUsageChange}
                        errorText={this.state.intendedUsageError}
                        fullWidth
                      />
                      <TextField
                        floatingLabelText="Total Cost"
                        value={this.state.estimatedCost.toFixed(2)}
                        onChange={this.handleEstimateChange}
                        fullWidth
                        readOnly
                      />
                      <div style={{ color: 'red' }}>{this.state.dialogError}</div>
                      <div style={{ float: 'right', margin: '10px' }}>
                        <FlatButton label="Cancel" onTouchTap={this.cancelRequest} />
                        <FlatButton type="submit" label="Submit" primary />
                      </div>
                    </form>
                  )}
                  {this.state.successfulSubmission && (
                    <div>
                      <div>Your request has been successfully submitted.</div>
                      <br />
                      <CircularProgress size={50} />
                    </div>
                  )}
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
