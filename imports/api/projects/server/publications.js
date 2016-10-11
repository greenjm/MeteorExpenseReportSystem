import { Meteor } from 'meteor/meteor';
import '../projects.js';

/* global Projects:true*/
/* eslint no-undef: "error"*/

Meteor.publish('projects', () => {
  const currentUser = Meteor.users.findOne(this.userId);

  if (currentUser == null || currentUser.profile == null) {
    return null;
  }

  if (currentUser.profile.isAdmin) {
    const projects = Projects.find();
    return projects;
  }

  const projects = Projects.find({ $or: [{
    managers: this.userId }, { employees: this.userId }] });
  return projects;
});
