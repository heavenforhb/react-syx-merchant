import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Alert, Select, Input, Button, Spin, Icon, Steps, Progress, Card, notification } from 'antd'

import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import classes from './index.less'
import LoadingBlock from '../../../components/LoadingBlock'
import request from '../../../utils/request'
import SignMessenger from '../../../utils/SignMessenger'

import { getBrowser } from '../../../utils/utils'
import { CERT_LOCATION } from '../../../common/constants'
 
class CertApply extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mercCd: props.mercCd,
      captcha: '',
      countDownTime: 60,
      fetching: false,
      local: '',
      smscode: '',
      showDiyLocal: false,
      CAProvider: null,
      signObj: null,
      currStep: 0,
      certSignBuf: '',
      progressPercent: 0,
      progressMessage: '',
      progressStatus: 'active',
      certList: null,
      initialized: false,
      smsFetching: false,
      userPlaceDesc: '',
      applyFetching: false,
      browser: getBrowser(),
      countTime: null
    }
    this.installProgress = this.installProgress.bind(this)
    this.localChange = this.localChange.bind(this)
    this.applyCert = this.applyCert.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    this.init()
  }

  componentWillMount() {
    this._isMounted = false
  }

  componentWillUnmount() {
    clearTimeout(this.state.countTime)
  }

  verifyCertList(certList, filterCertList) {
    const { signObj, CAProvider } = this.state
    if (certList && certList.length > 0) {
      let certItem = certList.shift()
      signObj.selectCertAndGetInfo(CAProvider, certItem.certid, 6, 0, 0).then(cert => {
        const { sn } = cert.certinfo
        request('/api/ca/detail',{
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
        }).catch(error => {
          if (error.number == '401') {
            notification.error({ message: error.message })
            this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
          } else {
            notification.error({ message: error.message })
          }
        })
      })
    } else {
      this.setState({ certList: filterCertList, initialized: true })
    }

  }

  init() {
    this.setState({ fetching: true })
    const { oprCd, oprName, mercCd } = this.props
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
    }).catch(error => {
      if (error.number == '401') {
        notification.error({ message: error.message })
        this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
      } else {
        notification.error({ message: error.message })
        this.setState({ fetching: false, initialized: true })
      }
    })
  }

  localChange = (val) => {
    if (val == '04') {
      this.setState({ showDiyLocal: true, local: val })
    } else {
      this.setState({ showDiyLocal: false, local: val })
    }
  }

  getSMSCode = () => {
    const { mercCd } = this.props
    this.setState({ smsFetching: true })
    request('/api/user/sms/send', { method: 'POST', data: { smsType: '10' } })
    .then(response => {
        this.setState({ smsFetching: false }) 
        notification.success({ message: '获取验证码成功' })
        this.countDown()
        return
      })
    .catch(err => {
        notification.error({ message: err.Error })
        this.setState({ smsFetching: false })
    })
  }

  countDown = () => {
    let { countDownTime } = this.state
    countDownTime--
    if (countDownTime > 0) {
      this.state.countTime = setTimeout(this.countDown, 1000)
    } else {
      countDownTime = 60
    }
    this.setState({ countDownTime })
  }

  applyCert() {
    const { smscode, local, signObj, CAProvider, userPlaceDesc } = this.state
    if (!local) {
      return notification.error({ message: '请选择使用地点' })
    }
    if (local == '04' && !userPlaceDesc) {
      return notification.error({ message: '请选择使用地点' })
    }
    if (!smscode) {
      return notification.error({ message: '请输入短信验证码' })
    }

    const { uuid, oprName, oprCd, mercCd } = this.props

    const query = {
      mercCd,
      usePlace: local,
      usePlaceDesc: local == '04' ? userPlaceDesc : null,
      smsCode: smscode
    }


    const mask = {
      keyLabel: 'allscore',
      validPeriod: 60 * 60 * 24 * 365,
      keySize: 2048,
      C: 'CN',
      CN: oprName,
      E: oprCd,
      O: 'O',
      OU: 'OU',
      ST: 'BeiJing',
      L: 'BeiJing'
    }


    this.setState({ applyFetching: true })

    signObj.getCsr(CAProvider, 1, mask).then(csr => {

      csr = csr.replace('-----BEGIN CERTIFICATE REQUEST-----', '').replace('-----END CERTIFICATE REQUEST-----', '').replace(/\s/g, '')
      request('/api/ca/install', {
        method: 'POST',
        data: Object.assign({}, query, { csr })
      }).then(data => {
        this.setState({ applyFetching: false })
        if (data.resultCode == 'SUCCESS') {
          this.setState({ certSignBuf: data.caData.certSignBuf, currStep: 1 }, this.installCA)
        } else {
          notification.error({ message: data.errCodeDesc })
        }
      }).catch(error => {
        if (error.number == '401') {
          notification.error({ message: error.message })
          this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
        } else {
          notification.error({ message: error.message })
          this.setState({ applyFetching: false })
        }
      })
    }).catch(err => {
      this.setState({ applyFetching: false })
      notification.error({ message: '获取csr出错' })
    })
  }

  installCA() {
    const { certSignBuf, CAProvider, signObj } = this.state
    this.setState({ progressPercent: 1, progressMessage: '安装中, 请等待...' }, this.installProgress)
    setTimeout(() => {
      signObj.importCert(CAProvider, 0, certSignBuf, 2).then(data => {
        this.setState({ progressPercent: 99 }, () => {
          setTimeout(() => {
            this.setState({ currStep: 2 })
          }, 1000)
        })
      }).catch(err => {


        console.error(err)
        this.setState({ progressPercent: -1, progressMessage: '安装证书错误，请刷新页面', progressStatus: 'exception' })
      })
    }, 1500)
  }

  installProgress() {
    let { progressPercent } = this.state
    if (progressPercent < 90 && progressPercent != -1) {
      progressPercent = progressPercent + Math.ceil(Math.random() * 5)
      setTimeout(this.installProgress, 100)
    }
    this.setState({ progressPercent })
  }

  render() {
    const {
      countDownTime, fetching, showDiyLocal,
      CAProvider, currStep, progressPercent, progressMessage, progressStatus,
      certList, initialized, smsFetching, browser, applyFetching
    } = this.state
    let { oprName, oprPhoneNo } = this.props

    let CALink = ''

    if (browser.code == 10) {
      CALink = 'http://192.168.35.42/ocx/SignMessenger/SignMessengerEdge.exe'
    } else if (browser.code == 11) {
      CALink = 'http://192.168.35.42/ocx/SignMessenger/SignMessengerEdge.pkg'
    }

    const locationOption = []

    for (let key in CERT_LOCATION) {
      locationOption.push(<Select.Option value={key} key={key}>{CERT_LOCATION[key]}</Select.Option>)
    }
    return (
      <PageHeaderLayout title="申请数字证书">
        <Card bordered={false} style={{ minHeight: 650, padding: '50px 100px' }}>
          {
            initialized ?
              <Spin spinning={fetching}>
                {
                  CAProvider != null && certList ?
                    (
                      certList.length > 0 ?
                        <div style={{ marginTop: 30 }}>
                          <Row>
                            <Col span={4} />
                            <Col span={16}>
                              <Alert message='您本机已经安装了数字证书' description='数字证书能保证您操作的安全性' type='success' showIcon />
                            </Col>
                          </Row>
                        </div> :
                        <div>
                          <Steps current={currStep}>
                            <Steps.Step icon={<Icon type='user' />} title='申请证书' />
                            <Steps.Step icon={<Icon type='solution' />} title='安装证书' />
                            <Steps.Step icon={<Icon type='check-circle' />} title='安装完成' />
                          </Steps>
                          <div className={classes.stepContent}>
                            {
                              currStep == 0 &&
                              <div>
                                <Row gutter={10} className={classes.row}>
                                  <Col span={6} style={{ textAlign: 'right' }}>您绑定的手机号：</Col>
                                  <Col span={14}>
                                    <div className={classes.phone}>{oprPhoneNo}</div>
                                    <div>
                                      <Alert type='info' message='请确认您的手机能够正常使用；为了保障您的账户安全，在不同的电脑上使用数字证书时，我们会要求输入手机短信校验码。 ' showIcon />
                                    </div>
                                  </Col>
                                </Row>
                                <Row gutter={10} className={classes.row}>
                                  <Col span={6} style={{ textAlign: 'right' }}>真实姓名：</Col>
                                  <Col span={14}><span className={classes.name}>{oprName}</span></Col>
                                </Row>
                                <Row gutter={10} className={classes.row}>
                                  <Col span={6} style={{ textAlign: 'right' }}>使用地点：</Col>
                                  <Col span={14}>
                                    <span style={{ display: 'inline-block', width: 240 }}>
                                      <Select style={{ width: 240 }} defaultValue='' onChange={this.localChange}>
                                        <Select.Option value=''>请选择</Select.Option>
                                        {locationOption}
                                      </Select>
                                    </span>
                                    {
                                      showDiyLocal ?
                                        <span style={{ marginLeft: 10, display: 'inline-block', width: 200 }}>
                                          <Input placeholder='请输入自定义地点' onChange={e => this.setState({ userPlaceDesc: e.target.value })} maxLength='20' />
                                        </span> : null
                                    }
                                  </Col>
                                </Row>
                                <Row gutter={10} className={classes.row}>
                                  <Col span={6} style={{ textAlign: 'right' }}>验证码：</Col>
                                  <Col span={14}>
                                    <span style={{ width: 150, display: 'block', float: 'left' }}>
                                      <Input placeholder='请先获取短信验证码' onChange={e => this.setState({ smscode: e.target.value })} />
                                    </span>
                                    <span style={{ display: 'block', float: 'left', marginLeft: 10 }}>
                                      <Button type='default' onClick={this.getSMSCode} disabled={!(countDownTime == 60) || smsFetching} loading={smsFetching}>
                                        获取{!(countDownTime == 60) ? `(${countDownTime}秒)` : ''}
                                      </Button>
                                    </span>
                                  </Col>
                                </Row>
                                <Row gutter={10} className={classes.row}>
                                  <Col span={6} style={{ textAlign: 'right' }}></Col>
                                  <Col span={14}>
                                    <Button type='primary' size='large' loading={applyFetching} onClick={this.applyCert}>申请证书</Button>
                                  </Col>
                                </Row>
                              </div>
                            }
                            {
                              currStep == 1 &&
                              <div style={{ textAlign: 'center', marginTop: 50, marginBottom: 50 }}>
                                <Progress type="circle" percent={progressPercent} status={progressStatus} />
                                <p style={{ marginTop: 20, fontSize: 20 }}>{progressMessage}</p>
                              </div>
                            }
                            {
                              currStep == 2 &&
                              <div style={{ textAlign: 'center', marginTop: 50, marginBottom: 50 }}>
                                <p><Icon type='smile-o' style={{ color: '#666', fontSize: 64 }} /></p>
                                <p style={{ marginTop: 20, fontSize: 20 }}>恭喜您，安装数字证书成功！</p>
                              </div>
                            }
                          </div>
                        </div>
                    ) :
                    <div style={{ marginTop: 30 }}>
                      <Row>
                        <Col span={4} />
                        <Col span={16}>
                          <Alert message='尚未安装签名控件' description='请先安装控件后再申请数字证书' type='info' showIcon />
                          <p style={{ marginTop: 20, textAlign: 'center' }}><a href={CALink} download><Icon type='download' /> 下载安装签名控件</a></p>
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

function mapStateToProps(state) {
  const { mercName, mercCd, phoneNo } = state.user.merchantInfo

  return {
    mercCd, mercName, phoneNo, oprPhoneNo: state.user.info.oprPhoneNo, oprName: state.user.info.oprName
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}


export default connect(mapStateToProps)(CertApply)


