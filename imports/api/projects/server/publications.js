import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import '../projects.js';

/* global Projects:true*/
/* eslint no-undef: "error"*/

Meteor.publish('projects', function projectsPublish() {
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

Meteor.publish('projectGet', function retrieveProject(projectId) {
  check(projectId, String);
  const currentUser = Meteor.users.findOne(this.userId);

  if (currentUser == null || currentUser.profile == null) {
    return null;
  }

  if (currentUser.profile.isAdmin) {
    const project = Projects.find({ _id: projectId });
    return project;
  }

  const project = Projects.find({ $and: [{ _id: projectId }, { $or: [{
    managers: this.userId }, { employees: this.userId }] }] });
  return project;
});
