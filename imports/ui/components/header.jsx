// This file creates the Header component (nav bar) that pages can put
// at the top of their render()
import { hashHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

const React = require('react');

const Header = React.createClass({
  propTypes: {
    isAdmin: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      userDashLink: <MenuItem primaryText="User Dashboard" onTouchTap={this.userDash} />,
      adminDashLink: null,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAdmin) {
      this.setState({ adminDashLink: <MenuItem primaryText="Admin Dashboard" onTouchTap={this.adminDash} /> });
    }
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
            <div>
              <IconMenu
                iconButtonElement={
                  <Badge
                    badgeContent={10}
                    secondary
                    badgeStyle={{ top: 22, right: 24, height: 18, width: 18 }}
                    style={{ padding: 0 }}
                  >
                    <IconButton tooltip="Notifications">
                      <NotificationsIcon />
                    </IconButton>
                  </Badge>
                }
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                <MenuItem primaryText="View Notifications" />
                <MenuItem primaryText="Dismiss all" />
              </IconMenu>
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
            </div>
          }
          showMenuIconButton={false}
        />
      </div>);
  },
});

module.exports = Header;
