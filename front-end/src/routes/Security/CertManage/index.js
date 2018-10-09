import React, { Component } from 'react'
import { connect } from 'dva'
import { Spin, Alert, Row, Col, Table, message, Icon, Popconfirm, Modal, Button, Card, notification } from 'antd'

import { Link } from 'dva/router'


import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import styles from './index.less'
import SendPhoneCode from '../../../components/SendPhoneCode'
import LoadingBlock from '../../../components/LoadingBlock'
import request from '../../../utils/request'
import SignMessenger from '../../../utils/SignMessenger'

import { getBrowser, formatTime, getSeconds } from '../../../utils/utils'
 
class CertManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countDownTime: 60,
      smsFetching: false,
      certSerialNumber: '',
      rmk: '',
      smsCode: '',
      deleteFetching: false,
      CAFetching: false,
      fetching: false,
      CAProvider: null,
      signObj: null,
      query: {
        pageNumber: 1,
        pageSize: 8
      },
      initialized: false,
      localCA: [],
      browser: getBrowser()
    }
    this.deleteCA = this.deleteCA.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    this.init()
  }

  componentWillMount() {
    this._isMounted = false
  }

  verifyCertList(certList, localCA) {
    const { signObj, CAProvider } = this.state
    if (certList && certList.length > 0) {
      let certItem = certList.shift()
      signObj.selectCertAndGetInfo(CAProvider, certItem.certid, 6, 0, 0).then(cert => {
        const { certinfo } = cert 
        const { sn, notAfter } = certinfo
        localCA[sn] = {
          sn, notAfter, certid: certItem.certid
        }
        this.verifyCertList(certList, localCA)
      })
    } else {
      this.setState({ initialized: true, localCA })
    }
  }

  init() {
    if (!this._isMounted) return false
    this.setState({ fetching: true })
    const { oprName } = this.props
    request('/api/ca/init', {
      method: 'POST',
      data: null
    }).then(data => {
      const signObj = new SignMessenger({
        ids: 'sm1',
        pgeRZRandNum: data.randKey,
        pgeRZDataB: data.randData
      })
      this.setState({ signObj })
      signObj.getProvider('', 0, 0).then(provider => {
        this.setState({ CAProvider: provider })
        signObj.getCertList(provider, 5, { CN: oprName }).then(data => {
          this.setState({ fetching: false })
          if (data.certnumber > 0) {
            const localCA = {}
            const certList = data.certlist
            this.verifyCertList(certList, localCA)                
          } else {
            this.setState({ initialized: true })
          }
        })
        this.getCAList()
      }).catch(err => {
        this.setState({ fetching: false, initialized: true })
      })
    }).catch(e => {
      notification.error({ message: '初始化CA控件出错' })
      this.setState({ fetching: false, initialized: true })
    })
  }

  getCAList() {
    this.props.dispatch({ 
      type: 'certManage/fetch', 
      payload: Object.assign({}, this.state.query, { mercCd: this.props.mercCd, certStatus: 'VALID' }) 
    })
  }

  deleteCA(certSerialNumber) {
    const { oprCd } = this.props
    const { localCA, signObj, CAProvider, smsCode } = this.state
  
    let use = Object.keys(localCA).indexOf(certSerialNumber) >= 0 ? true : false
    this.setState({ deleteFetching: true })
    if (use) {
      let c = localCA[certSerialNumber]
      signObj.selectCert(CAProvider, c.certid, 6, 0).then(data => {
        return signObj.delCert(CAProvider, c.certid, 4)
      }).then(data => {
        // mercCaRevoke
        request('/api/ca/Revoke', { data: { certSerialNumber }, method: 'POST' }).then(data => {
          this.setState({ deleteFetching: false })
          if(data.resultCode == 'SUCCESS') {
            notification.success({ message: '删除证书成功'})
            this.getCAList()
          }else{
            notification.error({ message: '删除证书出错'})
          }
        }).catch(e => {
          notification.error({ message: '删除证书出错'})
          this.setState({ deleteFetching: false })
        })
      }).catch(error => {
        if(error.number == '401') {
          notification.error({ message: error.message })
          this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
        } else {
          notification.error({ message: '删除证书出错'})
          this.setState({ deleteFetching: false })
        }
      })
    } else {
      request('/api/ca/Revoke', { data: { certSerialNumber }, method: 'POST' }).then(data => {
        this.setState({ deleteFetching: false })
        if(data.resultCode == 'SUCCESS') {
          notification.success({ message: '删除证书成功'})
          this.getCAList()
        }else{
          notification.error({ message: '删除证书出错'})
        }
      }).catch(error => {
        if(error.number == '401') {
          notification.error({ message: error.message })
          this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
        } else {
          notification.error({ message: '删除证书出错'})
          this.setState({ deleteFetching: false })
        }
      })
    }
  }

  render() {
    const { query, fetching, CAProvider, localCA, initialized, countDownTime, deleteFetching,
      smsFetching, rmk, smsCode, browser } = this.state
    const { list, loading, total, serverDate } = this.props

    const columns = [
      {
        title: '使用地点',
        key: 'usePlaceDesc',
        dataIndex: 'usePlaceDesc'
      }, {
        title: '用户名',
        key: 'caName',
        dataIndex: 'caName'
      },{
        title: '安装日期',
        dataIndex: 'certReqDate',
        key: 'certReqDate'
      }, {
        title: '到期日期',
        dataIndex: 'certNotAfter',
        key: 'certNotAfter'
      }, {
        title: '操作',
        key: 'action',
        dataIndex: 'action'
      }
    ]

    const tablePagination = {
      total: total || 0,
      current: query.pageNumber,
      pageSize: query.pageSize,
      onChange: pageNumber => {
        this.setState({ query: Object.assign({}, query, { pageNumber }) }, this.getCAList)
      }
    }

    let CALink = ''

    if (browser.code == 10) {
      CALink = 'http://192.168.35.42/ocx/SignMessenger/SignMessengerEdge.exe'
    } else if (browser.code == 11) {
      CALink = 'http://192.168.35.42/ocx/SignMessenger/SignMessengerEdge.pkg'
    }

    return (
      <PageHeaderLayout title="管理数字证书">
        <Card bordered={false} style={{ minHeight: 650 }}>
        {
            initialized ?
              <Spin spinning={fetching || loading || deleteFetching}>
                {
                  CAProvider != null ?
                    (!list || !list.length ?
                      <div className={styles.tips}>
                        <Row>
                          <Col span={4} />
                          <Col span={16}>
                            <Alert message='您尚未申请数字证书'
                              description={<span>请先去 <Link to='/merchant/security/certApply' style={{ textDecoration: 'underline' }}>申请安装数字证书&raquo;</Link></span>}
                              type='warning' showIcon />
                          </Col>
                        </Row>
                      </div> :
                      <div>
                        <Table columns={columns} pagination={tablePagination} dataSource={list.map((item, idx) => {
                          const { certSerialNumber, usePlaceDesc, certReqDate, certNotAfter } = item
                          let use = Object.keys(localCA).indexOf(certSerialNumber) >= 0
                          let expired = false, diff = 99
                          if (use) {
                            let c = localCA[certSerialNumber]
                            let d = c.notAfter.replace(/\s/g, ''), serverTime = serverDate
                            diff = Math.floor((getSeconds(d) - getSeconds(serverTime)) / (3600 * 24))
                          }

                          return Object.assign({}, item, {
                            certReqDate: formatTime(certReqDate),
                            certNotAfter: formatTime(certNotAfter),
                            key: idx,
                            usePlaceDesc: <span>
                              {usePlaceDesc}
                              {use ? <span style={{ color: '#00f', marginLeft: 5 }}>(本机正在使用)</span> : null}
                              {diff < 10 && diff >= 0 ? <span style={{ color: '#f00', marginLeft: 5 }}>(即将过期)</span> : null}
                              {diff < 0 ? <span style={{ color: '#999', marginLeft: 5 }}>(已过期)</span> : null}
                            </span>,
                            action: <span>
                              <Popconfirm onConfirm={() => this.deleteCA(certSerialNumber)} title='确认删除吗?'>
                              <a>删除</a>
                              </Popconfirm>
                              {/* {diff < 5 ? <a style={{ marginLeft: 10 }} onClick={() => this.updateCA(certSerialNumber)}>更新</a> : null} */}
                            </span>
                          })
                        })} />
                      </div>) :
                    <Row>
                      <Col span={4} />
                      <Col span={16}>
                        <Alert message='尚未安装签名控件' description='请先安装控件后再申请数字证书' type='info' showIcon />
                        <p style={{ marginTop: 20, textAlign: 'center' }}><a href={CALink} download><Icon type='download' /> 下载安装签名控件</a></p>
                      </Col>
                    </Row>
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
  const { oprName } = state.user.info
  const { list, loading, total, serverDate } = state.certManage
  return {
    mercCd, mercName, phoneNo, oprName, list, loading, total, serverDate
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}


export default connect(mapStateToProps)(CertManage)


