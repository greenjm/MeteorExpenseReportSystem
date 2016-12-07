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
const LoginContainer = require('../../ui/components/loginContainer.jsx');
const AdminDashboardContainer = require('../../ui/components/adminDashboardContainer.jsx');
const ProjectDetailContainer = require('../../ui/components/projectDetailContainer.jsx');
const UserDashboardContainer = require('../../ui/components/userDashboardContainer.jsx');
const SubmitRequestContainer = require('../../ui/components/submitRequestContainer.jsx');
const ViewRequestsContainer = require('../../ui/components/viewRequestsContainer.jsx');
const SubmitReportContainer = require('../../ui/components/submitReportContainer.jsx');
const RequestDetailContainer = require('../../ui/components/requestDetailContainer.jsx');

Meteor.startup(() => {
  injectTapEventPlugin();
  ReactDOM.render((
    <MuiThemeProvider>
      <Router history={hashHistory}>
        <Route path="/adminDashboard" component={AdminDashboardContainer} />
        <Route path="/dashboard" component={UserDashboardContainer} />
        <Route path="/project/:projectId" component={ProjectDetailContainer} />
        <Route path="/" component={LoginContainer} />
        <Route path="/submitRequest" component={SubmitRequestContainer} />
        <Route path="/viewRequests" component={ViewRequestsContainer} />
        <Route path="/submitReport" component={SubmitReportContainer} />
        <Route path="/viewRequests/:requestId" component={RequestDetailContainer} />
      </Router>
    </MuiThemeProvider>
  ), document.getElementById('app'));
});
