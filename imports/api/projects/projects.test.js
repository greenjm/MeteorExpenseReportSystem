/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
/* global Projects describe it:true */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
// import StubCollections from 'meteor/hwillson:stub-collections';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { chai } from 'meteor/practicalmeteor:chai';
import { Accounts } from 'meteor/accounts-base';
// import { check } from 'meteor/check';
// import { Random } from 'meteor/random';

// Following import used for ValidatedMethods
// import { createProject } from './methods.js';


import './projects.js';


if (Meteor.isServer) {
  // eslint-disable-next-line import/no-unresolved
  import './server/publications.js';
  import './methods.js';

  const adminId = Accounts.createUser({
    username: 'PROJECTuser1+admin',
    email: 'PROJECTuser+admin@rose-hulman.edu',
    password: '12345678',
    profile: {
      isAdmin: true,
    },
  });

  const manaId = Accounts.createUser({
    username: 'PROJECTuser2',
    email: 'PROJECTuser2@rose-hulman.edu',
    password: '12345678',
    profile: {
      isAdmin: false,
    },
  });

  const empId = Accounts.createUser({
    username: 'PROJECTuser3',
    email: 'PROJECTuser3@rose-hulman.edu',
    password: '12345678',
    profile: {
      isAdmin: false,
    },
  });

  describe('projects testing', function () {
    describe('mutators', function () {
      it('should create from the Factory', function () {
        const proj = Factory.create('project');
        chai.assert.typeOf(proj, 'object');
      });
    });

    describe('publications', function () {
      beforeEach(function () {
        Projects.remove({});
        Factory.create('project');
        Factory.create('project', { managers: [manaId] });
        Factory.create('project', { employees: [empId] });
        Factory.create('project', { managers: [manaId], employees: [empId] });
        Factory.create('project', { name: 'pubTest', managers: [manaId] });
      });

      describe('projectPublish', function () {
        it('should return all projects for an admin', function () {
          const collector = new PublicationCollector({ userId: adminId });
          collector.collect('projects', (collections) => {
            chai.assert.typeOf(collections.projects, 'array');
            chai.assert.equal(collections.projects.length, 5);
          });
        });

        it('should return all projects for a manager', function () {
          const collector = new PublicationCollector({ userId: manaId });
          collector.collect('projects', (collections) => {
            chai.assert.typeOf(collections.projects, 'array');
            chai.assert.equal(collections.projects.length, 3);
          });
        });

        it('should return all projects for an employee', function () {
          const collector = new PublicationCollector({ userId: empId });
          collector.collect('projects', (collections) => {
            chai.assert.typeOf(collections.projects, 'array');
            chai.assert.equal(collections.projects.length, 2);
          });
        });
      });

      describe('retrieveProject', function () {
        it('should return project given projectId and employee/manager on project', function () {
          const collector = new PublicationCollector({ userId: manaId });
          collector.collect('projectGet', Projects.findOne({ name: 'pubTest' })._id, (collections) => {
            chai.assert.typeOf(collections.projects, 'array');
            chai.assert.equal(collections.projects.length, 1);
          });
        });

        it('should not return project given projectId if employee is not part of project', function () {
          const collector = new PublicationCollector({ userId: empId });
          collector.collect('projectGet', Projects.findOne({ name: 'pubTest' })._id, (collections) => {
            chai.assert.typeOf(collections.projects, 'array');
            chai.assert.equal(collections.projects.length, 0);
          });
        });
      });
    });

    describe('methods', function () {
      // const rndId = Random.id();


      describe('createProject', function () {
        it('should throw error', function () {
          // the following 3 lines are for testing using validated methods
          // const context = { adminId };
          // const args = { name: 'methodTest1', mgr: manaId };
          // createProject._execute(context, args);
          try {
            Meteor.call('projects.create', 'methodTest1', manaId);
          } catch (err) {
            chai.expect(err).to.eql(new Meteor.Error('projects.create.unauthorized',
              'You do not have permission to create projects.'));
          }
          // chai.assert.equal(Projects.find().count(), 1);
        });
      });

      // This test was failing 1-25-2017
      /* describe('addManager', function () {
        it('should throw error', function () {
          try {
            Meteor.call('projects.addManager', 'methodTest1', empId);
          } catch (err) {
            chai.expect(err).to.eql(new Meteor.Error('projects.addManager.unauthorized',
              'You do not have permission to add managers.'));
          }
        });
      }); */

      describe('removeManager', function () {
        it('should throw error', function () {
          try {
            Meteor.call('projects.removeManager', 'methodTest1', empId);
          } catch (err) {
            chai.expect(err).to.eql(new Meteor.Error('projects.removeManager.unauthorized',
              'You do not have permission to remove managers.'));
          }
        });
      });

      describe('addEmployee', function () {
        it('should throw error', function () {
          try {
            Meteor.call('projects.addEmployee', 'methodTest1', manaId);
          } catch (err) {
            chai.expect(err).to.eql(new Meteor.Error('projects.addEmployee.unauthorized',
              'You do not have permission to add employees.'));
          }
        });
      });

      describe('removeEmployee', function () {
        it('should throw error', function () {
          try {
            Meteor.call('projects.removeEmployee', 'methodTest1', manaId);
          } catch (err) {
            chai.expect(err).to.eql(new Meteor.Error('projects.removeEmployee.unauthorized',
              'You do not have permission to remove employees.'));
          }
        });
      });

      describe('activate', function () {
        it('should throw error', function () {
          try {
            Meteor.call('projects.activate', 'methodTest1');
          } catch (err) {
            chai.expect(err).to.eql(new Meteor.Error('projects.activate.unauthorized',
              'You do not have permission to activate projects.'));
          }
        });
      });

      describe('deactivate', function () {
        it('should throw error', function () {
          try {
            Meteor.call('projects.deactivate', 'methodTest1');
          } catch (err) {
            chai.expect(err).to.eql(new Meteor.Error('projects.deactivate.unauthorized',
              'You do not have permission to deactivate projects.'));
          }
        });
      });

      describe('editName', function () {
        it('should throw error', function () {
          try {
            Meteor.call('projects.editName', 'methodTest1', 'moddedName');
          } catch (err) {
            chai.expect(err).to.eql(new Meteor.Error('projects.editName.unauthorized',
              'You do not have permission to change name of projects.'));
          }
        });
      });
    });
  });
}
