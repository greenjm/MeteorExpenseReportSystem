import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/fixtures.js';

// Methods
import '../imports/api/users/methods.js';
import '../imports/api/projects/methods.js';

// Collections
import '../imports/api/projects/projects.js';

// Publications
import '../imports/api/projects/server/publications.js';
import '../imports/api/users/server/publications.js';

Meteor.startup(() => {
  // code to run on server at startup
  process.env.MAIL_URL = 'smtp://meteor.no.reply%40gmail.com:Password&123@smtp.gmail.com:465';
});
