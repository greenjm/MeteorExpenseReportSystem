import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';

/* global Notifications:true*/
/* eslint no-undef: "error"*/

Notifications = new Mongo.Collection('notifications');

Notifications.schema = new SimpleSchema({
  userIds: { type: [String], regEx: SimpleSchema.RegEx.Id },
  reqId: { type: String, regEx: SimpleSchema.RegEx.Id },
  text: { type: String },
  URL: { type: String },
  isRead: { type: Boolean, defaultValue: false },
  bornOn: { type: Date,
    autoValue: () => {
      const date = Date.now();
      return date;
    },
  },
  tag: { type: String },
});

Factory.define('notification', Notifications, {
  userIds: () => [],
  reqId: () => '',
  text: () => '',
  URL: () => '',
  isRead: () => false,
  bornOn: () => new Date(),
  tag: () => '',
});
