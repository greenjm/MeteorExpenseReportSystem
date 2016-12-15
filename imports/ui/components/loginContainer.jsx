import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import LoginPage from '../pages/login.jsx';

const LoginContainer = createContainer(() => {
  const user = Meteor.user();
  const profile = user && user.profile;
  const isAdmin = profile && profile.isAdmin;
  return {
    user: !!user || false,
    isAdmin,
  };
}, LoginPage);

module.exports = LoginContainer;
