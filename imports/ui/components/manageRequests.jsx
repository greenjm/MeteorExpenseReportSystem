import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import { hashHistory } from 'react-router';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
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
        console.log(Requests.find().fetch());
        this.setState({ requests: Requests.find().fetch() });
      });
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

  removeItem(index) {
    // const filteredRequests = this.state.requests.filter((requests, i) => {
    //     i == index;
    //   });
    const filteredRequests=[];
    for (var i = this.state.requests.length - 1; i >= 0; i--) {
      if(i!=index){
        filteredRequests.push(this.state.requests[i]);
        console.log("index: "+ index);
        console.log("i: "+ i);
      }
    }

    this.setState({
      requests: filteredRequests,
    });
  },

  denialChange(e){
    this.setState({ statMsg: e.target.value });
  },

  handleConfirmPress() {
    this.removeItem(this.state.requestId);
    this.setState({ requestDialogOpen: false,
                    status: true,
    });
  },

  handleDenyPress() {
    console.log("requestId: "+ this.state.requestId);
    this.removeItem(this.state.requestId);

    this.setState({ requestDialogOpen: false,
                    status: false,
    });
  },

  handleCancelPress(){
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
return(
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
          open={this.state.requestDialogOpen} >

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