import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RequestDetailPage from '../pages/requestDetail.jsx';

/* global Requests:true*/
/* eslint no-undef: "error"*/

const RequestDetailContainer = createContainer(({ params }) => {
  const { requestId } = params;
  const user = Meteor.user();
  const profile = user && user.profile;
  const isAdmin = profile && profile.isAdmin;
  const requestSub = Meteor.subscribe('requests');
  const requestReady = requestSub.ready();
  const request = requestReady && Requests.findOne(requestId);
  const requestOwned = user && request && user._id === request.userId;
  return {
    user: !!user || false,
    isAdmin,
    requestReady,
    description: request ? request.description : '',
    estCost: request ? request.estCost : 0,
    partNo: request ? request.partNo : '',
    quantity: request ? request.quantity : 0,
    unitCost: request ? request.unitCost : 0,
    vendor: request ? request.vendor : '',
    requestOwned,
  };
}, RequestDetailPage);

module.exports = RequestDetailContainer;
