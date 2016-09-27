import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  /**
  *Attempts to log a user in to the website using accounts-password package
  *@param {String} user - username
  *@param {String} password - password
  *@return {JSON} object with success and isAdmin fields
  */
  'login.attempt': function attemptLogin(user, password) {
    check(user, String);
    check(password, String);
    Meteor.loginWithPassword(user, password, (error) => {
      const loggedInUser = Meteor.user();
      if (error || loggedInUser == null) {
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
    });
  },
});
