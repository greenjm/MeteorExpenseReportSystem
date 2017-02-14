import { Meteor } from 'meteor/meteor';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import Search from 'material-ui/svg-icons/action/search';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const React = require('react');

const ManagerView = React.createClass({
  propTypes: {
    projects: React.PropTypes.array,
    requests: React.PropTypes.array,
    currentTab: React.PropTypes.number,
    updateTab: React.PropTypes.any,
  },

  getInitialState() {
    return {
      projects: this.props.projects,
      requests: this.props.requests,
      requestDialogOpen: false,
      statMsg: '',
      requestToDeny: {},
    };
  },

  componentWillReceiveProps(nextProps) {
    const projectsChange = this.state.projects !== nextProps.projects;
    const requestsChange = this.state.requests !== nextProps.requests;

    this.setState({
      projects: projectsChange ? nextProps.projects : this.state.projects,
      requests: requestsChange ? nextProps.requests : this.state.requests,
    });
  },

  serveRequest(request, approved, message) {
    Meteor.call('requests.statEdit', request._id, approved, message, (err) => {
      if (err) {
        console.log(err);
      }
    });
    Meteor.call('notifications.respondHelper', approved,
      request._id,
      request.userId,
      // (error) => {
      //   if (error != null) {
      //     this.setState({ dialogError: `Error: ${error.error}. ${error.reason}` });
      //     return;
      //   }
      //   return;
      // }
    );
  },

  handleConfirmPress(req) {
    this.serveRequest(req, true, '');
  },

  handleDenyPress(request) {
    this.setState({
      requestDialogOpen: true,
      requestToDeny: request });
  },

  denyRequest() {
    this.serveRequest(this.state.requestToDeny, false, this.state.statMsg);
    this.setState({
      requestToDeny: {},
      statMsg: '',
      requestDialogOpen: false,
    });
  },

  handleCancelPress() {
    this.setState({
      requestToDeny: {},
      requestDialogOpen: false,
      statMsg: '',
    });
  },

  denialChange(e) {
    this.setState({ statMsg: e.target.value });
  },

  createProjectRow(item) {
    return (
      <TableRow selectable={false}>
        <TableRowColumn>{item.name}</TableRowColumn>
        <TableRowColumn>
          <FloatingActionButton mini style={{ margin: '3px' }} href={`/#/project/view/${item._id}`}>
            <Search />
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
    );
  },

  createRequestRow(item, index) {
    const url = `/#/requestDetail/${item._id}`;
    let projectName = '';
    for (let i = 0; i < this.state.projects.length; i += 1) {
      const p = this.state.projects[i];
      if (p._id === item.projectId) {
        projectName = p.name;
        break;
      }
    }

    return (
      <TableRow key={index} selectable={false}>
        <TableRowColumn style={{ width: '5%', textAlign: 'left' }}>{index}</TableRowColumn>
        <TableRowColumn style={{ width: '8%', textAlign: 'left' }}>{projectName}</TableRowColumn>
        <TableRowColumn style={{ width: '15%', textAlign: 'left' }}>{item.vendor}</TableRowColumn>
        <TableRowColumn style={{ width: '15%', textAlign: 'left' }}>{item.description}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left' }}>{item.partNo}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left' }}>{item.quantity}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left' }}>{item.unitCost}</TableRowColumn>
        <TableRowColumn style={{ width: '5%', textAlign: 'left' }}>{item.estCost}</TableRowColumn>
        <TableRowColumn style={{ width: '8%', textAlign: 'left' }}>"Project"</TableRowColumn>
        <TableRowColumn style={{ width: '8%', textAlign: 'left' }}>"Date Required"</TableRowColumn>
        <TableRowColumn style={{ width: '10%', textAlign: 'left' }}>"Intended Usage"</TableRowColumn>
        <TableRowColumn>
          <RaisedButton
            label="Approve"
            primary
            onTouchTap={() => { this.handleConfirmPress(item); }}
          />
          <RaisedButton
            label="Deny"
            primary
            onTouchTap={() => { this.handleDenyPress(item); }}
          />
          <a href={url}>
            <FloatingActionButton mini style={{ margin: '3px' }}>
              <Search />
            </FloatingActionButton>
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
          <Tabs initialSelectedIndex={this.props.currentTab}>
            <Tab index={0} label="Projects" onActive={this.props.updateTab} >
              <Table selectable={false}>
                <TableHeader displaySelectAll={false}>
                  <TableRow selectable={false}>
                    <TableHeaderColumn>Project Name</TableHeaderColumn>
                    <TableHeaderColumn>Actions</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {this.state.projects.length > 0 ?
                    this.state.projects.map(this.createProjectRow) :
                    (
                    <TableRow selectable={false}>
                      <TableRowColumn>You do not belong to any projects.</TableRowColumn>
                      <TableRowColumn />
                    </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </Tab>
            <Tab index={1} label="Material Purchase Approvals" onActive={this.props.updateTab} >
              <Table selectable={false}>
                <TableBody displayRowCheckbox={false}>
                  <TableRow selectable={false} style={{ color: 'rgb(158, 158, 158)' }}>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Item</TableRowColumn>
                    <TableRowColumn style={{ width: '8%', textAlign: 'left', fontSize: '12px' }}>Project Name</TableRowColumn>
                    <TableRowColumn style={{ width: '15%', textAlign: 'left', fontSize: '12px' }}>
                      Vendor Name, Address, Phone Number, & Website
                    </TableRowColumn>
                    <TableRowColumn style={{ width: '15%', textAlign: 'left', fontSize: '12px' }}>Item Description</TableRowColumn>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Part Number</TableRowColumn>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Quantity</TableRowColumn>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Unit Cost</TableRowColumn>
                    <TableRowColumn style={{ width: '5%', textAlign: 'left', fontSize: '12px' }}>Total Cost</TableRowColumn>
                    <TableRowColumn style={{ width: '8%', textAlign: 'left', fontSize: '12px' }}>Project</TableRowColumn>
                    <TableRowColumn style={{ width: '8%', textAlign: 'left', fontSize: '12px' }}>Date Required</TableRowColumn>
                    <TableRowColumn style={{ width: '10%', textAlign: 'left', fontSize: '12px' }}>Intended Program Usage</TableRowColumn>
                  </TableRow>
                  {this.state.requests.length > 0 ?
                    this.state.requests.map(this.createRequestRow) :
                    (
                    <TableRow selectable={false}>
                      <TableRowColumn>No requests require your attention.</TableRowColumn>
                      <TableRowColumn />
                    </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </Tab>
          </Tabs>
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

module.exports = ManagerView;
