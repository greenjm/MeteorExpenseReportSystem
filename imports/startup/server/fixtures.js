import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '../../api/projects/projects.js';

/* global Projects:true*/
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
        autoInternet: true,
        autoPhone: true,
      },
    });
    Accounts.createUser({
      username: user,
      email: `${user}@rose-hulman.edu`,
      password: '12345678',
      profile: {
        name: user,
        isAdmin: false,
        autoInternet: true,
        autoPhone: true,
      },
    });
  }
}

function seedProjects() {
  for (let i = 0; i < 5; i += 1) {
    let userIndex = i;
    if (userIndex >= Meteor.users.find().count()) {
      userIndex = 0;
    }
    const user = Meteor.users.find().fetch()[userIndex];
    Projects.insert({
      name: `Test Project ${i}`,
      managers: [user._id],
      employees: [],
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
if (Projects.find().count() <= 0) {
  // Seed new projects
  seedProjects();
}
