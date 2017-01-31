import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import './receipts.js';

/* global Receipts Requests:true*/
/* eslint no-undef: "error"*/

// Security
Receipts.deny({
  insert(userId, fileObj) {
    return !fileObj.owner || userId !== fileObj.owner
      || !fileObj.requestId || !fileObj.bornOn;
  },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
  'receipts.attachToRequest': function attachRequestReceipt(reqId, fileObj) {
    check(reqId, String);
    check(fileObj, Match.Any);
    if (this.userId) {
      const req = Requests.findOne(reqId);
      if (req && req.userId === this.userId) {
        Requests.update({ _id: reqId }, { $set: { receipt: fileObj } });
        return reqId;
      }
      throw new Meteor.Error('receipts.attachToRequest.badReq',
        'The request either does not exist or belongs to a different user');
    }
    throw new Meteor.Error('receipts.attachToRequest.unauthorized', 'You are not logged in');
  },
});
