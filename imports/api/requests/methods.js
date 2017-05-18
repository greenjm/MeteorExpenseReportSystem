import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import './requests.js';

/* global Requests:true*/
/* eslint no-undef: "error"*/

Meteor.methods({
  /**
  Creates a new MPA for the current user.
  @param proj {String} the project's ID
  @param desc {String} the request's description
  @param est {Number} the estimated total cost (qty * unt)
  @param vend {String} the vendor's name
  @param prt {String} the part number
  @param qty {Number} the quantity
  @param unt {Number} the unit cost
  @param date {String} the date MPA is needed
  @param indUsage {String} the intended usage
  @return {Boolean} true if insert succeeded
  */
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

    if (est <= 75) {
      newReq.status = true;
    }

    Requests.schema.validate(newReq);
    const result = Requests.insert(newReq);
    return result;
  },

  /**
  Edits the request with the given ID.
  @param id {String} the request's ID
  @param desc {String} new description
  @param est {Number} new estimated cost
  @param vend {String} new vendor
  @param prt {String} new part number
  @param dateReq {String} new date required
  @param intUse {String} new intended usage
  @param qty {Number} new quantity
  @param unt {Number} new unit cost
  @return {Boolean} true if exactly one request was updated
  */
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

  /**
  Edits a request, changing the project it is for
  @param id {String} the request's ID
  @param projId {String} the project's ID
  @param desc {String} new description
  @param est {Number} new estimated cost
  @param vend {String} new vendor
  @param prt {String} new part number
  @param dateReq {String} new date required
  @param intUse {String} new intended usage
  @param qty {Number} new quantity
  @param unt {Number} new unit cost
  @return {Boolean} true if exactly one request was updated
  */
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

  /**
  Updates a request's status
  @param reqId {String} the request's ID
  @param stat {Boolean} the status to set the request to
  @param msg {String} the status message to give
  @return {Boolean} true if exactly one request was updated
  */
  'requests.statEdit': function apprDeclReq(reqId, stat, msg) {
    check(reqId, String);
    check(stat, Boolean);
    check(msg, String);

    const result = Requests.update({ _id: reqId },
        { $set: { status: stat, statMsg: msg } });

    return result.nModified === 1;
  },

  /**
  Sets a request to submitted (used for MERs)
  @param reqId {String} the request's ID
  @return {Boolean} true if exactly one request was updated
  */
  'requests.submission': function submitReq(reqId) {
    check(reqId, String);

    const result = Requests.update({ _id: reqId },
      { $set: { submitted: true } });

    return result.nModified === 1;
  },

  /**
  Deletes the given request
  @param reqId {String} the request's ID
  @return {Boolean} true if the delete was successful
  */
  'requests.delete': function deleteReq(reqId) {
    check(reqId, String);
    const result = Requests.remove({ _id: reqId });
    return result;
  },
});
