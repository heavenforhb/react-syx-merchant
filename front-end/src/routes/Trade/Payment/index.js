import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Alert, Select, Input, Button, Spin, Icon, Steps, Progress, Card, notification, Table, Radio, Form } from 'antd'

import { Link } from 'dva/router'

import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import classes from './index.less'
import request from '../../../utils/request'
import SignMessenger from '../../../utils/SignMessenger'
import StepFormComponent from './StepForm'

class Payment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mercCd: props.mercCd,
      fetching: false,
      CAProvider: null,
      signObj: null,
      currStep: 0,
      certSignBuf: '',
      certList: [],
      initialized: false,
      currentStep: 0,
      checkedObj: {},
      fileList: []
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.init()
  }

  componentWillMount() {
    this._isMounted = false
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'payment/step', payload: { formStep: 'step-form' } })
  }

  verifyCertList(certList, filterCertList) {
    const { signObj, CAProvider } = this.state
    if (certList && certList.length > 0) {
      let certItem = certList.shift()
      signObj.selectCertAndGetInfo(CAProvider, certItem.certid, 6, 0, 0).then(cert => {
        const { sn } = cert.certinfo
        request('/api/ca/detail', {
          data: { certSerialNumber: sn }
        }).then(data => {
          if (data.resultCode == 'SUCCESS') {
            if (data.valid == true) {
              filterCertList.push(certItem)
            } else {
              signObj.delCert(CAProvider, certItem.certid, 4)
            }
          } else {
            notification.error({ message: data.resultCode })
          }
          this.verifyCertList(certList, filterCertList)
        }).catch(e => {
          notification.error({ message: e.message })
        })
      })
    } else {
      this.setState({ certList: filterCertList, initialized: true })
    }

  }

  init() {
    this.setState({ fetching: true })
    const { doRequest, oprCd, oprName, mercCd } = this.props
    request('/api/ca/init', {
      method: 'POST',
      data: null
    }).then(data => {
      const signObj = new SignMessenger({
        ids: 'sm0',
        pgeRZRandNum: data.randKey,
        pgeRZDataB: data.randData
      })
      this.setState({ signObj })
      signObj.getProvider('', 0, 0).then(provider => {
        this.setState({ CAProvider: provider })
        this.setState({ fetching: false })
        signObj.getCertList(provider, 5, { CN: oprName }).then(certListData => {
          // 验证CA的有效性
          if (certListData.certnumber) {
            const certList = certListData.certlist
            this.verifyCertList(certList, [])
          } else {
            this.setState({ initialized: true, certList: [] })
          }
        }).catch(err => {
          this.setState({ initialized: true })
        })
      }).catch(err => {
        this.setState({ fetching: false, initialized: true })
      })
    }).catch(e => {
      notification.error({ message: e.message })
      this.setState({ fetching: false, initialized: true })
    })
  }

  render() {
    const {
      fetching, currentStep, fileList, CAProvider, certList, initialized
    } = this.state

    const { getFieldDecorator } = this.props.form

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
      <PageHeaderLayout title="付款">
        <Card bordered={false} style={{ minHeight: 650 }}>
          {
            initialized ?
              <Spin spinning={fetching}>
                {
                  certList.length ?
                    <Spin spinning={false}>
                      <div style={{ margin: '16px auto', maxWidth: 1200 }}>
                        <StepFormComponent />
                      </div>
                    </Spin> :
                    <div style={{ marginTop: 30 }}>
                      <Row>
                        <Col span={4} />
                        <Col span={16}>
                          <Alert message='尚未申请数字证书' description='请先安装控件后再申请数字证书' type='info' showIcon />
                          <p style={{ marginTop: 20, textAlign: 'center' }}><Link to='/security/cert/certApply'>去申请数字证书<Icon type="arrow-right" /></Link></p>
                        </Col>
                      </Row>
                    </div>
                }
              </Spin> :
              <div>
                <Card loading={true} bordered={false}></Card>
              </div>
          }
        </Card>
      </PageHeaderLayout>
    )
  }
}

const PaymentForm = Form.create()(Payment)

function mapStateToProps(state) {
  const { mercName, mercCd, phoneNo } = state.user.merchantInfo
  return {
    mercCd, mercName, phoneNo, oprPhoneNo: state.user.info.oprPhoneNo, oprName: state.user.info.oprName
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(PaymentForm)


