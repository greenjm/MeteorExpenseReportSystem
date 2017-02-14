import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import './requests.js';

/* global Requests:true*/
/* eslint no-undef: "error"*/

Meteor.methods({
  'requests.create': function createRequest(proj, desc, est, vend, prt, qty, unt, date, indUsage) {
    const currentUserId = Meteor.userId();
    check(proj, String);
    check(desc, String);
    check(est, Number);
    check(vend, String);
    check(prt, String);
    check(qty, Number);
    check(unt, Number);
    // check(projType, String);
    check(date, String);
    check(indUsage, String);

    const newReq = {
      userId: currentUserId,
      projectId: proj,
      bornOn: new Date(),
      vendor: vend,
      description: desc,
      partNo: prt,
      quantity: qty,
      unitCost: unt,
      estCost: est,
      dateRequired: date,
      intendedUsage: indUsage,
      submitted: false,
    };

    Requests.schema.validate(newReq);
    const result = Requests.insert(newReq);
    return result;
  },

  'requests.edit': function editRequest(id, desc, est, vend, prt, dateReq, intUse, qty, unt) {
    check(id, String);
    check(desc, String);
    check(est, Number);
    check(vend, String);
    check(prt, String);
    check(dateReq, String);
    check(intUse, String);
    check(qty, Number);
    check(unt, Number);

    const currentUser = Meteor.user();
    if (currentUser == null || currentUser.profile == null) {
      throw new Meteor.Error('requests.edit.unauthorized', 'You are not logged in.');
    }

    const req = Requests.findOne(id);

    if (!req || req.userId !== Meteor.userId()) {
      throw new Meteor.Error('requests.edit.badId', 'Request does not exist or you do not own the request.');
    }

    const result = Requests.update({ _id: id },
      { $set: {
        description: desc,
        estCost: est,
        vendor: vend,
        partNo: prt,
        dateRequired: dateReq,
        intendedUsage: intUse,
        quantity: qty,
        unitCost: unt,
      },
      });

    return result.nModified === 1;
  },

  'requests.editWithProject': function editRequestProj(id, projId, desc, est, vend, prt, dateReq, intUse, qty, unt) {
    check(id, String);
    check(projId, String);
    check(desc, String);
    check(est, Number);
    check(vend, String);
    check(prt, String);
    check(dateReq, String);
    check(intUse, String);
    check(qty, Number);
    check(unt, Number);

    const currentUser = Meteor.user();
    if (currentUser == null || currentUser.profile == null) {
      throw new Meteor.Error('requests.edit.unauthorized', 'You are not logged in.');
    }

    const req = Requests.findOne(id);

    if (!req || req.userId !== Meteor.userId()) {
      throw new Meteor.Error('requests.edit.badId', 'Request does not exist or you do not own the request.');
    }

    const result = Requests.update({ _id: id },
      { $set: {
        projectId: projId,
        description: desc,
        estCost: est,
        vendor: vend,
        partNo: prt,
        dateRequired: dateReq,
        intendedUsage: intUse,
        quantity: qty,
        unitCost: unt,
        status: null,
      },
    });

    return result.nModified === 1;
  },

  'requests.statEdit': function apprDeclReq(reqId, stat, msg) {
    check(reqId, String);
    check(stat, Boolean);
    check(msg, String);

    const result = Requests.update({ _id: reqId },
        { $set: { status: stat, statMsg: msg } });

    return result.nModified === 1;
  },

  'requests.submission': function submitReq(reqId) {
    check(reqId, String);

    const result = Requests.update({ _id: reqId },
      { $set: { submitted: true } });

    return result.nModified === 1;
  },

  'requests.delete': function deleteReq(reqId) {
    check(reqId, String);
    const result = Requests.remove({ _id: reqId });
    return result;
  },

  // 'requests.addReceipt': function addReqReceipt(reqId, recpt) {
  //   check(reqId, String);
  //   check(recpt, Object);
  // },
});
