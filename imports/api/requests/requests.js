import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* global Requests:true*/
/* eslint no-undef: "error"*/

Requests = new Mongo.Collection('requests');

Requests.schema = new SimpleSchema({
  userId: { type: String, regEx: SimpleSchema.RegEx.Id },
  projectId: { type: String, regEx: SimpleSchema.RegEx.Id },
  status: { type: Boolean, optional: true },
  statMsg: { type: String, optional: true },
  bornOn: { type: Date, default: Date.now },
  description: { type: String },
  estCost: { type: Number },
  vendor: { type: String },
  partNo: { type: String },
  quantity: { type: Number, default: 1 },
  unitCost: { type: Number },
  receipt: { type: String, optional: true },
});
