import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import '../requests/requests.js';
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

    var projectDummy = reqs[0].projectId;
    Meteor.call('requests.create', projectDummy, "Monthly Internet Bill", 75, "Internet", "1", 1, 75, Date.now(), "Internet", (error, result) => {
      if (!error) {
        reqs.push(result);
      }
    });

    Meteor.call('requests.create', projectDummy, "Monthly Phone Bill", 75, "Phone", "1", 1, 75, Date.now(), "Phone", (error, result) => {
      if (!error) {
        reqs.push(result);
      }
    });

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
