import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
// import StubCollections from 'meteor/hwillson:stub-collections';
// import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { chai } from 'meteor/practicalmeteor:chai';
// import { Accounts } from 'meteor/accounts-base';

import { Projects } from './projects.js';
// import './publications.js';
// import '../../../startup/server/fixtures.js';

/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
/* global describe it:true */

if (Meteor.isServer) {
  describe('Project methods', function () {
    it('should create a project', function () {
      console.log('I am at api_projects_methods!');
    });

    it('should add a manager to a project', function () {
      console.log('adding manager');
    });

    it('should remove a manager from a project', function () {
      console.log('removing manager');
    });

    it('should add an employee to a project', function () {
      console.log('adding employee');
    });

    it('should remove an employee from a project', function () {
      console.log('removing employee');
    });

    it('should activate a project', function () {
      console.log('activating');
    });

    it('should deactivate a project', function () {
      console.log('deactivate');
    });

    it('should edit the project name', function () {
      console.log('changing names');
    });
});
}
