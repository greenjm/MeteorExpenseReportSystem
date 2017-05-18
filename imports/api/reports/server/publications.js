import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import '../reports.js';

/* global Reports Projects:true*/
/* eslint no-undef: "error"*/

Meteor.publish('reports', function reportsPublish() {
  const currentUser = Meteor.users.findOne(this.userId);

  if (currentUser == null || currentUser.profile == null) {
    return null;
  }

  if (currentUser.profile.isAdmin) {
    const reports = Reports.find();
    return reports;
  }

  return Reports.find({ userId: this.userId }).fetch();
});

Meteor.publish('reportOne', function retrieveReport(reportId) {
  check(reportId, String);

  const currentUser = Meteor.users.findOne(this.userId);
  if (currentUser == null || currentUser.profile == null) {
    return null;
  }

  const report = Reports.find({ $and: [{ _id: reportId },
    { userId: this.userId }] });
  return report;
});
