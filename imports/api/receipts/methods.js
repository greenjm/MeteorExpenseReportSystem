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
  update(userId, fileObj) {
    return !fileObj.owner || userId !== fileObj.owner
      || !fileObj.requestId || !fileObj.bornOn;
  },
  remove(userId, fileObj) {
    return userId !== fileObj.owner;
  },
});

Meteor.methods({
  /**
  Attaches a receipt to a specific request.
  @param reqId {String} the request's ID
  @param fileObj {Object} GridFS file object to attach
  @return {Boolean} true if the update succeeded
  */
  'receipts.attachToRequest': function attachRequestReceipt(reqId, fileObj) {
    check(reqId, String);
    check(fileObj, Match.Any);
    if (this.userId) {
      const req = Requests.findOne(reqId);
      if (req && req.userId === this.userId) {
        const result = Requests.update({ _id: reqId }, { $set: { receipt: fileObj } });
        return result;
      }
      throw new Meteor.Error('receipts.attachToRequest.badReq',
        'The request either does not exist or belongs to a different user');
    }
    throw new Meteor.Error('receipts.attachToRequest.unauthorized', 'You are not logged in');
  },

  /**
  Removes a receipt and detaches it from the corresponding request
  @param id {String} the receipt's ID
  @return {Boolean} true if the receipt was removed and detached
  */
  'receipts.remove': function removeReceipt(id) {
    check(id, String);

    if (this.userId) {
      const receipt = Receipts.findOne(id);
      if (receipt && receipt.owner === this.userId && receipt.requestId) {
        const request = Requests.findOne(receipt.requestId);
        if (request && request.userId === this.userId && request.receipt) {
          const removed = Receipts.remove({ _id: receipt._id });
          const updated = Requests.update({ _id: request._id },
            { $set: { receipt: null } });
          return removed && updated;
        }
        throw new Meteor.Error('receipts.remove.badReq',
          'The request belongs to a different user or does not contain the receipt');
      }
      throw new Meteor.Error('receipts.remove.badReceipt',
        'The receipt belongs to another user or does not exist');
    }
    throw new Meteor.Error('receipts.remove.unauthorizes', 'You are not logged in');
  },
});
