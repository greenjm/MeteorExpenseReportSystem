// This file represents the login page, both its markup and its logic.
// The render() function shows the basic login form and binds its variables to the state.
// When the login button is clicked, the login function is called, which calls the API and then calls
// the appropriate function success/fail depending on the server response.

var React = require('react');
import { hashHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';

var Login = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: ''
    }
  },

  login: function() {
    console.log('Called login with ' + this.state.username + ', ' + this.state.password + '.');
    //call the server using Ajax! There is no server right now, so just pretend it was called.
    Meteor.loginWithPassword(this.state.username, this.state.password, (error) => {
      if (error) {
        this.loginFailure();
      } else {
        Meteor.call('login.verify', (err, result) => {
          if (err) {
            this.loginFailure();
          } else {
            if (result.isAdmin) {
              console.log('IS ADMIN');
            }
            this.loginSuccess();
          }
        });       
      }
    });
  },

  loginSuccess: function() {
    hashHistory.push('/loginSuccess');
  },

  loginFailure: function() {
    this.setState({username: '', password: ''});
  },

  handleUsernameChange: function(event) {
    this.setState({username: event.target.value});
  },

  handlePasswordChange: function(event) {
    this.setState({password: event.target.value});
  },

  render: function() {
    return (
      <div className="loginBox">
      <div className="loginInnerBox">
      <label htmlFor="username">Username</label>
      <input type="text" name="username" className="loginInput" value={this.state.username} onChange={this.handleUsernameChange} />

      <label htmlFor="password">Password</label>
      <input type="password" name="password" className="loginInput" value={this.state.password} onChange={this.handlePasswordChange} />
      <button onClick={this.login} className="loginInput">Login</button>
      </div>
      </div>);
    }
});

module.exports = Login;
