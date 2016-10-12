import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/fixtures.js';

// Methods
import '../imports/api/login.js';
import '../imports/api/users/methods.js';
import '../imports/api/projects/methods.js';

// Collections
import '../imports/api/projects/projects.js';

// Publications
import '../imports/api/projects/server/publications.js';
import '../imports/api/users/server/publications.js';

Meteor.startup(() => {
  // code to run on server at startup
});
