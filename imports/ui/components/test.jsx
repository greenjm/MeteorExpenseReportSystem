import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import '../../api/receipts/receipts.js';

/* global Requests Receipts:true*/
/* eslint no-undef: "error"*/

const React = require('react');

const Test = React.createClass({

  getInitialState() {
    return {
      reqId: 'xApAfpW3CexRXce54',
      fileUrl: '',
      fileName: '',
    };
  },

  componentWillMount() {
    const reqId = this.state.reqId;
    Tracker.autorun(() => {
      const sub = Meteor.subscribe('receiptGet', reqId);
      if (sub.ready()) {
        const req = Requests.findOne(this.state.reqId);
        const fileObj = req.receipt.getFileRecord();
        this.setState({ fileUrl: fileObj.url(), fileName: fileObj.name() });
      }
    });
  },

  handleChange(event) {
    const fileObj = Receipts.insert(event.target.files[0]);
    Meteor.call('receipts.attachToRequest', this.state.reqId, fileObj, (err) => {
      if (err) {
        console.log(err);
      }
    });
  },

  test(e) {
    e.preventDefault();
  },

  render() {
    return (
      <form onSubmit={this.test}>
        <input type="file" onChange={this.handleChange} />
        <a href={this.state.fileUrl} rel="noopener noreferrer" target="_blank">{this.state.fileName}</a>
      </form>
      );
  },

});

module.exports = Test;
