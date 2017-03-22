import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import './reports.js';

/* global Reports:true*/
/* eslint no-undef: "error"*/

// Security
Reports.deny({
  insert(userId, fileObj) {
    return !fileObj.owner || userId !== fileObj.owner;
  },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
  /**
  Creates a new report in the database
  @param reqs {Array} list of approved requests
  @param month {String} month submitted
  @param year {Number} year submitted
  @return {Boolean} true if successfully added
  */
  'reports.create': function createReport(reqs, month, year) {
    check(reqs, Array);
    check(month, Number);
    check(year, Number);

    const newReport = {
      userId: Meteor.userId(),
      approvedRequests: reqs,
      month,
      year,
    };

    Reports.schema.validate(newReport);

    return Reports.insert(newReport);
  },
});
