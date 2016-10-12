// This file represents the login page, both its markup and its logic.
// The render() function shows the basic login form and binds its variables to the state.
// When the login button is clicked, the login function is called, which calls the API
// and then callsthe appropriate function success/fail depending on the server response.

import { hashHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

const React = require('react');

const Login = React.createClass({
  getInitialState() {
    return {
      username: '',
      password: '',
    };
  },


  login() {
    Meteor.loginWithPassword({ email: this.state.username },
     this.state.password, (error) => {
       if (error) {
         this.loginFailure();
       } else {
         const loggedInUser = Meteor.user();
         if (loggedInUser == null) {
           this.loginFailure();
           return;
         }
         if (loggedInUser.profile) {
           this.loginSuccess(loggedInUser.profile.isAdmin);
         } else {
           this.loginSuccess(false);
         }
       }
     });
  },

  loginSuccess(isAdmin) {
    if (isAdmin) {
      hashHistory.push('/adminDashboard', null, { username: this.state.username });
    } else {
      hashHistory.push('/dashboard');
    }
  },

  loginFailure() {
    this.setState({ username: '', password: '' });
  },

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  },

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  },

  render() {
    return (
      <div className="loginBox">
        <form className="loginInnerBox">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" className="loginInput" value={this.state.username} onChange={this.handleUsernameChange} />

          <label htmlFor="password">Password</label>
          <input type="password" name="password" className="loginInput" value={this.state.password} onChange={this.handlePasswordChange} />
          <button type="button" onClick={this.login} className="loginInput">Login</button>
        </form>
      </div>);
  },
});

module.exports = Login;
