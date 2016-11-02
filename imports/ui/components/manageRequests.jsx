import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import { hashHistory } from 'react-router';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import Header from './header.jsx';
import Dialog from 'material-ui/Dialog';
import '../../api/requests/requests.js';


/* global Projects:true*/
/* eslint no-undef: "error"*/

const React = require('react');

// Subscriptions
const requestSub = Meteor.subscribe('requests');
// Styles
const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const tableHeaderButtonStyle = {
  float: 'right',
};

const actionsColStyle = {
  paddingLeft: '50px',
};

const ManageRequests = React.createClass({
  getInitialState() {
    return {
      requests: [],
      userId: '',
      users: [],
      requestDialogOpen: false,
      status: false,
      statMsg: '',

    };
  },

  componentWillMount() {
    Tracker.autorun(() => {
      if (requestSub.ready()) {
        const requests = Requests.find().fetch();
        for(let i = 0; i<requests.length; i+=1){
          requests.push()
        }
      }
    });
  },

  manageRequests() {
    this.setState({ dialogError: ''});
  },

  openRequestDialog() {
    this.setState({
      requestDialogOpen: true
    });
  },

  closeRequestDialog() {
    this.setState({
      requestDialogOpen: false
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

  handleConfirmPress() {
    this.setState({ requestDialogOpen: false,
                    status: true,

    });
  },

  handleDenyPress() {
    this.setState({ requestDialogOpen: false,
      statMsg: document.getElementById('denialText')});
  },

  handleCancelPress(){
    this.setState({ requestDialogOpen: false,
                    statMsg: '',
    })
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
        <Header />
        <Paper style={paperStyle} zDepth={1}>Manage Requests</Paper>
        <div>
          <Grid>
            <Row>
              <Col>
                <Table
                  selectable={false}
                >
                <TableHeader displaySelectAll={false}>
                    <TableRow selectable={false}>
                      <TableHeaderColumn colSpan="3" style={{ textAlign: 'center' }}>
                      <RaisedButton label="New" primary style={tableHeaderButtonStyle} onTouchTap={this.openRequestDialog} />
                        Requests
                      </TableHeaderColumn>
                    </TableRow>
                    <TableRow selectable={false}>
                      <TableHeaderColumn>Name</TableHeaderColumn>
                      <TableHeaderColumn>Email</TableHeaderColumn>
                      <TableHeaderColumn>Actions</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    showRowHover
                    displayRowCheckbox={false}
                  >
                    {this.state.users.map(this.createUserRow)}
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
            open={this.state.requestDialogOpen} >
            <TextField
            name="denialText"
            hintText="Reasons for denial"
            floatingLabelText="Denial Message"
            fullWidth
            />
          </Dialog>
        </div>

      </div>
      );
  },
});

module.exports = ManageRequests;