// This file creates the Header component (nav bar) that pages can put
// at the top of their render()
import { hashHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const React = require('react');

const Header = React.createClass({
  getInitialState() {
    return {
      userDashLink: <MenuItem primaryText="User Dashboard" onTouchTap={this.userDash} />,
      adminDashLink: null,
    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      const user = Meteor.user();
      const profile = user && user.profile;
      const isAdmin = profile && user.profile.isAdmin;
      if (isAdmin) {
        this.setState({ adminDashLink: <MenuItem primaryText="Admin Dashboard" onTouchTap={this.adminDash} /> });
      }
    });
  },

  userDash() {
    hashHistory.push('/dashboard');
  },

  adminDash() {
    hashHistory.push('/adminDashboard');
  },

  logout() {
    Meteor.logout(() => {
      hashHistory.push('/');
    });
  },

  render() {
    return (
      <div>
        <AppBar
          title="Expense Report"
          iconElementRight={
            <IconMenu
              iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
              }
              targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
              {this.state.userDashLink}
              {this.state.adminDashLink}
              <MenuItem primaryText="Profile" />
              <MenuItem primaryText="Sign out" onTouchTap={this.logout} />
            </IconMenu>
          }
          showMenuIconButton={false}
        />
      </div>);
  },
});

module.exports = Header;
