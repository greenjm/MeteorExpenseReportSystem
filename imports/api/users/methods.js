import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Security
Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
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

    if (currentUser.profile.isAdmin && userId === Meteor.userId() && !profile.isAdmin) {
      throw new Meteor.Error('users.update.invalidUpdate', 'You cannot remove your own admin permissions');
    }

    Meteor.users.update(userId, {
      $set: {
        profile: {
          name: profile.name,
          isAdmin: profile.isAdmin,
        },
      },
    });

    return {
      name: true,
      isAdmin: true,
    };
  },
});
