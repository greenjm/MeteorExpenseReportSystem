import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
// import { faker } from 'meteor/digilord:faker';

/* global Projects:true*/
/* eslint no-undef: "error"*/

Projects = new Mongo.Collection('projects');

Projects.schema = new SimpleSchema({
  name: { type: String },
  managers: { type: [String] },
  employees: { type: [String] },
  bornOn: { type: Date,
    autoValue: () => {
      const date = Date.now();
      return date;
    },
  },
  isActive: { type: Boolean, defaultValue: true },
  inactiveDate: { type: Date,
    autoValue: () => {
      const date = Date.now();
      return date;
    },
    defaultValue: null },
});

Factory.define('project', Projects, {
  name: '',
  managers: [],
  employees: [],
  bornOn: new Date(),
  isActive: true,
  inactiveDate: null,
});
