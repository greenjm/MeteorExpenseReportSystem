// This file creates the Header component (nav bar) that pages can put
// at the top of their render()
import { hashHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Subheader from 'material-ui/Subheader';

const React = require('react');

const Header = React.createClass({
  getInitialState() {
    return {};
  },

  logout() {
    Meteor.logout((error) => {
      if (error) {
        logout();
        return;
      }
      hashHistory.push('/');
    });
  },

  render() {
    return (
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
            <MenuItem primaryText="Profile" />
            <MenuItem primaryText="Sign out" onTouchTap={this.logout} />
          </IconMenu>
        }
        showMenuIconButton={false}
      />);
  }  
});

module.exports = Header;
