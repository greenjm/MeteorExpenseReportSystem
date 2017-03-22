import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import './notifications.js';

/* global Notifications:true*/
/* eslint no-undef: "error"*/

Meteor.methods({
  /**
  Creates a new notification.
  @param user {String} the ID of the user to notify
  @param intext {String} the text of the notification
  @param url {String} the URL that the notification links to
  @return {Boolean} true if insert was successful
  */
  'notifications.create': function createNotif(user, intext, url) {
    check(user, String);
    check(intext, String);
    check(url, String);

    const newNoti = {
      userId: user,
      text: intext,
      URL: url,
      isRead: false,
      bornOn: new Date(),
    };

    Notifications.schema.validate(newNoti);
    const result = Notifications.insert(newNoti);
    return result;
  },

  /**
  Sets notification status to has been read.
  @param notiId {String} the notification's ID
  @return {Boolean} true if exactly one notification was updated
  */
  'notifications.updateRead': function setRead(notiId) {
    check(notiId, String);

    const result = Notifications.update({ _id: notiId },
        { $set: { isRead: true } });

    return result.nModified === 1;
  },

  /**
  Helper method to notify all managers of a project.
  @param proj {String} the project's name
  @param managers {Array} list of manager IDs for the project
  @param reqId {String} the request's ID for URL creation
  */
  'notifications.createHelper': function helpCreate(proj, managers, reqId) {
    let i = 0;
    const currentUser = Meteor.user();
    check(proj, String);
    check(managers, Array);
    check(reqId, String);
    const targetURL = `/requestDetail/${reqId}`;
    const noteText = `${currentUser.profile.name} has created a request for the project: ${proj}`;
    for (i = 0; i < managers.length; i += 1) {
      Meteor.call('notifications.create', managers[i], noteText, targetURL);
    }
  },

  /**
  Helper method for notifying that a request was approved/denied.
  @param state {Boolean} true if the request was approved, else denied
  @param reqId {String} the request's ID for URL creation
  @param reqUser {String} the ID of the user who created the request
  */
  'notifications.respondHelper': function respondCreate(state, reqId, reqUser) {
    let reply = 'denied';
    const currentUser = Meteor.user();
    check(state, Boolean);
    check(reqId, String);
    check(reqUser, String);
    if (state) {
      reply = 'approved';
    }
    const targetURL = `/requestDetail/${reqId}`;
    const noteText = `${currentUser.profile.name} has ${reply} your request`;
    Meteor.call('notifications.create', reqUser, noteText, targetURL);
  },

  /**
  Helper method for request resubmission.
  @param proj {String} the project's name
  @param managers {Array} list of manager IDs for the project
  @param reqId {String} the request's ID for URL creation
  */
  'notifications.createEditHelper': function helpEditCreate(proj, managers, reqId) {
    let i = 0;
    const currentUser = Meteor.user();
    check(proj, String);
    check(managers, Array);
    check(reqId, String);
    const targetURL = `/requestDetail/${reqId}`;
    const noteText = `${currentUser.profile.name} has resubmitted a request for the project: ${proj}`;
    for (i = 0; i < managers.length; i += 1) {
      Meteor.call('notifications.create', managers[i], noteText, targetURL);
    }
  },
});
