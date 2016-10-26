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

  // if (currentUser.profile.isAdmin) {
  //   const reports = Reports.find();
  //   return reports;
  // }

  const requests = Requests.find({ userId: this.userId });
  return requests;
});
