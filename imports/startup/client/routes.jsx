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
const ProjectDetail = require('../../ui/components/projectDetail.jsx');
const UserDashboard = require('../../ui/components/userDashboard.jsx');
const SubmitRequest = require('../../ui/components/submitRequest.jsx');

Meteor.startup(() => {
  injectTapEventPlugin();
  ReactDOM.render((
    <MuiThemeProvider>
      <Router history={hashHistory}>
        <Route path="/adminDashboard" component={AdminDashboard} />
        <Route path="/dashboard" component={UserDashboard} />
        <Route path="/project*" component={ProjectDetail} />
        <Route path="/" component={Login} />
        <Route path="/submitRequest" component={SubmitRequest} />
      </Router>
    </MuiThemeProvider>
  ), document.getElementById('app'));
});
