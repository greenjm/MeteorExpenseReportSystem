import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import './receipts.js';

/* global Receipts Requests:true*/
/* eslint no-undef: "error"*/

// Security
Receipts.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
  'receipts.uploadToRequest': function uploadRequestReceipt(reqId, fileInfo) {
    check(reqId, String);
    check(fileInfo, Match.Any);

    if (this.userId) {
      const req = Requests.findOne(reqId);
      if (req && req.userId === this.userId) {
        const fileObj = Receipts.insert(fileInfo);
        Requests.update({ _id: reqId }, { $set: { receipt: fileObj } });
        return reqId;
      }
      throw new Meteor.Error('receipts.uploadToRequest.badReq',
        'The request either does not exist or belongs to a different user');
    }
    throw new Meteor.Error('receipts.uploadToRequest.unauthorized', 'You are not logged in');
  },
});
