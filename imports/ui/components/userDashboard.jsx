import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import { hashHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import ActionReceipt from 'material-ui/svg-icons/action/receipt';
import Description from 'material-ui/svg-icons/action/description';
import Assignment from 'material-ui/svg-icons/action/assignment';
import DeveloperBoard from 'material-ui/svg-icons/hardware/developer-board';
import ViewList from 'material-ui/svg-icons/action/view-list';
import Header from './header.jsx';

const React = require('react');

// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const leftColStyle = {
  borderRight: '2px solid grey',
};

const buttonStyle = {
  width: '100%',
  fontSize: '2em',
  marginTop: '10px',
  height: '50px',
};

const UserDashboard = React.createClass({
  getInitialState() {
    return {
      name: '',
    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      const user = Meteor.user();
      const profileExists = user && user.profile;
      if (profileExists) {
        this.setState({ name: user.profile.name });
      }
    });
  },

  submitRequest() {
    hashHistory.push('/submitRequest');
  },

<<<<<<< HEAD
  manageRequests() {
    hashHistory.push('/manageRequests');
=======
  viewRequests() {
    hashHistory.push('/viewRequests');
  },

  submitReport() {
    hashHistory.push('/submitReport');
>>>>>>> 0bbe2bcc8bc9cd902e8078a3f12f429001853d25
  },

  render() {
    return (
      <div>
        <Header />
        <Paper style={paperStyle} zDepth={1}>User Dashboard</Paper>
        <br />
        <br />
        <div>
          <Grid>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Paper
                  style={paperStyle}
                  zDepth={2}
                >
                  Welcome, {this.state.name}
                </Paper>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col xs={12} sm={12} md={6} lg={6} style={leftColStyle}>
                <Paper style={paperStyle} zDepth={1}>For Employees</Paper>
                <RaisedButton
                  label="Submit A New Request"
                  labelPosition="before"
                  style={buttonStyle}
                  icon={<ActionReceipt />}
                  primary
                  onTouchTap={this.submitRequest}
                />
                <br />
                <RaisedButton
                  label="View My Requests"
                  labelPosition="before"
                  style={buttonStyle}
                  icon={<Description />}
                  primary
                  onTouchTap={this.viewRequests}
                />
                <br />
                <RaisedButton
                  label="Generate Monthly Report"
                  labelPosition="before"
                  style={buttonStyle}
                  icon={<Assignment />}
                  secondary
                  onTouchTap={this.submitReport}
                />
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} >
                <Paper style={paperStyle} zDepth={1}>For Managers</Paper>
                <RaisedButton
                  label="Manage Projects"
                  labelPosition="before"
                  style={buttonStyle}
                  icon={<DeveloperBoard />}
                  primary
                />
                <br />
                <RaisedButton
                  label="Manage Requests"
                  labelPosition="before"
                  style={buttonStyle}
                  icon={<ViewList />}
                  secondary
                  onTouchTap={this.manageRequests}
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
      );
  },
});

module.exports = UserDashboard;
