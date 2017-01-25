import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';

/* global Reports:true*/
/* eslint no-undef: "error"*/

Reports = new Mongo.Collection('reqports');

Reports.schema = new SimpleSchema({
  userId: { type: String, regEx: SimpleSchema.RegEx.Id },
  projectId: { type: String, regEx: SimpleSchema.RegEx.Id },
  approvedRequests: { type: Array, optional: false },
  month: { type: String, optional: false },
  year: { type: Number, optional: false },
});

Factory.define('report', Reports, {
  userId: () => '',
  projectId: () => '',
  approvedRequests: () => [],
  month: () => -1,
  year: () => 0,
});
