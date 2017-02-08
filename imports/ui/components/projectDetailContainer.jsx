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
  const usersInProjectSub = Meteor.subscribe('usersInProject', projectId);

  // Ready
  const projectReady = projectSub.ready();
  const userReady = userSub && userSub.ready();
  const usersInProjectReady = usersInProjectSub && usersInProjectSub.ready();

  // Data
  const project = projectReady && Projects.findOne(projectId);
  const users = userReady && usersInProjectReady && project &&
    Meteor.users.find({
      $and: [
        {
          _id: { $not: { $in: project.employees } },
        },
        {
          _id: { $not: { $in: project.managers } },
        },
      ],
    }).fetch();
  const employees = userReady && projectReady && usersInProjectReady &&
    Meteor.users.find({ _id: { $in: project.employees } }).fetch();
  const managers = userReady && projectReady && usersInProjectReady &&
    Meteor.users.find({ _id: { $in: project.managers } }).fetch();

  // Breadcrumbs
  let breadcrumbs = [];
  if (mode === 'edit') {
    breadcrumbs = [
      {
        page: 'Admin Dashboard',
        url: '/#/adminDashboard',
      },
      {
        page: `Project Detail: ${project.name}`,
        url: `/#/project/edit/${projectId}`,
      },
    ];
  } else {
    breadcrumbs = [
      {
        page: 'User Dashboard',
        url: '/#/dashboard',
      },
      {
        page: `Project Detail: ${project.name}`,
        url: `/#/project/view/${projectId}`,
      },
    ];
  }

  return {
    breadcrumbs,
    user: !!user || false,
    projectId,
    inactiveDate: project ? project.inactiveDate : null,
    isAdmin,
    projectReady,
    mode,
    name: project ? project.name : '',
    managers: managers || [],
    employees: employees || [],
    bornOn: project ? project.bornOn.toString() : '',
    active: project ? !!project.isActive : false,
    users: userReady ? users : [],
  };
}, ProjectDetailPage);

module.exports = ProjectDetailContainer;
