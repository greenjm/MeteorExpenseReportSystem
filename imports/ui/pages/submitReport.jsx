import { Meteor } from 'meteor/meteor';
import { Table, TableRow, TableRowColumn, TableBody }
  from 'material-ui/Table';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import Paper from 'material-ui/Paper';
import { hashHistory } from 'react-router';
import Header from '../components/header.jsx';
import '../../api/requests/requests.js';

/* global Requests:true*/

const React = require('react');

const paperStyle = {
  height: '35px',
  lineHeight: '35px',
  fontFamily: 'Roboto,sans-serif',
  paddingLeft: '24px',
};

const SubmitReport = React.createClass({
  propTypes() {
    return {
      location: React.object,
      requests: React.PropTypes.array,
      isAdmin: React.PropTypes.bool,
    };
  },

  getInitialState() {
    return {
      requests: [],
    };
  },

  componentWillMount() {
    this.setState({ requests: this.props.requests });
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user) {
      hashHistory.push('/');
    }

    if (this.state.requests !== nextProps.requests) {
      this.setState({ requests: nextProps.requests });
    }
  },

  showRequest(data, index) {
    const url = `/#/viewRequests/${data._id}`;
    return (
      <TableRow key={index}>
        <TableRowColumn>{index}</TableRowColumn>
        <TableRowColumn>{data.description}</TableRowColumn>
        <TableRowColumn>
          <a href={url}>
            <RaisedButton zDepth={1}>
              Search
            </RaisedButton>
          </a>
        </TableRowColumn>
      </TableRow>
    );
  },

  submitReport() {
    const acceptedRequests = [];
    for (let i = 0; i < this.state.requests.length; i += 1) {
      if (this.state.requests[i].stat) {
        acceptedRequests.push(this.state.requests[i]);
      }
    }

    const month = new Date().toLocaleString('en-us', { month: 'long' });
    Meteor.call('requests.create', this.state.project._id,
      acceptedRequests,
      month,
      new Date().getFullYear(),
      (error, result) => {
        if (error != null) {
          console.error(error);
          return;
        }
        if (result) {
          console.log('Successful submission!');
        }
      });
  },

  cancel() {
    hashHistory.push('/dashboard');
  },

  render() {
    return (
      <div>
        <Header isAdmin={this.props.isAdmin} />
        <Paper style={paperStyle} zDepth={1}>Expense Requests</Paper>
        <br />
        <br />
        <Grid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Table>
                <TableBody displayRowCheckbox={false}>
                  {this.state.requests.map(this.showRequest)}
                  <TableRow selectable={false}>
                    <TableRowColumn>
                      <button onClick={this.submitReport}>Submit Expense Report</button>
                      <button onClick={this.cancel}>Cancel</button>
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

module.exports = SubmitReport;
