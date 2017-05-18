import { FS } from 'meteor/cfs:base-package';

/* global Receipts:true*/
/* eslint no-undef: "error"*/

/**
  Receipts uses the CollectionFS package for storage. More information can be
  found at https://github.com/CollectionFS/Meteor-CollectionFS
*/

const receiptStore = new FS.Store.GridFS('receipts');

Receipts = new FS.Collection('receipts', {
  stores: [receiptStore],
  filter: {
    allow: {
      contentTypes: ['image/*', 'application/pdf'],
    },
  },
});
