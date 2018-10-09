import React, { Component } from 'react'
import { connect } from 'dva'
import {
  Row, Col, Alert, Select, Input, Button, Spin, Icon, Steps, Progress, Card, notification, Table, Checkbox, Form, Popconfirm,
  Upload, Modal
} from 'antd'

import { Link } from 'dva/router'

import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import classes from './index.less'
import LoadingBlock from '../../components/LoadingBlock'
import request from '../../utils/request'
import base64 from '../../utils/base64'
import SignMessenger from '../../utils/SignMessenger'

import { getBrowser, formatTime, fMoney } from '../../utils/utils'
import { CERT_LOCATION } from '../../common/constants'

class ApplySettlement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mercCd: props.mercCd,
      fetching: false,
      CAProvider: null,
      signObj: null,
      certSignBuf: '',
      certList: [],
      initialized: false,
      checkedObj: {},
      fileList: [],
      list: [],
      initDataFetching: false,
      previewVisible: false,
      previewImage: ''
    }
  }

  GetLastDay = (year, month) => {
    var date = new Date(year, month, 1),
      lastDay = new Date(date.getTime() - 864e5).getDate();
    return lastDay
  }

  rangeDate = (queryDate) => {
    if (!queryDate) return false
    let d = queryDate.format('YYYY-MM')
    let y = d.substr(0, 4), m = d.substr(5, 2)
    let len = this.GetLastDay(y, m)
    let beginDate = d + '-' + '01'
    let endDate = d + '-' + len
    return { beginDate, endDate }
  }


  beforeUpload = (file) => {
    if (!file.type) return false
    let fileType = file.type.split('/')[0]
    const isJPG = fileType === 'image'
    if (!isJPG) {
      message.error('只能上传图片')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('上传图片过大')
    }
    return isJPG && isLt2M
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ file, fileList }) => {
    const { response = {} } = file
    let imgsPath = response.result
    this.setState({ imgsPath, fileList })
  }

  componentDidMount() {
    this._isMounted = true
    this.init()
    if (this.props.step == '0') {
      this.initData()
      let checkedObj = {}
      this.props.dateList.split(',').map(item => {
        if (item) {
          checkedObj[`${item}`] = true
        }
      })
      this.setState({ checkedObj })
    }
  }

  componentWillMount() {
    this._isMounted = false
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
    }).catch(e => {
      notification.error({ message: e.message })
      this.setState({ fetching: false, initialized: true })
    })
  }

  initData = () => {
    const { mercCd, beginDate, endDate } = this.props
    this.setState({ initDataFetching: true })
    request('/api/profitSettle/initProfitData', {
      data: {
        agentCd: mercCd, beginDate, endDate
      }
    }).then(data => {
      this.setState({ list: data, initDataFetching: false })
    }).catch(error => {
      if (error.number == '401') {
        notification.error({ message: error.message })
        this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
      } else {
        this.setState({ initDataFetching: false })
        notification.error({ message: e.toString() })
      }
    })
  }

  onChange = (e, record) => {
    const { checkedObj } = this.state
    const { uuid } = this.props
    let queryData = {}
    queryData.uuid = record.uuid
    queryData.applyUuid = uuid
    queryData.isBind = e.target.checked.toString()
    this.setState({ initDataFetching: true })
    request('/api/profitSettle/bindApply', { method: 'POST', data: queryData }).then(data => {
      let check = record.key
      if (e.target.checked) {
        checkedObj[check] = e.target.checked
      } else {
        delete checkedObj[check]
      }
      this.setState({ initDataFetching: false, checkedObj })
      this.props.dispatch({
        type: 'profitSettle/bindApply',
        payload: {
          orderAmt: data.orderAmt
        }
      })
    }).catch(error => {
      if (error.number == '401') {
        notification.error({ message: error.message })
        this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
      } else {
        this.setState({ initDataFetching: false })
        notification.error({ message: '日期选择失败，请重试' })
      }
    })
  }

  setp_one = () => {
    if (JSON.stringify(this.state.checkedObj) == "{}") return notification.error({ message: '请选择上传日期' })
    this.props.dispatch({ type: 'profitSettle/stepOne', payload: { applyUuid: this.props.uuid } })
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { fileList, signObj } = this.state
        // 图片地址
        let imageAdess = ''
        fileList.map(item => {
          const { result } = item.response
          imageAdess += result + ','
        })
        let imgAddr = imageAdess.substr(0, imageAdess.length - 1)
        // 发票编号
        const { invoice } = values
        let invoiceStr = invoice.replace(/，/g, ',')
        let flag = invoiceStr.split(',').map(item => {
          if (!(/^[0-9]*$/.test(item))) {
            return false
          } else {
            return true
          }
        })
        if (flag.join(',').indexOf('false') != -1) return message.info('输入发票信息有误')

        let queryData = {}
        queryData.invoice = invoiceStr
        queryData.applyUuid = this.props.uuid

        const goApply = (req) => {
          this.props.dispatch({ type: 'profitSettle/apply', payload: req })
        }

        const signData = function (data) {
          const tmpArr = []
          for (let key in data) tmpArr.push(key)
          tmpArr.sort((a, b) => b.charCodeAt(0) > a.charCodeAt(0) ? -1 : 1)
          return tmpArr.map(key => data[key]).join('')
        }
        let beforeSignData = signData(Object.assign({}, queryData, { agentCd: this.props.mercCd }))

        if (signObj) {
          const { CAProvider, certList } = this.state
          // 需要签名
          let cert = certList[0]
          signObj.selectCert(CAProvider, cert.certid, 6, 1).then(res => {
            let content = base64.encode(base64.utf16to8(beforeSignData))
            signObj.sign(CAProvider, content, 0, 1).then(data => {
              goApply(Object.assign({}, queryData, {
                signedData: data, imageAddress: imgAddr
              }))
            }).catch(err => {
              message.warn('数据签名错误！若此情况持续出现，请将本机证书删除，重新安装后再试')
            })
          })
        }
      }
    })
  }



  render() {
    const {
      fetching, fileList, CAProvider, certList, initialized, list, checkedObj, initDataFetching, previewVisible, previewImage
    } = this.state
    const { dateList, orderAmt, orderNo, step, stepOneLoading, stepTwoLoading } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
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
          offset: 6,
        },
      },
    }

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )

    let TRAN_DT = dateList.split(',').map(item => {
      return formatTime(item)
    })

    return (
      <Card bordered={false} style={{ minHeight: 420 }}>
        <Modal visible={previewVisible} width={600} footer={null} onCancel={this.handleCancel}>
          <div style={{ padding: 20 }}>
            <img style={{ width: '100%' }} src={previewImage} />
          </div>
        </Modal>
        {
          initialized ?
            <Spin spinning={fetching}>
              {
                certList.length ?
                  <Spin spinning={false}>
                    <Steps current={+step}>
                      <Steps.Step icon={<Icon type='calendar' />} title='选择申请日期' />
                      <Steps.Step icon={<Icon type='upload' />} title='上传发票' />
                      <Steps.Step icon={<Icon type='check-circle' />} title='申请成功 ' />
                    </Steps>
                    <div>
                      {
                        step == 0 &&
                        <div style={{ marginTop: 20, padding: 30 }}>
                          <Row type='flex' justify='space-between' style={{ marginBottom: 30 }}>
                            <Col span={8} style={{ textAlign: 'left', paddingLeft: 10 }}>分润结算金额： {orderAmt || 0} 元</Col>
                            <Col span={16} style={{ textAlign: 'right', paddingRight: 10 }}>申请号：{orderNo}</Col>
                          </Row>
                          <Row style={{ marginBottom: 30 }}><Col><Table columns={[
                            {
                              title: <span><Checkbox disabled /></span>,
                              key: 'checked',
                              render: (record) => {
                                const { orderDt } = record
                                return (
                                  <Checkbox checked={checkedObj[orderDt]} onChange={(e) => this.onChange(e, record)} />
                                )
                              }
                            },
                            {
                              title: '交易日期',
                              dataIndex: 'ORDER_DT',
                              key: 'ORDER_DT'
                            }, {
                              title: '交易总金额（元）',
                              dataIndex: 'TRAN_AMT',
                              key: 'TRAN_AMT',
                            }, {
                              title: '交易总笔数',
                              dataIndex: 'TRAN_CNT',
                              key: 'TRAN_CNT',
                            }, {
                              title: '分润金额（元）',
                              dataIndex: 'ORDER_AMT',
                              key: 'ORDER_AMT',
                            }
                          ]} loading={initDataFetching} dataSource={list.map((item, idx) => {
                            const { orderDt, tranAmt, tranCnt, orderAmt } = item
                            return Object.assign({}, item, {
                              key: orderDt,
                              ORDER_DT: formatTime(orderDt),
                              ORDER_AMT: fMoney(orderAmt),
                              TRAN_CNT: tranCnt,
                              TRAN_AMT: fMoney(tranAmt)
                            })
                          })} pagination={{ pageSize: 5 }} /></Col></Row>
                          <Row style={{ marginBottom: 30, textAlign: 'left' }}><Col>
                            <Popconfirm title="日期选择完成之后不可修改" okText="确认" cancelText="取消" onConfirm={this.setp_one}>
                              <Button type='primary' loading={stepOneLoading} size='large' style={{ width: 320 }}>下一步</Button>
                            </Popconfirm>
                          </Col></Row>
                        </div>
                      }
                      {
                        step == 1 &&
                        <div style={{ marginTop: 20 }}>
                          <Form>
                            <Form.Item
                              {...formItemLayout}
                              label="交易日期"
                            >
                              {getFieldDecorator('tranDt', {
                                rules: [
                                  { required: true, },
                                ],
                                initialValue: TRAN_DT
                              })(
                                <Input.TextArea disabled rows='3' />
                              )}
                            </Form.Item>
                            <Form.Item
                              {...formItemLayout}
                              label="结算分润金额（元）"
                            >
                              {getFieldDecorator('orderAmt', {
                                rules: [
                                  { required: true, }
                                ],
                                initialValue: fMoney(orderAmt)
                              })(
                                <Input disabled />
                              )}
                            </Form.Item>
                            <Form.Item
                              {...formItemLayout}
                              label="发票信息"
                            >
                              <div style={{ border: '1px solid #DFDFDF', borderRadius: '4px', backgroundColor: '#F7F7F7', paddingLeft: '10px' }}>
                                <p>纳税登记号：9111010266751881X3</p>
                                <p>企业名称：商银信支付服务有限责任公司</p>
                                <p>营业地址：北京市西城区平安里西大街26号楼等3幢28号楼401-01室</p>
                                <p>电话号码：83496600</p>
                                <p>银行账号：招商银行北京宣武门支行 861982256910001</p>
                              </div>
                            </Form.Item>
                            <Form.Item
                              {...formItemLayout}
                              label="发票编号"
                            >
                              {getFieldDecorator('invoice', {
                                rules: [
                                  { required: true, message: '请输入发票编号' }
                                ]
                              })(
                                <Input placeholder='请输入发票编号' />
                              )}
                              <span style={{ color: '#999999' }}>相邻的发票编号用“,”隔开</span>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label='发票图片'>
                              {getFieldDecorator('imageAdess', {
                                rules: [
                                  { required: true, message: '请上传发票图片' }
                                ]
                              })(
                                <Row>
                                  <Col span={24}>
                                    <Upload
                                      action="/api/common/file"
                                      listType="picture-card"
                                      fileList={fileList}
                                      beforeUpload={this.beforeUpload}
                                      onPreview={this.handlePreview}
                                      onChange={this.handleChange}
                                    >
                                      {fileList.length >= 31 ? null : uploadButton}
                                    </Upload>
                                  </Col>
                                  <Col span={24} style={{ color: '#999999', display: 'block' }}>上传发票照片jpg/png格式文件，单个文件不能超过200kb</Col>
                                </Row>
                              )}
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                              <Button type="primary" onClick={this.onSubmit} loading={stepTwoLoading} style={{ width: '320px' }} size='large'>确认提交</Button>
                            </Form.Item>
                          </Form>
                        </div>
                      }
                      {
                        step == 2 &&
                        <div style={{ marginTop: 60, textAlign: 'center' }}>
                          <p><Icon type='check-circle' style={{ color: '#00AEEF', fontSize: 64, display: 'inline-block', paddingBottom: '20px' }} /></p>
                          <p style={{ display: 'inline-block', fontSize: 20 }}>每月分润审核的窗口时间为18号-30号，请您耐心等待</p>
                          <p style={{ padding: '30px 0' }}><Button type='primary' size='large' style={{ width: 160 }} onClick={() => this.props.dispatch({ type: 'profitSettle/visible', payload: { show: false } })}>关闭</Button></p>
                        </div>
                      }
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
    )
  }
}

const ApplySettlementForm = Form.create()(ApplySettlement)

function mapStateToProps(state) {
  const { mercCd } = state.user.info
  const { dateList, orderAmt, orderNo, step, uuid, stepTwoLoading, stepOneLoading, beginDate, endDate } = state.profitSettle
  return {
    mercCd, dateList, orderAmt, orderNo, step, uuid, stepTwoLoading, stepOneLoading, beginDate, endDate
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(ApplySettlementForm)


