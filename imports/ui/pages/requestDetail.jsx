import { Meteor } from 'meteor/meteor';
import { Table, TableRow, TableRowColumn, TableBody }
  from 'material-ui/Table';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import { FS } from 'meteor/cfs:base-package';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import { hashHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Header from '../components/header.jsx';
import '../../api/requests/requests.js';

/* global Requests Receipts:true*/
/* eslint no-undef: "error"*/

const React = require('react');

// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const fileInputStyle = {
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  width: '100%',
  opacity: 0,
};

const RequestDetail = React.createClass({
  propTypes() {
    return {
      location: React.object,
    };
  },

  getInitialState() {
    return {
      requestId: '',
      readDescription: '',
      description: '',
      estCost: 0,
      readPartNo: '',
      partNo: '',
      readQuantity: 0,
      quantity: 0,
      readUnitCost: 0,
      unitCost: 0,
      readVendor: '',
      vendor: '',
      status: null,
      statMsg: '',
      readStyle: {},
      editStyle: { display: 'none' },
      isUploading: false,
      receipt: null,
      successfulSubmission: false,
    };
  },

  componentWillMount() {
    this.setState({
      requestId: this.props.requestId,
      readDescription: this.props.description,
      description: this.props.description,
      estCost: this.props.estCost,
      readPartNo: this.props.partNo,
      partNo: this.props.partNo,
      readQuantity: this.props.quantity,
      quantity: this.props.quantity,
      readUnitCost: this.props.unitCost,
      unitCost: this.props.unitCost,
      readVendor: this.props.vendor,
      vendor: this.props.vendor,
      status: this.props.status,
      statMsg: this.props.statMsg,
      receipt: this.props.receipt,
    });
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user ||
        (nextProps.requestReady && !nextProps.requestOwned && !nextProps.isAdmin)) {
      hashHistory.push('/');
    }

    const requestIdChange = this.state.requestId !== nextProps.requestId;
    const descChange = this.state.description !== nextProps.description;
    const estCostChange = this.state.estCost !== nextProps.estCost;
    const partNoChange = this.state.partNo !== nextProps.partNo;
    const quantityChange = this.state.quantity !== nextProps.quantity;
    const unitCostChange = this.state.unitCost !== nextProps.unitCost;
    const vendorChange = this.state.vendor !== nextProps.vendor;
    const statusChange = this.state.status !== nextProps.status;
    const statMsgChange = this.state.statMsg !== nextProps.statMsg;
    const receiptChange = this.state.receipt !== nextProps.receipt;
    this.setState({
      requestId: requestIdChange ? nextProps.requestId : this.state.requestId,
      readDescription: descChange ? nextProps.description : this.state.description,
      description: descChange ? nextProps.description : this.state.description,
      estCost: estCostChange ? nextProps.estCost : this.state.estCost,
      readPartNo: partNoChange ? nextProps.partNo : this.state.partNo,
      partNo: partNoChange ? nextProps.partNo : this.state.partNo,
      readQuantity: quantityChange ? nextProps.quantity : this.state.quantity,
      quantity: quantityChange ? nextProps.quantity : this.state.quantity,
      readUnitCost: unitCostChange ? nextProps.unitCost : this.state.unitCost,
      unitCost: unitCostChange ? nextProps.unitCost : this.state.unitCost,
      readVendor: vendorChange ? nextProps.vendor : this.state.vendor,
      vendor: vendorChange ? nextProps.vendor : this.state.vendor,
      status: statusChange ? nextProps.status : this.state.status,
      statMsg: statMsgChange ? nextProps.statMsg : this.state.statMsg,
      receipt: receiptChange ? nextProps.receipt : this.state.receipt,
    });
  },

  // State Bindings
  changeDescription(e) {
    this.setState({ description: e.target.value });
  },

  changePartNo(e) {
    this.setState({ partNo: e.target.value });
  },

  changeQuantity(e) {
    const newState = {
      quantity: e.target.value,
      estCost: this.state.unitCost * e.target.value,
    };

    this.setState(newState);
  },

  changeUnitCost(e) {
    const newState = {
      unitCost: e.target.value,
      estCost: this.state.quantity * e.target.value,
    };

    this.setState(newState);
  },

  changeVendor(e) {
    this.setState({ vendor: e.target.value });
  },

  editRequest() {
    this.setState({ readStyle: { display: 'none' }, editStyle: {} });
  },

  cancelEdit() {
    this.setState({
      readStyle: {},
      editStyle: { display: 'none' },
      description: this.state.readDescription,
      estCost: this.state.readUnitCost * this.state.readQuantity,
      partNo: this.state.readPartNo,
      quantity: this.state.readQuantity,
      unitCost: this.state.readUnitCost,
      vendor: this.state.readVendor,
    });
  },

  goBack() {
    hashHistory.push('/dashboard');
  },

  saveRequest() {
    Meteor.call('requests.edit',
      this.state.requestId,
      this.state.description,
      this.state.estCost,
      this.state.vendor,
      this.state.partNo,
      +this.state.quantity,
      +this.state.unitCost,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          setTimeout(this.dismissSpinner, 2000);
          this.setState({
            successfulSubmission: true,
          });
          this.cancelEdit();
        }
      }
    );
  },

  dismissSpinner() {
    this.setState({ successfulSubmission: false });
  },

  uploadReceipt(e) {
    const reqId = this.state.requestId;
    const fileObj = new FS.File(e.target.files[0]);
    fileObj.owner = Meteor.userId();
    fileObj.requestId = reqId;
    fileObj.bornOn = new Date();
    const upload = Receipts.insert(fileObj);
    this.setState({ isUploading: true });
    Meteor.call('receipts.attachToRequest', reqId, upload, (err) => {
      if (err) {
        console.log(err);
      } else {
        this.setState({ isUploading: false });
      }
    });
  },

  render() {
    let receiptRightColumn = null;
    if (this.state.isUploading) {
      receiptRightColumn = (
        <CircularProgress />
      );
    } else if (!this.state.receipt) {
      receiptRightColumn = (
        <RaisedButton
          label="Upload Receipt"
          labelPosition="before"
          containerElement="label"
        >
          <input type="file" onChange={this.uploadReceipt} style={fileInputStyle} />
        </RaisedButton>
      );
    } else {
      receiptRightColumn = (
        <a href={this.state.receipt.url()} rel="noopener noreferrer" target="_blank">{this.state.receipt.name()}</a>
      );
    }

    let statusValue = '';
    if (this.state.status) {
      statusValue = 'Approved';
    } else if (this.state.status === false) {
      statusValue = 'Rejected';
    }

    return (
      <div>
        <Header />
        <Paper style={paperStyle} zDepth={1}>Expense Requests</Paper>
        <br />
        <br />
        <Grid>
          {!this.state.status &&
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <RaisedButton
                  label="Edit"
                  primary
                  onClick={this.editRequest}
                  style={{ float: 'right' }}
                />
                <RaisedButton
                  label="Cancel"
                  onClick={this.goBack}
                  style={{ float: 'right', marginRight: '6px' }}
                />
              </Col>
            </Row>
          }
          <br />
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Table>
                <TableBody displayRowCheckbox={false}>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Description</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <p
                        id="readDescription"
                        style={{ ...this.state.readStyle, ...{ 'white-space': 'normal' } }}
                      >
                        {this.state.readDescription}
                      </p>
                      <TextField
                        hintText="Description"
                        multiLine
                        value={this.state.description}
                        fullWidth
                        onChange={this.changeDescription}
                        style={this.state.editStyle}
                      />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Total Cost</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <p>{this.state.estCost}</p>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Part Number</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <p style={this.state.readStyle} >{this.state.readPartNo}</p>
                      <TextField
                        hintText="Part Number"
                        value={this.state.partNo}
                        fullWidth
                        onChange={this.changePartNo}
                        style={this.state.editStyle}
                      />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Quantity</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <p style={this.state.readStyle} >{this.state.readQuantity}</p>
                      <TextField
                        hintText="Quantity"
                        value={this.state.quantity}
                        fullWidth
                        type="number"
                        onChange={this.changeQuantity}
                        style={this.state.editStyle}
                      />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Unit Cost</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <p style={this.state.readStyle} >{this.state.readUnitCost}</p>
                      <TextField
                        hintText="Unit Cost"
                        value={this.state.unitCost}
                        fullWidth
                        onChange={this.changeUnitCost}
                        style={this.state.editStyle}
                      />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Vendor</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <p style={this.state.readStyle} >{this.state.readVendor}</p>
                      <TextField
                        hintText="Vendor"
                        value={this.state.vendor}
                        fullWidth
                        onChange={this.changeVendor}
                        style={this.state.editStyle}
                      />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Status</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <TextField
                        hintText="Pending"
                        value={statusValue}
                        fullWidth
                        readOnly
                      />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Status Message</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <TextField
                        hintText="Pending"
                        value={this.state.statMsg}
                        fullWidth
                        readOnly
                      />
                    </TableRowColumn>
                  </TableRow>
                  {this.state.status &&
                    <TableRow selectable={false}>
                      <TableRowColumn>
                        <label htmlFor="receipt">Receipt</label>
                      </TableRowColumn>
                      <TableRowColumn>
                        {receiptRightColumn}
                      </TableRowColumn>
                    </TableRow>
                  }
                  <TableRow selectable={false}>
                    <TableRowColumn />
                    <TableRowColumn>
                      {this.state.successfulSubmission && (
                        <div>
                          <div style={{ display: 'inline-block' }}>Your request was updated successfully. </div>
                          <CircularProgress size={20} style={{ margin: '3px' }} />
                        </div>
                      )}
                      <RaisedButton
                        label="Save Changes"
                        primary
                        onClick={this.saveRequest}
                        style={{ ...{ float: 'right', margin: 5 }, ...this.state.editStyle }}
                      />
                      <RaisedButton
                        label="Cancel"
                        primary
                        onClick={this.cancelEdit}
                        style={{ ...{ float: 'right', margin: 5 }, ...this.state.editStyle }}
                      />
                    </TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
});

module.exports = RequestDetail;
