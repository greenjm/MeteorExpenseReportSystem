import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Table, TableBody, TableRow, TableRowColumn }
  from 'material-ui/Table';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import Header from './header.jsx';
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
    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      Meteor.subscribe('requests', () => {
        this.setState({ requests: Requests.find().fetch() });
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
    // const filteredRequests = this.state.requests.filter((requests, i) => {
    //     i == index;
    //   });
    const filteredRequests = [];
    for (let i = this.state.requests.length - 1; i >= 0; i -= 1) {
      if (i !== index) {
        filteredRequests.push(this.state.requests[i]);
      }
    }

    this.setState({
      requests: filteredRequests,
    });
  },

  denialChange(e) {
    this.setState({ statMsg: e.target.value });
  },

  handleConfirmPress() {
    this.removeItem(this.state.requestId);
    this.setState({ requestDialogOpen: false,
                    status: true,
    });
    Meteor.call('notifications.respondHelper', this.state.status,
      this.state.requestId,
      this.state.userId,
      // (error) => {
      //   if (error != null) {
      //     this.setState({ dialogError: `Error: ${error.error}. ${error.reason}` });
      //     return;
      //   }
      //   return;
      // }
    );
  },

  handleDenyPress() {
    this.removeItem(this.state.requestId);

    this.setState({ requestDialogOpen: false,
                    status: false,
    });
    Meteor.call('notifications.respondHelper', this.state.status,
      this.state.requestId,
      this.state.userId,
      // (error) => {
      //   if (error != null) {
      //     this.setState({ dialogError: `Error: ${error.error}. ${error.reason}` });
      //     return;
      //   }
      //   return;
      // }
    );
  },

  handleCancelPress() {
    this.setState({ requestDialogOpen: false,
                    statMsg: '',
    });
  },

  showRequest(data, index) {
    // const url = `/#/viewRequests/request?id=${data._id}`;
    return (
      <TableRow key={index}>
        <TableRowColumn>{index}</TableRowColumn>
        <TableRowColumn>{data.description}</TableRowColumn>
        <TableRowColumn>
          <FloatingActionButton mini zDepth={1} onTouchTap={this.openRequestDialog}>
            <i className="material-icons">search</i>
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
    );
  },

  render() {
    const requestDialogActions = [
      <FlatButton
        label="Confirm"
        primary
        onTouchTap={this.handleConfirmPress}
      />,
      <FlatButton
        label="Deny"
        primary
        onTouchTap={this.handleDenyPress}
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
              name="statusMessage"
              value={this.state.statMsg}
              readOnly
            />

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
