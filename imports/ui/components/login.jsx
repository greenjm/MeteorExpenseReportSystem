import { hashHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const React = require('react');

const cardStyle = {
  width: '35%',
  margin: 'auto',
  position: 'absolute',
  top: '30%',
  left: '0',
  right: '0',
};

const Login = React.createClass({
  getInitialState() {
    return {
      username: '',
      password: '',
      usernameError: '',
      passwordError: '',
    };
  },

  login(e) {
    e.preventDefault();
    if (this.state.username === '' || this.state.password === '') {
      this.emptyFieldError();
      return;
    }
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

  emptyFieldError() {
    if (this.state.username === '') {
      this.setState({ usernameError: 'This field is required.' });
    }
    if (this.state.password === '') {
      this.setState({ passwordError: 'This field is required.' });
    }
  },

  loginSuccess(isAdmin) {
    if (isAdmin) {
      hashHistory.push('/adminDashboard', null, { username: this.state.username });
    } else {
      hashHistory.push('/dashboard');
    }
  },

  loginFailure() {
    this.setState({ username: '', password: '', passwordError: 'Either email or password is incorrect.' });
  },

  handleUsernameChange(event) {
    this.setState({ username: event.target.value, usernameError: '' });
  },

  handlePasswordChange(event) {
    this.setState({ password: event.target.value, passwordError: '' });
  },

  render() {
    return (
      <form onSubmit={this.login}>
        <Card style={cardStyle}>
          <CardHeader
            title="Meteor Expense Report"
            subtitle="Login"
            expandable={false}
          />
          <CardText>
            <TextField
              hintText="email"
              fullWidth
              value={this.state.username}
              errorText={this.state.usernameError}
              name="username"
              onChange={this.handleUsernameChange}
            />
            <TextField
              hintText="password"
              type="password"
              fullWidth
              value={this.state.password}
              errorText={this.state.passwordError}
              name="password"
              onChange={this.handlePasswordChange}
            />
          </CardText>
          <CardActions>
            <FlatButton
              label="Login"
              type="submit"
            />
          </CardActions>
        </Card>
      </form>);
  },
});

module.exports = Login;
