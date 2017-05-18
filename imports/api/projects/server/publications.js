/* global Projects:true*/
/* eslint no-undef: "error"*/


import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import '../projects.js';


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

Meteor.publish('projectNames', function projectNamesPublish(projectIdList) {
  // Given a list of userIds, return the name of those users
  check(projectIdList, Array);

  const currentUser = Meteor.users.findOne(this.userId);

  if (currentUser == null || currentUser.profile == null) {
    return null;
  }

  const ids = [];
  for (let i = 0; i < projectIdList.length; i += 1) {
    if (!projectIdList[i].projectId) {
      break;
    }
    ids.push(projectIdList[i].projectId);
  }

  const find = { $or: [{ _id: { $in: ids } }, { _id: { $in: projectIdList } }] };
  const projection = { name: 1 };
  const names = Projects.find(find, projection);
  return names;
});
