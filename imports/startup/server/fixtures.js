import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '../../api/projects/projects.js';
import '../../api/requests/requests.js';
import '../../api/reports/reports.js';
import '../../api/receipts/receipts.js';
import '../../api/notifications/notifications.js';

/* global Projects Requests Reports Notifications Receipts:true*/
/* eslint no-undef: "error"*/
function seedUsers() {
  const users = ['greenjm', 'havensid', 'kerrickm', 'weissna'];

  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    Accounts.createUser({
      username: `${user}+admin`,
      email: `${user}+admin@rose-hulman.edu`,
      password: '12345678',
      profile: {
        name: `${user} Admin`,
        isAdmin: true,
        fullTime: true,
      },
    });
    Accounts.createUser({
      username: user,
      email: `${user}@rose-hulman.edu`,
      password: '12345678',
      profile: {
        name: user,
        isAdmin: false,
        fullTime: true,
      },
    });
  }
}

function seedProjects() {
  for (let i = 0; i < 5; i += 1) {
    let userIndex = i;
    let empIndex = i + 1;
    if (userIndex >= Meteor.users.find().count()) {
      userIndex = 0;
      empIndex = 0;
    }
    const user = Meteor.users.find().fetch()[userIndex];
    const emp = Meteor.users.find().fetch()[empIndex];
    Projects.insert({
      name: `Test Project ${i}`,
      managers: [user._id],
      employees: [emp._id, user._id],
      bornOn: new Date(),
      isActive: true,
      inactiveDate: null,
    });
  }
}

// Uncomment the following line to reseed users
// Meteor.users.remove({});
if (Meteor.users.find().count() <= 0) {
  // Seed new users
  seedUsers();
}

// Uncomment the following line to reseed projects
// Projects.remove({});
// Requests.remove({});
// Reports.remove({});
// Notifications.remove({});
// Receipts.remove({});
if (Projects.find().count() <= 0) {
  // Seed new projects
  seedProjects();
}
