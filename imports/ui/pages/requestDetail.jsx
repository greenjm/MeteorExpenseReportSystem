import { Table, TableRow, TableRowColumn, TableBody }
  from 'material-ui/Table';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import Paper from 'material-ui/Paper';
import { hashHistory } from 'react-router';

import Header from '../components/header.jsx';
import '../../api/requests/requests.js';

/* global Requests:true*/
/* eslint no-undef: "error"*/

const React = require('react');

// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const RequestDetail = React.createClass({
  propTypes() {
    return {
      location: React.object,
    };
  },

  getInitialState() {
    return {
      requestId: this.props.location.query.id,
      description: '',
      estCost: 0,
      partNo: '',
      quantity: 0,
      unitCost: 0,
      vendor: '',
      status: null,
      statMsg: '',
      fileUrl: '',
    };
  },

  componentWillMount() {
    this.setState({
      description: this.props.description,
      estCost: this.props.estCost,
      partNo: this.props.partNo,
      quantity: this.props.quantity,
      unitCost: this.props.unitCost,
      vendor: this.props.vendor,
    });
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user || (!nextProps.requestOwned && !nextProps.isAdmin)) {
      hashHistory.push('/');
    }

    const descChange = this.state.description !== nextProps.description;
    const estCostChange = this.state.estCost !== nextProps.estCost;
    const partNoChange = this.state.partNo !== nextProps.partNo;
    const quantityChange = this.state.quantity !== nextProps.quantity;
    const unitCostChange = this.state.unitCost !== nextProps.unitCost;
    const vendorChange = this.state.vendor !== nextProps.vendor;
    this.setState({
      description: descChange ? nextProps.description : this.state.description,
      estCost: estCostChange ? nextProps.estCost : this.state.estCost,
      partNo: partNoChange ? nextProps.partNo : this.state.partNo,
      quantity: quantityChange ? nextProps.quantity : this.state.quantity,
      unitCost: unitCostChange ? nextProps.unitCost : this.state.unitCost,
      vendor: vendorChange ? nextProps.vendor : this.state.vendor,
    });
  },

  // State Bindings
  changeDescription(e) {
    this.setState({ description: e.target.value });
  },

  changeEstCost(e) {
    this.setState({ estCost: e.target.value });
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

  changeFileUrl(e) {
    this.setState({ fileUrl: e.target.value });
  },

  editRequest() {
    // not sure what the api endpoint is for editing a request
    const req = {
      description: this.state.description,
      estCost: this.state.estCost,
      partNo: this.state.partNo,
      quantity: this.state.quantity,
      unitCost: this.state.unitCost,
      vendor: this.state.vendor,
      status: this.state.status,
      statMsg: this.state.statMsg,
      fileUrl: this.state.fileUrl,
    };

    console.log(req);
    // send the req object
  },

  render() {
    return (
      <div>
        <Header />
        <Paper style={paperStyle} zDepth={1}>Expense Requests</Paper>
        <br />
        <br />
        <Grid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Table>
                <TableBody displayRowCheckbox={false}>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Description</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <input name="name" type="text" value={this.state.description} onChange={this.changeDescription} />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Total Cost</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <div>{this.state.estCost}</div>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Part Number</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <input name="name" type="text" value={this.state.partNo} onChange={this.changePartNo} />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Quantity</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <input name="name" type="text" value={this.state.quantity} onChange={this.changeQuantity} />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Unit Cost</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <input name="name" type="text" value={this.state.unitCost} onChange={this.changeUnitCost} />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Vendor</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <input name="name" type="text" value={this.state.vendor} onChange={this.changeVendor} />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">File URL</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <input name="name" type="text" value={this.state.fileUrl} onChange={this.changeFileUrl} />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Status</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <input name="name" type="text" value={this.state.status} disabled />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <label htmlFor="name">Status Message</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <input name="name" type="text" value={this.state.statMsg} disabled />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <button onClick={this.editRequest}>Save Changes</button>
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
