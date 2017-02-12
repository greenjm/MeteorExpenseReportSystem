import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import './notifications.js';

/* global Notifications:true*/
/* eslint no-undef: "error"*/

Meteor.methods({
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

  'notifications.updateRead': function setRead(notiId) {
    check(notiId, String);

    const result = Notifications.update({ _id: notiId },
        { $set: { isRead: true } });

    return result.nModified === 1;
  },

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
