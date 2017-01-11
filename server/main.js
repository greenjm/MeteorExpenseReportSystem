import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/fixtures.js';

// Methods
import '../imports/api/users/methods.js';
import '../imports/api/projects/methods.js';
import '../imports/api/requests/methods.js';
import '../imports/api/notifications/methods.js';

// Collections
import '../imports/api/projects/projects.js';
import '../imports/api/requests/requests.js';
import '../imports/api/notifications/notifications.js';

// Publications
import '../imports/api/projects/server/publications.js';
import '../imports/api/users/server/publications.js';
import '../imports/api/requests/server/publications.js';
import '../imports/api/notifications/server/publications.js';

Meteor.startup(() => {
  // code to run on server at startup
  process.env.MAIL_URL = 'smtp://meteor.no.reply%40gmail.com:Password&123@smtp.gmail.com:465';
});
