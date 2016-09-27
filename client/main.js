var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var Login = require('./components/login.jsx');
var LoginSuccess = require('./components/loginSuccess.jsx');
import { hashHistory } from 'react-router';

ReactDOM.render((
	<Router history={hashHistory}>
		<Route path="/loginSuccess" component={LoginSuccess} />
		<Route path="/" component={Login} />
	</Router>
	), document.body);