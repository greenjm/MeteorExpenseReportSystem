import { Table, TableRow, TableRowColumn, TableBody }
  from 'material-ui/Table';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import { hashHistory } from 'react-router';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import Header from '../components/header.jsx';
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

const ViewRequests = React.createClass({
  propTypes: {
    requests: React.PropTypes.array,
    isAdmin: React.PropTypes.bool,
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
            <FloatingActionButton mini zDepth={1}>
              <i className="material-icons">search</i>
            </FloatingActionButton>
          </a>
        </TableRowColumn>
        <TableRowColumn>{data.statMsg}</TableRowColumn>
      </TableRow>
    );
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
                </TableBody>
              </Table>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
});

module.exports = ViewRequests;