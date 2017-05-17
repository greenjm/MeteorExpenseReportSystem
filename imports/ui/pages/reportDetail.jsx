import { hashHistory } from 'react-router';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import Paper from 'material-ui/Paper';
import { Table, TableRow, TableRowColumn, TableBody }
  from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import '../../api/projects/projects.js';
import Header from '../components/header.jsx';


/* global Reports:true*/
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

const ReportDetail = React.createClass({
  propTypes() {
    return {
      location: React.object,
    };
  },

  getInitialState() {
    return {
      breadcrumbs: [],
      reportId: '',
      isAdmin: false,
      report: {},
      userId: '',
      approvedRequests: [],
      month: 0,
      year: 0,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user || !nextProps.isAdmin) {
      hashHistory.push('/');
    }

    const userIdChange = this.state.userId !== nextProps.userId;
    const approvedRequestsChange = this.state.approvedRequests !== nextProps.approvedRequests;
    const monthChange = this.state.month !== nextProps.month;
    const yearChange = this.state.year !== nextProps.year;

    this.setState({
      userId: userIdChange ? nextProps.userId : this.state.userId,
      approvedRequests: approvedRequestsChange ? nextProps.approvedRequests
                                               : this.state.approvedRequests,
      month: monthChange ? nextProps.month : this.state.month,
      year: yearChange ? nextProps.year : this.state.year,
      mode: nextProps.mode,
      breadcrumbs: nextProps.breadcrumbs,
    });
  },

  createBreadcrumb(item) {
    return (
      <li><a href={item.url}>{item.page}</a></li>
    );
  },

  createRequestRow(request) {
    const receiptURL = request.receipt ? request.receipt.url() : '';
    return (
      <TableRow selectable={false}>
        <TableRowColumn style={{ width: '15%' }}>{request.vendor}</TableRowColumn>
        <TableRowColumn style={{ width: '15%' }}>{request.description}</TableRowColumn>
        <TableRowColumn style={{ width: '5%' }}>{request.partNo}</TableRowColumn>
        <TableRowColumn style={{ width: '5%' }}>{request.quantity}</TableRowColumn>
        <TableRowColumn style={{ width: '5%' }}>{request.estCost}</TableRowColumn>
        <TableRowColumn style={{ width: '5%' }}>{request.dateRequired}</TableRowColumn>
        <TableRowColumn style={{ width: '10%' }}>{request.intendedUsage}</TableRowColumn>
        <TableRowColumn style={{ width: '10%' }}>
          <a href={receiptURL} rel="noopener noreferrer" target="_blank">Receipt</a>
        </TableRowColumn>
      </TableRow>
    );
  },

  goBack() {
    hashHistory.push('/adminDashboard');
  },

  render() {
    return (
      <div>
        <Header isAdmin={this.props.isAdmin} />
        <Paper style={paperStyle} zDepth={1}>
          <ul className="breadcrumb">
            {this.state.breadcrumbs.map(this.createBreadcrumb)}
          </ul>
        </Paper>
        <br />
        <br />
        <Grid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Paper style={{ textAlign: 'center', padding: '10px' }} zDepth={1}>
                <Table>
                  <TableBody displayRowCheckbox={false}>
                    <TableRow selectable={false}>
                      <TableRowColumn style={{ width: '33%' }}>
                        <TextField
                          floatingLabelText="User ID"
                          value={this.state.userId}
                          readOnly
                        />
                      </TableRowColumn>
                      <TableRowColumn style={{ width: '33%' }}>
                        <TextField
                          floatingLabelText="Month"
                          value={this.state.month + 1}
                          readOnly
                        />
                      </TableRowColumn>
                      <TableRowColumn style={{ width: '33%' }}>
                        <TextField
                          floatingLabelText="Year"
                          value={this.state.year}
                          readOnly
                        />
                      </TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
                <br />
                <Table>
                  <TableBody displayRowCheckbox={false}>
                    <TableRow selectable={false} style={{ color: 'rgb(158, 158, 158)' }}>
                      <TableRowColumn style={{ width: '15%', textAlign: 'left', fontSize: '12px' }}>
                        Vendor Name, Address, Phone Number, & Website
                      </TableRowColumn>
                      <TableRowColumn style={{ width: '15%', textAlign: 'left', fontSize: '12px' }}>Item Description</TableRowColumn>
                      <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Part Number</TableRowColumn>
                      <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Quantity</TableRowColumn>
                      <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Total Cost</TableRowColumn>
                      <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Date Required</TableRowColumn>
                      <TableRowColumn style={{ width: '10%', textAlign: 'left', fontSize: '12px' }}>Intended Program Usage</TableRowColumn>
                      <TableRowColumn style={{ width: '10%', textAlign: 'left', fontSize: '12px' }}>Receipt</TableRowColumn>
                    </TableRow>
                    {this.state.approvedRequests.map(this.createRequestRow)}
                  </TableBody>
                </Table>
              </Paper>
              <RaisedButton
                primary
                label="Cancel"
                onTouchTap={this.goBack}
                style={{ marginTop: '5px', marginBottom: '5px', float: 'right' }}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
});

module.exports = ReportDetail;
