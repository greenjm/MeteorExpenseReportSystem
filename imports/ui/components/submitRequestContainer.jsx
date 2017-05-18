import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import SubmitRequestPage from '../pages/submitRequest.jsx';

/* global Projects:true*/
/* eslint no-undef: "error"*/

const SubmitRequestContainer = createContainer(({ params }) => {
  const { projectId } = params;
  const user = Meteor.user();
  const profile = user && user.profile;
  const isAdmin = profile && profile.isAdmin;
  const projectSub = Meteor.subscribe('projects');
  const projectReady = projectSub.ready();
  const project = projectReady && Projects.findOne(projectId);

  let projects = [];
  if (isAdmin) {
    projects = Projects.find().fetch();
  } else {
    projects = user && Projects.find({ employees: user._id }).fetch();
  }

  // Breadcrumbs
  let breadcrumbs = [];
  if (projectId !== null && projectId !== undefined) {
    breadcrumbs = [
      {
        page: 'User Dashboard',
        url: '/#/dashboard',
      },
      {
        page: 'Submit MPA',
        url: `/#/submitRequest/${projectId}`,
      },
    ];
  } else {
    breadcrumbs = [
      {
        page: 'User Dashboard',
        url: '/#/dashboard',
      },
      {
        page: 'Submit MPA',
        url: '/#/submitRequest',
      },
    ];
  }

  return {
    breadcrumbs,
    user: !!user || false,
    isAdmin,
    projectReady,
    project: project || {},
    projects,
  };
}, SubmitRequestPage);

module.exports = SubmitRequestContainer;
