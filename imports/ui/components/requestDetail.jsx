import { Table, TableRow, TableRowColumn, TableBody }
  from 'material-ui/Table';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import Paper from 'material-ui/Paper';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import Header from './header.jsx';
import '../../api/requests/requests.js';

/* global Requests:true*/
/* eslint no-undef: "error"*/

const React = require('react');

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
      description: '',
      estCost: 0,
      partNo: '',
      quantity: 0,
      unitcost: 0,
      vendor: '',
    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      Meteor.subscribe('requests', () => {
        const reqs = Requests.find().fetch();
        const id = this.props.location.query.id;
        let req = null;
        for (let x = 0; x < reqs.length; x += 1) {
          if (reqs[x]._id === id) {
            req = reqs[x];
            break;
          }
        }
        if (req) {
          this.setState({
            description: req.description,
            estCost: req.estCost,
            partNo: req.partNo,
            quantity: req.quantity,
            unitCost: req.unitCost,
            vendor: req.vendor,
          });
        }
      });
    });
  },

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
    this.setState({ quantity: e.target.value });
  },

  changeUnitCost(e) {
    this.setState({ unitCost: e.target.value });
  },

  changeVendor(e) {
    this.setState({ vendor: e.target.value });
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
                      <label htmlFor="name">Estimated Cost</label>
                    </TableRowColumn>
                    <TableRowColumn>
                      <input name="name" type="text" value={this.state.estCost} onChange={this.changeEstCost} />
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
