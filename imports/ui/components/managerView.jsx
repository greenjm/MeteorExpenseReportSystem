import { Meteor } from 'meteor/meteor';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
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
          <RaisedButton style={{ margin: '3px' }} href={`/#/project/view/${item._id}`}>
            View Details
          </RaisedButton>
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

    let status = '';
    if (item.status === undefined) {
      status = 'Pending';
    } else if (item.status) {
      status = 'Approved';
    } else {
      status = 'Denied';
    }

    return (
      <TableRow key={index} selectable={false}>
        <TableRowColumn>{projectName}</TableRowColumn>
        <TableRowColumn>{status}</TableRowColumn>
        <TableRowColumn>{item.statMsg}</TableRowColumn>
        <TableRowColumn>{item.estCost}</TableRowColumn>
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
            <RaisedButton style={{ margin: '3px' }}>
              View Details
            </RaisedButton>
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
                <TableHeader displaySelectAll={false}>
                  <TableRow selectable={false}>
                    <TableHeaderColumn>Project Name</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                    <TableHeaderColumn>Status Message</TableHeaderColumn>
                    <TableHeaderColumn>Cost</TableHeaderColumn>
                    <TableHeaderColumn>Actions</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
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
