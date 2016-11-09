import { Meteor } from 'meteor/meteor';
// import { check } from 'meteor/check';
import '../requests.js';

/* global Requests:true*/
/* eslint no-undef: "error"*/

Meteor.publish('requests', function requestsPublish() {
  const currentUser = Meteor.users.findOne(this.userId);

  if (currentUser == null || currentUser.profile == null) {
    return null;
  }

  if (currentUser.profile.isAdmin) {
    const requests = Requests.find();
    return requests;
  }

  const requests = Requests.find({ userId: this.userId });
  return requests;
});
