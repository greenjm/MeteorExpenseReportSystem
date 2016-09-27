var React = require('react');
import { hashHistory } from 'react-router';

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
		this.loginSuccess();
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