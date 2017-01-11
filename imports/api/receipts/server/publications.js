/* global Receipts Requests:true*/
/* eslint no-undef: "error"*/


import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import '../receipts.js';
import '../../requests/requests.js';


Meteor.publish('receiptGet', function receiptPublish(reqId) {
  check(reqId, String);
  const currentUser = Meteor.users.findOne(this.userId);

  if (currentUser == null || currentUser.profile == null) {
    return null;
  }

  const req = Requests.find({ _id: reqId });
  const file = Receipts.find({});

  return [req, file];
});
