import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RequestDetailPage from '../pages/requestDetail.jsx';

/* global Requests:true*/
/* global Projects:true*/
/* eslint no-undef: "error"*/

const RequestDetailContainer = createContainer(({ params }) => {
  const { requestId } = params;
  const user = Meteor.user();
  const profile = user && user.profile;
  const isAdmin = profile && profile.isAdmin;
  const requestSub = Meteor.subscribe('requests');
  const receiptSub = Meteor.subscribe('receipts');
  const projectSub = Meteor.subscribe('projects');
  const requestReady = requestSub.ready();
  const receiptReady = receiptSub.ready();
  const projectReady = projectSub.ready();
  const request = requestReady && Requests.findOne(requestId);
  const requestOwned = !!user && !!request && user._id === request.userId;
  const receipt = request && request.receipt && receiptReady && request.receipt.getFileRecord();
  const project = request && projectReady && Projects.findOne(request.projectId);
  const managerProjects = (projectReady && user &&
    Projects.find({ managers: user._id }).fetch()) || [];
  const isManager = managerProjects && managerProjects.length > 0;

  // Breadcrumbs
  const breadcrumbs = [
    {
      page: 'User Dashboard',
      url: '/#/dashboard',
    },
    {
      page: 'Request Detail',
      url: `/#/requestDetail/${requestId}`,
    },
  ];

  return {
    breadcrumbs,
    user: !!user || false,
    isAdmin,
    requestReady,
    requestId: request._id,
    projectId: request.projectId,
    description: request ? request.description : '',
    estCost: request ? request.estCost : 0,
    partNo: request ? request.partNo : '',
    quantity: request ? request.quantity : 0,
    unitCost: request ? request.unitCost : 0,
    vendor: request ? request.vendor : '',
    status: request ? request.status : null,
    statMsg: request ? request.statMsg : '',
    receipt,
    requestOwned,
    isManager,
    project: project || {},
    projects: Projects.find().fetch(),
  };
}, RequestDetailPage);

module.exports = RequestDetailContainer;
