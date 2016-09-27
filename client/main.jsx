// This file is the router file for all possible pages.
// This is the only file that needs to be imported into main.html in order to display any page.
// When you add a new page, import the component and give it a <Route> tag with the proper path.

import { hashHistory } from 'react-router';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router').Router;
const Route = require('react-router').Route;
const Login = require('./components/login.jsx');
const AdminDashboard = require('./components/adminDashboard.jsx');
const Dashboard = require('./components/dashboard.jsx');

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/adminDashboard" component={AdminDashboard} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/" component={Login} />
  </Router>
), document.body);
