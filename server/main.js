import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/fixtures.js';
import '../imports/api/login.js';
import '../imports/api/users/methods.js';
import '../imports/api/projects/projects.js';
import '../imports/api/projects/methods.js';
import '../imports/api/projects/server/publications.js';

Meteor.startup(() => {
  // code to run on server at startup
});
