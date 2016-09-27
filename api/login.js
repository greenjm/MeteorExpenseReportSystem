import { Meteor } from 'meteor/meteor';

Meteor.methods({
  /**
  *Verifies that a user is actually logged in to the server
  *@return {JSON} object with success and isAdmin fields
  */
  'login.verify': function verifyLogin() {
    const loggedInUser = Meteor.user();
    if (loggedInUser == null) {
      throw new Meteor.Error('login.attempt.unauthorized', 'Login failed.');
    }

    if (loggedInUser.profile) {
      return {
        success: true,
        isAdmin: loggedInUser.profile.isAdmin,
      };
    }
    return {
      success: true,
      isAdmin: false,
    };
  },

  /**
  *Logs out the current user
  *@return {JSON} object with success field
  */
  'login.logout': function logout() {
    if (this.userId == null) {
      throw new Meteor.Error('login.logout.nouser', 'No user currently logged in');
    }
    Meteor.logout((error) => {
      if (error) {
        throw new Meteor.Error('login.logout.failed', 'Logout failed.');
      }
      return {
        success: true,
      };
    });
  },
});
