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
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

/* global Notifications:true*/
/* eslint no-undef: "error"*/

const React = require('react');

const Header = React.createClass({
  propTypes: {
    isAdmin: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      userDashLink: <MenuItem primaryText="User Dashboard" onTouchTap={this.userDash} />,
      adminDashLink: null,
      notificationCount: 0,
      notifications: [],
      logoSource: '/images/ScientiaLLC_Logo_No_Shadow-300x64.png',
    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      const notificationSub = Meteor.subscribe('notifications');
      if (notificationSub.ready()) {
        const notificationCount = Notifications.find().count();
        const notifications = Notifications.find({}, { sort: { bornOn: -1 } }).fetch();
        this.setState({ notificationCount, notifications });
      }
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAdmin) {
      this.setState({ adminDashLink: <MenuItem primaryText="Admin Dashboard" onTouchTap={this.adminDash} /> });
    }
  },

  markReadAndGo(id, url) {
    Meteor.call('notifications.updateRead', id);
    hashHistory.push(url);
  },

  createNotification(item) {
    return (
      <MenuItem
        primaryText={item.text}
        onTouchTap={() => { this.markReadAndGo(item._id, item.URL); }}
      />
    );
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
          title="Monthly Expense Report System"
          iconElementRight={
            <div>
              <IconMenu
                iconButtonElement={
                  <Badge
                    badgeContent={this.state.notificationCount}
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
                { this.state.notificationCount === 0 ? (
                  <MenuItem primaryText="0 Unread Notifications" />
                ) : this.state.notifications.map(this.createNotification)
                }
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
                <MenuItem primaryText="Sign out" onTouchTap={this.logout} />
              </IconMenu>
            </div>
          }
          iconElementLeft={
            <a href="/#/"><img src={this.state.logoSource} alt="Scientia Logo" height="48" width="225" /></a>
          }
          showMenuIconButton
        />
      </div>);
  },
});

module.exports = Header;
