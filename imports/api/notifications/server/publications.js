import { Meteor } from 'meteor/meteor';
import '../notifications.js';

/* global Notifications:true*/
/* eslint no-undef: "error"*/

Meteor.publish('notifications', function notificationsPublish() {
  const currentUser = Meteor.users.findOne(this.userId);

  if (currentUser == null || currentUser.profile == null) {
    return [];
  }

  const notifications = Notifications.find({ userIds: this.userId, isRead: false });
  return notifications;
});
