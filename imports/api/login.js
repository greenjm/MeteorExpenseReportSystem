import { Meteor } from 'meteor/meteor';

Meteor.methods({

  /**
  Logs out the current user
  @return {JSON} object with success field
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
