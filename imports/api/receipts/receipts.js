import { FS } from 'meteor/cfs:base-package';

/* global Receipts:true*/
/* eslint no-undef: "error"*/

const receiptStore = new FS.Store.GridFS('receipts');

Receipts = new FS.Collection('receipts', {
  stores: [receiptStore],
  filter: {
    allow: {
      contentTypes: ['image/*', 'application/pdf'],
    },
  },
});
