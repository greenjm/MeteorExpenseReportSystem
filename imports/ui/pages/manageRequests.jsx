import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Table, TableBody, TableRow, TableRowColumn }
  from 'material-ui/Table';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import { hashHistory } from 'react-router';
import Header from '../components/header.jsx';
import '../../api/requests/requests.js';


/* global Requests:true*/
/* eslint no-undef: "error"*/
/* eslint jsx-no-bind: "warning"*/

const React = require('react');

// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const actionsColStyle = {
  paddingLeft: '50px',
};

const ManageRequests = React.createClass({
  getInitialState() {
    return {
      requests: [],
      requestId: '',
      userId: '',
      users: [],
      requestDialogOpen: false,
      status: false,
      statMsg: '',
      selected: -1
    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      Meteor.subscribe('requests', () => {
        const requests = Requests.find().fetch();
        const unapprovedRequests = [];
        for (let x = 0; x < requests.length; x++) {
          if (requests[x].status !== true && requests[x].status !== false) {
            unapprovedRequests.push(requests[x]);
          }
        }
        this.setState({ requests: unapprovedRequests });
      });
    });
  },

  manageRequests() {
    this.setState({ dialogError: '' });
  },

  openRequestDialog() {
    this.setState({
      requestDialogOpen: true,
    });
  },

  closeRequestDialog() {
    this.setState({
      requestDialogOpen: false,
    });
  },

  createUserRow(item) {
    return (
      <TableRow key={item._id} selectable={false}>
        <TableRowColumn>{item.profile.name}</TableRowColumn>
        <TableRowColumn>{item.emails[0].address}</TableRowColumn>
        <TableRowColumn style={actionsColStyle}>
          <FloatingActionButton mini zDepth={1}>
            <i className="material-icons">edit</i>
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>);
  },

  removeItem(index) {
    const filteredRequests = [];
    for (let i = this.state.requests.length - 1; i >= 0; i -= 1) {
      if (i !== index) {
        filteredRequests.push(this.state.requests[i]);
      }
    }
    this.setState({
      requests: filteredRequests.reverse(),
    });
  },

  denialChange(e) {
    this.setState({ statMsg: e.target.value });
  },

  handleConfirmPress(index) {
    this.serveRequest(this.state.requests[index], index, true, '');
  },

  serveRequest(request, index, approved, message) {
    Meteor.call('requests.statEdit', request._id, approved, message, (err) => {
      if (err) {
        console.log(err);
      } else {
        this.removeItem(index);
      }
    })
  },

  handleDenyPress(index) {
    this.setState({ requestDialogOpen: true, selected: index });
  },

  denyRequest() {
    this.serveRequest(this.state.requests[this.state.selected], this.state.selected, false, this.state.statMsg);
    this.setState({
      statMsg: '',
      selected: -1,
      requestDialogOpen: false
    });
  },

  handleCancelPress() {
    this.setState({
      requestDialogOpen: false,
      statMsg: '',
    });
  },

  showRequest(data, index) {
    const url = `/#/viewRequests/${data._id}`;

    return (
      <TableRow key={index}>
        <TableRowColumn>{index}</TableRowColumn>
        <TableRowColumn>{data.description}</TableRowColumn>
        <TableRowColumn key={index}>
          <RaisedButton
            key={index}
            label="Approve"
            primary
            onClick={this.handleConfirmPress.bind(this, index)}
          />
        </TableRowColumn>
        <TableRowColumn>
          <RaisedButton
            label="Deny"
            primary
            onTouchTap={this.handleDenyPress.bind(this, index)}
          />
        </TableRowColumn>
        <TableRowColumn>
          <a href={url}>
              <RaisedButton
                label="Details"
            />
          </a>
        </TableRowColumn>
      </TableRow>
    );
  },

  render() {
    const requestDialogActions = [
      <FlatButton
        label="Confirm"
        primary
        onTouchTap={this.denyRequest}
      />,
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleCancelPress}
      />,
    ];
    return (
      <div>
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
                    {this.state.requests.map(this.showRequest)}
                  </TableBody>
                </Table>
              </Col>
            </Row>
          </Grid>
        </div>
        <div>
          <Dialog
            title="Respond to request"
            actions={requestDialogActions}
            modal={false}
            open={this.state.requestDialogOpen}
          >
            <TextField
              name="denialText"
              hintText="Reasons for denial"
              floatingLabelText="Denial Message"
              onChange={this.denialChange}
              fullWidth
            />
          </Dialog>          
        </div>
      </div>
    );
  },
});

module.exports = ManageRequests;
