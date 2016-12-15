import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import ProjectDetailPage from '../pages/projectDetail.jsx';

/* global Projects:true*/
/* eslint no-undef: "error"*/

const ProjectDetailContainer = createContainer(({ params }) => {
  const projectId = params.projectId;
  const mode = params.mode;
  const user = Meteor.user();
  const profile = user && user.profile;
  const isAdmin = profile && profile.isAdmin;

  // Subscriptions
  const projectSub = Meteor.subscribe('projectGet', projectId);
  const userSub = Meteor.subscribe('users');

  // Ready
  const projectReady = projectSub.ready();
  const userReady = userSub && userSub.ready();

  // Data
  const project = projectReady && Projects.findOne(projectId);
  const users = userReady && Meteor.users.find().fetch();
  return {
    user: !!user || false,
    isAdmin,
    projectReady,
    mode,
    name: project ? project.name : '',
    managers: project ? project.managers : [],
    employees: project ? project.employees : [],
    bornOn: project ? project.bornOn.toString() : '',
    active: project ? !!project.isActive : false,
    users: userReady ? users : [],
  };
}, ProjectDetailPage);

module.exports = ProjectDetailContainer;
