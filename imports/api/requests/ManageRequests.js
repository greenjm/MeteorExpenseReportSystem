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

const ManageRequests = React.createClass({
  getInitialState() {
    return {
      requests: [],

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

  manageRequests() {
    this.setState({ dialogError: ''});
  },

  render() {
    return (
      <div>
        <Header />
        <Paper style={paperStyle} zDepth={1}>Manage Requests</Paper>
      </div>
      );
  },
});

module.exports = ManageRequests;