import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';

/* global Reports:true*/
/* eslint no-undef: "error"*/

Reports = new Mongo.Collection('reqports');

Reports.schema = new SimpleSchema({
  userId: { type: String, regEx: SimpleSchema.RegEx.Id },
  approvedRequests: { type: [String] },
  month: { type: Number },
  year: { type: Number },
});

Factory.define('report', Reports, {
  userId: '',
  approvedRequests: [],
  month: -1,
  year: 0,
});
