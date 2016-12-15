// /* eslint-env mocha */
// /* eslint-disable func-names, prefer-arrow-callback */
// /* global Requests describe it:true */

// import { Meteor } from 'meteor/meteor';
// import { Factory } from 'meteor/dburles:factory';
// // import StubCollections from 'meteor/hwillson:stub-collections';
// import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
// import { chai } from 'meteor/practicalmeteor:chai';
// import { Accounts } from 'meteor/accounts-base';
// // import { check } from 'meteor/check';
// // import { Random } from 'meteor/random';

// // Following import used for ValidatedMethods
// // import { createProject } from './methods.js';


// // import './requests.js';


// if (Meteor.isServer) {
//   // eslint-disable-next-line import/no-unresolved
//   import './server/publications.js';
//   import './methods.js';

//   const adminId = Accounts.createUser({
//     username: 'REQUESTuser1+admin',
//     email: 'REQUESTuser+admin@rose-hulman.edu',
//     password: '12345678',
//     profile: {
//       isAdmin: true,
//     },
//   });

//   const manaId = Accounts.createUser({
//     username: 'REQUESTuser2',
//     email: 'REQUESTuser2@rose-hulman.edu',
//     password: '12345678',
//     profile: {
//       isAdmin: false,
//     },
//   });

//   const empId = Accounts.createUser({
//     username: 'REQUESTuser3',
//     email: 'REQUESTuser3@rose-hulman.edu',
//     password: '12345678',
//     profile: {
//       isAdmin: false,
//     },
//   });

//   describe('requests testing', function () {
//     describe('mutators', function () {
//       it('should create from the Factory', function () {
//         const proj = Factory.create('request');
//         chai.assert.typeOf(proj, 'object');
//       });
//     });

//     describe('publications', function () {
//       beforeEach(function () {
//         Requests.remove({});
//         Factory.create('request');
//         Factory.create('request', { userId: [manaId] });
//         Factory.create('request', { userId: [empId] });
//       });

//       describe('requestPublish', function () {
//         it('should return all requests for an admin', function () {
//           const collector = new PublicationCollector({ userId: adminId });
//           collector.collect('requests', (collections) => {
//             chai.assert.typeOf(collections.requests, 'array');
//             chai.assert.equal(collections.requests.length, 3);
//           });
//         });

//         it('should return all requests for a manager', function () {
//           const collector = new PublicationCollector({ userId: manaId });
//           collector.collect('requests', (collections) => {
//             chai.assert.typeOf(collections.requests, 'array');
//             chai.assert.equal(collections.requests.length, 1);
//           });
//         });

//         it('should return all requests for an employee', function () {
//           const collector = new PublicationCollector({ userId: empId });
//           collector.collect('requests', (collections) => {
//             chai.assert.typeOf(collections.requests, 'array');
//             chai.assert.equal(collections.requests.length, 1);
//           });
//         });
//       });
//     });

//     // describe('methods', function () {});
//   });
// }
