import { Meteor } from 'meteor/meteor';

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
