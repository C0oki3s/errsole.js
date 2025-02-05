import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

/* import actions */
import * as logActions from 'actions/logActions.js';

/* Ante UI */
import { Layout, Divider, Form, Input, Row, Col, Button, message } from 'antd';

const { Content } = Layout;

/* mapStateToProps */
const mapStateToProps = (state) => ({
  userProfile: state.userProfileReducer.get('userProfile')
});

/* mapDispatchToProps */
const mapDispatchToProps = (dispatch) => ({
  logActions: bindActionCreators(logActions, dispatch)
});

/* Component Class */
class DataRetention extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      logsTTL: null,
      loadingStatus: false
    };
  }

  componentDidMount () {
    this.getLogsTTL();
  }

  getLogsTTL () {
    const self = this;
    this.setState({
      loadingStatus: true
    });
    this.props.logActions.getLogsTTL(function (err, result) {
      if (!err && result && result.data) {
        const logsTTLDays = parseInt(result.data.attributes.value) / 86400000;
        self.setState({
          logsTTLDays
        });
      }
      self.setState({
        loadingStatus: false
      });
    });
  }

  handleFormChange (e) {
    const key = e.target.name;
    const value = e.target.value;
    this.setState({
      [key]: value
    });
  }

  updateLogsTTL () {
    const self = this;
    const logsTTLDays = this.state.logsTTLDays;
    if (!logsTTLDays) {
      message.error('Please enter the TTL');
      return;
    }
    this.setState({
      loadingStatus: true
    });
    const data = {
      ttl: parseInt(logsTTLDays) * 86400000
    };
    this.props.logActions.updateLogsTTL(data, function (err, result) {
      if (!err && result && result.data) {
        const logsTTLDays = parseInt(result.data.attributes.value) / 86400000;
        self.setState({
          logsTTLDays
        });
        message.success('Logs TTL updated successfully');
      }
      self.setState({
        loadingStatus: false
      });
    });
  }

  render () {
    const logsTTLDays = this.state.logsTTLDays || null;
    const loadingStatus = this.state.loadingStatus || null;

    return (
      <>
        <Row>
          <Col span={20} offset={2}>
            <Content className='all-users'>
              <Content className='setting-user'>
                <h1>Data Retention</h1>
                <Divider />
                <Form layout='horizontal'>
                  <Form.Item>
                    <b>Logs TTL:</b> <Input disabled={loadingStatus} suffix='Days' value={logsTTLDays} style={{ width: '300px' }} name='logsTTLDays' placeholder='Logs TTL in days' onChange={this.handleFormChange.bind(this)} autocomplete='off' />
                    <Button style={{ marginLeft: '20px' }} loading={loadingStatus} type='primary' onClick={this.updateLogsTTL.bind(this)}>Update</Button>
                  </Form.Item>
                </Form>
              </Content>
            </Content>
          </Col>
        </Row>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DataRetention));
