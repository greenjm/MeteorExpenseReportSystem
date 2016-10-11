import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

if (Meteor.isServer) {
  Meteor.publish('users', () => {
    const currentUser = Meteor.user();

    if (currentUser == null || currentUser.profile == null) {
      return {};
    }

    if (currentUser.profile.isAdmin) {
      const users = Meteor.users.find();
      return users;
    }
    return [currentUser];
  });
}

// Security setup
Meteor.users.allow({
  update() {
    const currentUser = Meteor.user();
    if (currentUser == null || currentUser.profile == null) {
      return false;
    }
    return currentUser.profile.isAdmin;
  },
  remove() {
    const currentUser = Meteor.user();
    if (currentUser == null || currentUser.profile == null) {
      return false;
    }
    return currentUser.profile.isAdmin;
  },
});

Meteor.methods({
  /**
  Gets the user with the given userId
  @param userId {String} user's id
  @return {JSON} Object representing the user, or null if cannot access
  */
  'users.getOne': function getOne(userId) {
    check(userId, String);

    const currentUser = Meteor.user();
    if (currentUser == null || currentUser.profile == null) {
      return null;
    }

    const projection = { emails: 1, 'profile.name': 1, 'profile.isAdmin': 1 };
    return Meteor.users.findOne(userId, projection);
  },

  /**
  Creates a new user in the database
  TODO: Use email to send password reset link/confirmation email
  @param email {String} email address
  @param name {String} user's name
  @param isAdmin {Boolean} whether or not the user is an admin
  @return {Boolean} true if successfully added
  */
  'users.new': function newUser(email, name, isAdmin) {
    check(email, String);
    check(name, String);
    check(isAdmin, Boolean);

    const currentUser = Meteor.user();

    if (currentUser == null || currentUser.profile == null || !currentUser.profile.isAdmin) {
      throw new Meteor.Error('users.new.unauthorized', 'You cannot create new users');
    }
    if (/^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      const username = email.substr(0, email.indexOf('@'));
      Accounts.createUser({
        username,
        email,
        profile: {
          name,
          isAdmin,
          autoInternet: true,
          autoPhone: true,
        },
      }, (error, userId) => {
        if (error != null) {
          Accounts.sendEnrollmentEmail(userId);
          return true;
        }
        throw new Meteor.Error('users.new.failed', 'Accounts.createUser call failed');
      });
    }
    throw new Meteor.Error('users.new.invalidEmail', 'Email address is not valid');
  },

  /**
  Updates the user's profile. Only admins can update profiles
  @param userId {String} id of the user
  @param profile {JSON} Object with name, isAdmin, autoInternet, and autoPhone fields
  @return {JSON} Object with the fields that were successfully updated
  */
  'users.update': function updateUser(userId, profile) {
    check(userId, String);
    check(profile, {
      name: String,
      isAdmin: Boolean,
      autoInternet: Boolean,
      autoPhone: Boolean,
    });

    const currentUser = Meteor.user();
    if (currentUser == null || currentUser.profile == null) {
      throw new Meteor.Error('users.update.nouser', 'You are not a valid user');
    }

    const oldUser = Meteor.users.findOne(userId);
    if (oldUser == null || oldUser.profile == null) {
      throw new Meteor.Error('users.update.invalidId', 'No user found with the given userId');
    }

    const currentUserId = Meteor.userId();
    if (!currentUser.profile.isAdmin && currentUserId !== userId) {
      throw new Meteor.Error('users.update.permissionDenied', 'You do not have required permissions to update user');
    }

    Meteor.users.update(userId, {
      $set: {
        profile: {
          name: profile.name,
          isAdmin: profile.isAdmin,
          autoInternet: profile.autoInternet,
          autoPhone: profile.autoPhone,
        },
      },
    });

    return {
      name: true,
      isAdmin: true,
      autoInternet: true,
      autoPhone: true,
    };
  },

  /**
  Deletes the given user. Only admins can do this
  @param userId {String} id of the user
  @return {Boolean} true if delete is successful
  */
  'users.remove': function removeUser(userId) {
    check(userId, String);

    const currentUser = Meteor.user();
    if (currentUser == null || currentUser.profile == null) {
      throw new Meteor.Error('users.update.nouser', 'You are not a valid user');
    }

    if (Meteor.userId() === userId || !currentUser.profile.isAdmin) {
      throw new Meteor.Error('users.remove.unauthorized', 'Cannot delete this user');
    }

    Meteor.users.remove({ _id: userId });

    return true;
  },
});
