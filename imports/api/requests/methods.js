import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import './requests.js';

/* global Requests:true*/
/* eslint no-undef: "error"*/

Meteor.methods({
  'requests.create': function createRequest(proj, desc, est, vend, prt, qty, unt) {
    const currentUserId = Meteor.userId();
    check(proj, String);
    check(desc, String);
    check(est, Number);
    check(vend, String);
    check(prt, String);
    check(qty, Number);
    check(unt, Number);

    const newReq = {
      userId: currentUserId,
      projectId: proj,
      bornOn: new Date(),
      description: desc,
      estCost: est,
      vendor: vend,
      partNo: prt,
      quantity: qty,
      unitCost: unt,
      fileUrl: '',
    };

    Requests.schema.validate(newReq);

    return Requests.insert(newReq);
  },

  'requests.statEdit': function apprDeclReq(reqId, stat, msg) {
    check(reqId, String);
    check(stat, Boolean);
    check(msg, String);

    const result = Requests.update({ _id: reqId },
        { $set: { status: stat, statMsg: msg } });

    return result.nModified === 1;
  },

  // 'requests.addReceipt': function addReqReceipt(reqId, recpt) {
  //   check(reqId, String);
  //   check(recpt, Object);
  // },
});
