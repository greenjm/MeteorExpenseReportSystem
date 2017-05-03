import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import ReportDetail from '../pages/reportDetail.jsx';

/* global Reports:true*/
/* global Requests:true*/
/* eslint no-undef: "error"*/

const ReportDetailContainer = createContainer(({ params }) => {
  const { reportId } = params;
  const mode = params.mode;
  const user = Meteor.user();
  const profile = user && user.profile;
  const isAdmin = profile && profile.isAdmin;

  // Subscriptions
  const reportSub = Meteor.subscribe('reports');
  const requestSub = Meteor.subscribe('requests');

  // Ready
  const reportReady = reportSub.ready();
  const requestReady = requestSub.ready();

  // Data
  const report = reportReady && Reports.findOne(reportId);

  const receiptSub = Meteor.subscribe('reportReceipts', report ? report.approvedRequests : []);
  const receiptReady = receiptSub.ready();

  const requests = [];
  for (let x = 0; reportReady && x < report.approvedRequests.length; x += 1) {
    let request = requestReady && Requests.findOne(report.approvedRequests[x]);
    if (request == undefined) {
      request = {};
    }
    request.receipt = request.receipt && receiptReady && request.receipt.getFileRecord();
    requests.push(request);
  }

  // Breadcrumbs
  let breadcrumbs = [];
  breadcrumbs = [
    {
      page: 'Admin Dashboard',
      url: '/#/adminDashboard',
    },
    {
      page: 'Report Detail',
      url: `/#/report/${reportId}`,
    },
  ];

  return {
    breadcrumbs,
    user: !!user || false,
    reportId,
    isAdmin,
    report,
    mode,
    userId: report ? report.userId : '',
    approvedRequests: requests,
    month: report ? report.month : 0,
    year: report ? report.year : 0,
  };
}, ReportDetail);

module.exports = ReportDetailContainer;
