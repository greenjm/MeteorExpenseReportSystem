/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
/* global Projects describe it:true */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
// import StubCollections from 'meteor/hwillson:stub-collections';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { chai } from 'meteor/practicalmeteor:chai';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';

import './projects.js';


if (Meteor.isServer) {
  // eslint-disable-next-line import/no-unresolved
  import './server/publications.js';

  describe('projects testing', function () {
    describe('mutators', function () {
      it('should create from the Factory', function () {
        const proj = Factory.create('project');
        chai.assert.typeOf(proj, 'object');
      });
    });

    describe('publications', function () {
      const adminId = Random.id();
      Accounts.createUser({
        _id: adminId,
        username: 'user1+admin',
        email: 'user+admin@rose-hulman.edu',
        password: '12345678',
        profile: {
          isAdmin: true,
        },
      });

      const manaId = Random.id();
      Accounts.createUser({
        _id: manaId,
        username: 'user2',
        email: 'user2@rose-hulman.edu',
        password: '12345678',
        profile: {
          isAdmin: false,
        },
      });

      const empId = Random.id();
      Accounts.createUser({
        _id: empId,
        username: 'user3',
        email: 'user3@rose-hulman.edu',
        password: '12345678',
        profile: {
          isAdmin: false,
        },
      });

      console.log(Meteor.users.findOne(adminId));

      beforeEach(function () {
        Projects.remove({});
        Factory.create('project');
        Factory.create('project', { managers: [manaId] });
        Factory.create('project', { employees: [empId] });
        Factory.create('project', { managers: [manaId], employees: [empId] });
      });

      // describe('projectsPublish', function () {
      //   it('should return all projects for an admin', function () {
      //     const collector = new PublicationCollector({ adminId });
      //     collector.collect('projects', (collections) => {
      //       chai.assert.typeOf(collections.Projects, 'array');
      //       chai.assert.equal(collections.Projects.length, 4);
      //     });
      //   });
      // });

      describe('projectsPublish', function () {
        it('should return all projects for a manager', function () {
          const collector = new PublicationCollector({ userId: manaId });
          collector.collect('projects', (collections) => {
            chai.assert.typeOf(collections.Projects, 'array');
            chai.assert.equal(collections.Projects.length, 2);
          });
        });
      });
    });
  });
}
