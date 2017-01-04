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
  return {
    user: !!user || false,
    isAdmin,
    projectReady,
    project: project || {},
  };
}, SubmitRequestPage);

module.exports = SubmitRequestContainer;
