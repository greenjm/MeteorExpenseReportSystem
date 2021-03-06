import { hashHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const React = require('react');

// Styles
const cardStyle = {
  width: '35%',
  margin: 'auto',
  position: 'absolute',
  top: '30%',
  left: '0',
  right: '0',
};

const Login = React.createClass({
  propTypes: {
    user: React.PropTypes.bool,
    isAdmin: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      username: '',
      password: '',
      usernameError: '',
      passwordError: '',
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      if (nextProps.isAdmin) {
        hashHistory.push('/adminDashboard');
      } else {
        hashHistory.push('/dashboard');
      }
    }
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
    this.setState({ passwordError: 'Either email or password is incorrect.' });
  },

  // State Bindings
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
            title="Monthly Expense Report"
            subtitle="Login"
            expandable={false}
          />
          <CardText>
            <TextField
              floatingLabelText="Email"
              fullWidth
              value={this.state.username}
              errorText={this.state.usernameError}
              name="username"
              onChange={this.handleUsernameChange}
            />
            <TextField
              floatingLabelText="Password"
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
