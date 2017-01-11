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
      bornOn: new Date(),
    };

    Notifications.schema.validate(newNoti);

    return Notifications.insert(newNoti);
  },

  'notifications.updateRead': function setRead(notiId) {
    check(notiId, String);

    const result = Notifications.update({ _id: notiId },
        { $set: { isRead: true } });

    return result.nModified === 1;
  },

});
