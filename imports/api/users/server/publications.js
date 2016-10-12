import { Meteor } from 'meteor/meteor';

Meteor.publish('users', function usersPublish() {
  const currentUser = Meteor.users.findOne(this.userId);

  if (currentUser == null || currentUser.profile == null) {
    return null;
  }

  if (currentUser.profile.isAdmin) {
    const users = Meteor.users.find();
    return users;
  }
  return Meteor.users.find({ _id: this.userId });
});
