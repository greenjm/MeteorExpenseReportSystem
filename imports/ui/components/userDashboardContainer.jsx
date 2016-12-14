import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import UserDashboardPage from '../pages/userDashboard.jsx';

/* global Requests Projects:true*/
/* eslint no-undef: "error"*/

const UserDashboardContainer = createContainer(() => {
  const user = Meteor.user();
  const profile = user && user.profile;
  const isAdmin = profile && profile.isAdmin;
  const name = profile && profile.name;

  // Subscriptions
  const projectSub = Meteor.subscribe('projects');
  const requestSub = Meteor.subscribe('requests');
  let userNameSub = null;

  // Subscription ready
  const projectReady = projectSub.ready();
  const requestReady = requestSub.ready();
  let userReady = null;

  // Projects and Requests
  const projects = projectReady && Projects.find().fetch();
  const requests = requestReady && Requests.find().fetch();
  const requestUserIds = requestReady && Requests.find({}, { _id: 0, userId: 1 }).fetch();
  let users = [];
  if (requestUserIds) {
    userNameSub = Meteor.subscribe('usersNames', requestUserIds);
    userReady = userNameSub.ready();
    users = userReady && Meteor.users.find().fetch();
  }

  // Helper props
  const isManager = projectReady && (Projects.find({ managers: this.userId }).count() > 0);
  const isEmployee = projectReady && (Projects.find({ employees: this.userId }).count() > 0);

  return {
    user: !!user || false,
    isAdmin,
    name,
    projects,
    requests,
    users,
    isManager,
    isEmployee,
  };
}, UserDashboardPage);

module.exports = UserDashboardContainer;
