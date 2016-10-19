// import { Meteor } from 'meteor/meteor';
// import { Factory } from 'meteor/dburles:factory';
// import StubCollections from 'meteor/hwillson:stub-collections';
// import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
// import { chai } from 'meteor/practicalmeteor:chai';
// import { Accounts } from 'meteor/accounts-base';

// import { Projects } from '../projects.js';
// import './publications.js';
// import '../../../startup/server/fixtures.js';

/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
/* global describe it:true */

describe('ProjectPublicationCollections', function () {
  // beforeEach(function () {
  //   StubCollections.stub([Meteor.users]);
  // });

  // afterEach(function () {
  //   StubCollections.restore();
  // });

  // it('should be able to instantiate', function () {
  //   const instance = new PublicationCollector();
  //   chai.assert.ok(instance);
  // });

  // describe('Collecting', function () {
  //   it('should collect all documents', function () {
  //     Accounts.createUser({
  //       _id: 'testing',
  //       username: 'collector+admin',
  //       email: 'collector+admin@rose-hulman.edu',
  //       password: '12345678',
  //       profile: {
  //         name: 'collector Admin',
  //         isAdmin: true,
  //         autoInternet: true,
  //         autoPhone: true,
  //       },
  //     });
  //     // const userToUse = Meteor.users.findOne({ 'profile.isAdmin': true });
  //     console.log(Meteor.users.find());
  //     const collector = new PublicationCollector({ userId: 'testing' });

  //     collector.collect('projects', function (collections) {
  //       chai.assert.typeOf(collections.documents, 'array');
  //       chai.assert.equal(collections.documents.length, 5);
  //     });
  //   });
  // });
  it('should just work', function () {
    console.log('I am at publications test!');
  });
});
