import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Search from 'material-ui/svg-icons/action/search';

const React = require('react');

const EmployeeView = React.createClass({
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

  createProjectRow(item) {
    return (
      <TableRow selectable={false}>
        <TableRowColumn>{item.name}</TableRowColumn>
        <TableRowColumn>
          <FloatingActionButton mini style={{ margin: '3px' }} href={`/#/project/view/${item._id}`}>
            <Search />
          </FloatingActionButton>
          <FloatingActionButton mini style={{ margin: '3px' }} href={`/#/submitRequest/${item._id}`}>
            <ContentAdd />
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
    );
  },

  createRequestRow(item) {
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
      <TableRow selectable={false}>
        <TableRowColumn>{projectName}</TableRowColumn>
        <TableRowColumn>{status}</TableRowColumn>
        <TableRowColumn>{item.statMsg}</TableRowColumn>
        <TableRowColumn>{item.estCost}</TableRowColumn>
        <TableRowColumn>
          <FloatingActionButton mini style={{ margin: '3px' }} href={`/#/requestDetail/${item._id}`}>
            <Search />
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
    );
  },

  render() {
    return (
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
          <Tab index={1} label="Requests" onActive={this.props.updateTab} >
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
                    <TableRowColumn>You have not submitted any requests yet.</TableRowColumn>
                    <TableRowColumn />
                  </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </Tab>
          <Tab
            index={2}
            label="Report"
            onActive={this.props.updateTab}
          >
            <div>
              <h2>TODO</h2>
              <p>
                Still waiting on client feedback.
                This tab may or may not exist in the future depending on necessity.
              </p>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  },
});

module.exports = EmployeeView;
