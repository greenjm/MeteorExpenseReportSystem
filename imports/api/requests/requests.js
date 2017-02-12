import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import { faker } from 'meteor/digilord:faker';

/* global Requests:true*/
/* eslint no-undef: "error"*/

Requests = new Mongo.Collection('requests');

Requests.schema = new SimpleSchema({
  userId: { type: String, regEx: SimpleSchema.RegEx.Id },
  projectId: { type: String, regEx: SimpleSchema.RegEx.Id },
  status: { type: Boolean, optional: true },
  statMsg: { type: String, optional: true },
  vendor: { type: String },
  description: { type: String },
  partNo: { type: String },
  quantity: { type: Number, defaultValue: 1 },
  unitCost: { type: Number, decimal: true },
  estCost: { type: Number, decimal: true },
  project: { type: String },
  dateRequired: { type: String },
  intendedUsage: { type: String },
  receipt: { type: Object, optional: true },
});

Factory.define('request', Requests, {
  userId: () => '',
  projectId: () => '',
  vendor: () => faker.lorem.word,
  description: () => faker.lorem.sentence(5),
  partNo: () => faker.lorem.word,
  quantity: () => 1,
  unitCost: () => 1.00,
  estCost: () => 1.00,
  project: () => faker.lorem.word,
  dateRequired: () => new Date().toString(),
  intendedUsage: () => faker.lorem.sentence(5),
});
