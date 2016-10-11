import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '../api/login.js';
import '../api/users.js';
import '../api/projects.js';

function seedUsers() {
  const users = ['greenjm', 'havensid', 'kerrickm', 'weissna', 'johnsonl'];

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

Meteor.startup(() => {
  // code to run on server at startup
  if (Meteor.users.find().count() <= 0) {
    // Seed new users
    seedUsers();
  }
});
