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
  bornOn: { type: Date,
    autoValue: () => {
      const date = Date.now();
      return date;
    },
  },
  description: { type: String },
  estCost: { type: Number, decimal: true },
  vendor: { type: String },
  partNo: { type: String },
  quantity: { type: Number, defaultValue: 1 },
  unitCost: { type: Number, decimal: true },
  receipt: { type: Object, optional: true },
});

Factory.define('request', Requests, {
  userId: () => '',
  projectId: () => '',
  bornOn: () => new Date(),
  description: () => faker.lorem.sentence(5),
  estCost: () => 1.00,
  vendor: () => faker.lorem.word,
  partNo: () => faker.lorem.word,
  quantity: () => 1,
  unitCost: () => 1.00,
});
