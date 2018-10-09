import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Alert, Select, Input, Button, Spin, Icon, Steps, Progress, Card, notification, Table, Radio, Form, Tabs } from 'antd'

import { Link } from 'dva/router'

import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import classes from './index.less'
import request from '../../../utils/request'

const TabPane = Tabs.TabPane

class Charge extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillMount() {
    this._isMounted = false
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 8,
        },
      },
    }

    return (
      <PageHeaderLayout title="充值">
        <Card bordered={false} style={{ minHeight: 650 }}>
          <Row><Col span={8}>账户可用金额</Col><Col span={8}>账户冻结金额</Col></Row>
          <Tabs>
            <TabPane tab="个人账户" key="1">Content of tab 1</TabPane>
            <TabPane tab="企业账户" key="2">Content of tab 2</TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    )
  }
}

function mapStateToProps(state) {
  const { mercName, mercCd, phoneNo } = state.user.merchantInfo
  return {
    mercCd, mercName, phoneNo, oprPhoneNo: state.user.info.oprPhoneNo, oprName: state.user.info.oprName
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}


const ChargeForm = Form.create()(Charge)

export default connect(mapStateToProps)(ChargeForm)


