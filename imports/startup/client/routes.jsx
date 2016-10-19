// This file is the router file for all possible pages.
// When you add a new page, import the component and give it a <Route> tag with the proper path.

import { Meteor } from 'meteor/meteor';
import { hashHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router').Router;
const Route = require('react-router').Route;
const Login = require('../../ui/components/login.jsx');
const AdminDashboard = require('../../ui/components/adminDashboard.jsx');
const Dashboard = require('../../ui/components/dashboard.jsx');
const ProjectDetail = require('../../ui/components/projectDetail.jsx');

Meteor.startup(() => {
  injectTapEventPlugin();
  ReactDOM.render((
    <MuiThemeProvider>
      <Router history={hashHistory}>
        <Route path="/adminDashboard" component={AdminDashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/project*" component={ProjectDetail} />
        <Route path="/" component={Login} />
      </Router>
    </MuiThemeProvider>
  ), document.getElementById('app'));
});
