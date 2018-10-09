import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Button, Divider, Table, Icon, Spin, Form, Menu, Dropdown, Popconfirm, Modal, notification } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import moment from 'moment'
import { Link, routerRedux } from 'dva/router'

import request from '../../../utils/request'

import { ORDER_STATUS, TRAN_TYPE, BUS_TYPE } from '../../../common/constants'

import { formatTime, fMoney } from '../../../utils/utils'

import Detail from '../../../components/Detail'
import DownloadComponent from '../../../components/Download'

const { RangePicker } = DatePicker

const FormItem = Form.Item

class Order extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        page: 1,
        size: 10,
        beginDate: moment().subtract(10, 'days'),
        endDate: moment(),
        orderSts: '',
        tranType: '',
        busType: '',
        mercCd: props.currentUser.mercCd
      },
      downloadModal: false,
      notifyFetching: false,
      refundMessage: {},
      isRefund: false,
      refundReason: '',
      refundFetching: false
    }
  }

  componentDidMount() {
    this.refresh()
  }

  refresh = () => {
    const { dispatch, loading } = this.props
    if (loading) return false
    dispatch({ type: 'order/fetch', payload: this.state.query })
  }

  queryChange = (key, val, bol) => {
    const tmpObj = { page: 1 }
    tmpObj[key] = val
    // 修改交易类型时充值业务类型
    if (key == 'tranType') tmpObj['busType'] = ''
    if(bol && val) {
      tmpObj['beginDate'] = null
      tmpObj['endDate'] = null
    }
    this.setState({ query: Object.assign({}, this.state.query, tmpObj) })
  }

  setDateRange = (range) => {
    let beginDate = null, endDate = null
    if (typeof range == 'number') {
      beginDate = moment().subtract(range, 'days'), endDate = moment()
    } else {
      beginDate = range[0], endDate = range[1]
    }
    this.setState({ query: Object.assign({}, this.state.query, { beginDate, endDate }) }, this.refresh)
  }

  queryDetail = (orderNo) => {
    const { dispatch, loading, currentUser } = this.props
    if (loading) return false
    dispatch({ type: 'order/detail', payload: { orderNo, mercCd: currentUser.mercCd } })
  }

  // 重发通知
  sendNotify = (record) => {
    if (this.props.loading) return false
    const { orderNo, mercCd, _tranType } = record
    this.setState({ notifyFetching: true })
    request('/api/order/notifyReissue', {
      method: 'GET',
      data: {
        orderNo, mercCd, tranType: _tranType
      }
    }).then(data => {
      this.setState({ notifyFetching: false })
      if (data.resultCode == 'SUCCESS') {
        notification.success({ message: '补发交易通知成功' })
        this.refresh()
      } else {
        notification.error({ message: data.errCodeDesc })
      }
    }).catch(e => {
      this.setState({ notifyFetching: false })
      notification.error({ message: e.message })
    })
  }

  refundModalControl = (record) => {
    this.setState({ refundMessage: record, isRefund: true })
  }

  // 退款申请
  refundFetch = () => {
    if (this.props.loading) return false
    const { orderNo, mercCd, orderAmt } = this.state.refundMessage
    this.setState({ refundFetching: true })
    request('/api/order/refundApply', {
      method: 'POST',
      data: {
        oriOrderNo: orderNo,
        mercCd,
        orderAmt,
        refundReason: this.state.refundReason
      }
    }).then(data => {
      this.setState({ refundFetching: false })
      if (data.resultCode == 'SUCCESS') {
        notification.success({ message: '退款申请成功' })
        this.queryChange('orderSts', 'REFUND')
        this.setState({ isRefund: false, refundReason: '' }, () => {
          this.refresh()
        })
      } else {
        notification.error({ message: data.errCodeDesc })
      }
    }).catch(e => {
      this.setState({ refundFetching: false })
      notification.error({ message: e.message })
    })
  }

  // 查询退款信息
  refundMsgSearch = (orderNo) => {
    window.sessionStorage.orderNo = orderNo
    this.props.dispatch(routerRedux.replace('/center/deal/refund'))
  }

  render() {
    console.log(this.state.query)
    const colProps = {
      xs: 24,
      md: 12,
      lg: 6,
      style: {
        marginBottom: '24px'
      }
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    }

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    }

    const columns = [
      {
        title: '订单时间',
        dataIndex: 'orderDate',
        key: 'orderDate',
      }, {
        title: '商户订单号',
        dataIndex: 'outOrderNo',
        key: 'outOrderNo',
      }, {
        title: '平台订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
      }, {
        title: '交易类型',
        dataIndex: 'tranType',
        key: 'tranType',
      }, {
        title: '业务类型',
        dataIndex: 'busType',
        key: 'busType',
      }, {
        title: '订单金额(元)',
        dataIndex: 'orderAmt',
        key: 'orderAmt',
      }, {
        title: '手续费(元)',
        dataIndex: 'feeAmt',
        key: 'feeAmt',
      }, {
        title: '交易状态',
        dataIndex: 'status',
        key: 'status'
      }, {
        title: '操作',
        key: 'handle',
        render: (record) => {
          const { orderSts, orderNo } = record
          const menu = (
            <Menu>
              <Menu.Item>
                <a onClick={() => this.queryDetail(orderNo)}>查看详情</a>
              </Menu.Item>
              {
                orderSts == 'SUCCESS' ? <Menu.Item>
                  <Popconfirm onConfirm={() => this.sendNotify(record)} title='确定补发通知吗'>
                    <a>补发通知</a>
                  </Popconfirm>
                </Menu.Item> : null
              }
              {
                orderSts == 'SUCCESS' ? <Menu.Item>
                  <a onClick={() => this.refundModalControl(record, true)}>申请退款</a>
                </Menu.Item> : null
              }
              {
                orderSts == 'REFUND' ? <Menu.Item>
                  <a onClick={() => this.refundMsgSearch(orderNo)}>退款信息</a>
                </Menu.Item> : null
              }
            </Menu>
          )
          return (

            <Dropdown overlay={menu}>
              <a className='ant-dropdown-link'>
                详情 <Icon type='down' />
              </a>
            </Dropdown>
          )
        }
      }
    ]

    const { query, downloadModal, notifyFetching, isRefund, refundMessage, refundReason, refundFetching } = this.state
    const { total, list, statistics, loading, detail, detailModal, dispatch } = this.props
    const { orderNo, payOrder, bankBillNo, limitPay, time, orderDt, orderTm, outOrderDt, outOrderTm, payTm, tranType, busType, orderType, orderSts, mercCd,
      outOrderNo, pmercCd, agentCd, userCd, agreeNo, payAccount, mercName, goodsName, goodsDesc, goodsType, goodsDetail, orderUrl, orderAmt, recFeeAmt, orderExpTm,
      orderRmk
    } = detail

    const showDetail = [
      {
        key: '订单号',
        val: orderNo ? orderNo : '-'
      }, {
        key: '支付订单号',
        val: payOrder ? payOrder : '-'
      }, {
        key: '银行订单号',
        val: bankBillNo ? bankBillNo : '-'
      }, {
        key: '订单时间',
        val: orderDt ? formatTime(orderDt, orderTm) : '-'
      }, {
        key: '商户下单时间',
        val: orderDt ? formatTime(outOrderDt, outOrderTm) : '-'
      }, {
        key: '支付完成时间',
        val: payTm ? formatTime(payTm) : '-'
      }, {
        key: '交易类型',
        val: tranType ? TRAN_TYPE[tranType] : '-'
      }, {
        key: '业务类型',
        val: busType ? BUS_TYPE[tranType][busType] : '-'
      }, {
        key: '支付状态',
        val: orderSts ? ORDER_STATUS[orderSts].name : '-'
      }, {
        key: '商户编码',
        val: mercCd ? mercCd : '-'
      }, {
        key: '商户订单号',
        val: outOrderNo ? outOrderNo : '-'
      }, {
        key: '付款方账号',
        val: payAccount ? payAccount : '-'
      }, {
        key: '商户名称',
        val: mercName ? mercName : '-'
      }, {
        key: '商品名称',
        val: goodsName ? goodsName : '-'
      }, {
        key: '商品描述',
        val: goodsDesc ? goodsDesc : '-'
      }, {
        key: '商品详情',
        val: goodsDetail ? goodsDetail : '-'
      }, {
        key: '订单地址',
        val: orderUrl ? orderUrl : '-'
      }, {
        key: '订单金额',
        val: orderAmt ? fMoney(orderAmt) : '-'
      }, {
        key: '手续费金额',
        val: recFeeAmt ? fMoney(recFeeAmt) : '-'
      }, {
        key: '支付限额',
        val: limitPay ? fMoney(limitPay) : '-'
      }, {
        key: '订单超时时间',
        val: orderExpTm ? formatTime(orderExpTm) : '-'
      }, {
        key: '订单备注',
        val: orderRmk ? orderRmk : '-'
      }
    ]

    const tablePagination = {
      total: total,
      current: query.page,
      pageSize: query.size,
      onChange: page => {
        this.setState({ query: Object.assign({}, query, { page }) }, this.refresh)
      }
    }

    const filterBusType = BUS_TYPE[query.tranType] || {}
    const filterTranType = {}
    for (let key in TRAN_TYPE) {
      if (key == '1001' || key == '1002') {
        filterTranType[key] = TRAN_TYPE[key]
      }
    }
    return (
      <div>
        <Modal visible={detailModal} width={800} destroyOnClose={true} maskClosable={false} onCancel={() => dispatch({ type: 'order/detailModalFlag', payload: { show: false } })} title='订单详情' footer={
          <Button type='primary' size='large' onClick={() => dispatch({ type: 'order/detailModalFlag', payload: { show: false } })}>关闭</Button>}>
          <Detail detail={showDetail} />
        </Modal>
        <Modal visible={downloadModal} width={800} destroyOnClose={true} maskClosable={false} onCancel={() => this.setState({ downloadModal: false })} title='订单详情' footer={null}>
          <DownloadComponent query={query} madeFileUrl={'/api/download/order/madeFile'} downloadUrl={'/api/download/order/createUrl'} cancel={() => this.setState({ downloadModal: false })} />
        </Modal>
        {
          !isRefund ?
            <PageHeaderLayout
              title="订单管理"
            >
              <Card bordered={false} title="查询条件">
                <Row gutter={24}>
                  <Col {...colProps} className={styles.col}>
                    <span className={styles.inputLabel}>平台订单号：</span>
                    <Input className={styles.inputBox} placeholder="请输入平台订单号"
                      onChange={({ target: { value } }) => this.queryChange('orderNo', value, true)} />
                  </Col>
                  <Col {...colProps} className={styles.col}>
                    <span className={styles.inputLabel}>商户订单号：</span>
                    <Input className={styles.inputBox} placeholder="请输入商户订单号"
                      onChange={({ target: { value } }) => this.queryChange('outOrderNo', value, true)} />
                  </Col>
                  <Col {...colProps} className={styles.col}>
                    <span className={styles.inputLabel}>交易状态：</span>
                    <Select className={styles.select} value={query.orderSts} onChange={val => this.queryChange('orderSts', val)}>
                      <Select.Option value=''>全部</Select.Option>
                      {Object.keys(ORDER_STATUS).map(key => <Select.Option value={key} key={key}>{ORDER_STATUS[key]['name']}</Select.Option>)}
                    </Select>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col {...colProps} className={`${styles.col} xs-hide`}>
                    <span className={styles.inputLabel}>交易类型：</span>
                    <Select className={styles.select} value={query.tranType} onChange={val => this.queryChange('tranType', val)}>
                      <Select.Option value=''>全部</Select.Option>
                      {Object.keys(filterTranType).map(key => <Select.Option value={key} key={key}>{filterTranType[key]}</Select.Option>)}
                    </Select>
                  </Col>
                  <Col {...colProps} className={`${styles.col} xs-hide`}>
                    <span className={styles.inputLabel}>业务类型：</span>
                    <Select className={styles.select} value={query.busType} onChange={val => this.queryChange('busType', val)}>
                      <Select.Option value=''>全部</Select.Option>
                      {Object.keys(filterBusType).map(key => <Select.Option value={key} key={key}>{filterBusType[key]}</Select.Option>)}
                    </Select>
                  </Col>
                  <Col {...colProps} md={24} lg={12} className={`${styles.col} xs-hide`}>
                    <span className={styles.inputLabel} style={{ width: '90px' }}><em style={{ color: '#f00', marginRight: '3px' }}>*</em>日期范围：</span>
                    <RangePicker
                      value={[query.beginDate, query.endDate]}
                      format="YYYY-MM-DD"
                      placeholder={['开始时间', '结束时间']}
                      style={{ flex: '1' }}
                      onChange={this.setDateRange}
                    />
                    <span className={styles.rangeButton}>
                      <Button type='dashed' size='small' onClick={() => this.setDateRange(0)}>今天</Button>
                      <Button type='dashed' size='small' onClick={() => this.setDateRange(6)}>最近一周</Button>
                      <Button type='dashed' size='small' onClick={() => this.setDateRange(30)}>最近一个月</Button>
                    </span>
                  </Col>
                </Row>
                <Divider style={{ marginTop: 0 }} dashed={true} />
                <Row style={{ textAlign: 'right' }}>
                  <Button type="primary" icon="search" onClick={this.refresh} loading={loading}>查询</Button>
                  <a target='_blank' className={'xs-hide'} style={{ marginLeft: 20 }} >
                    <Button type="default" icon="download" onClick={() => this.setState({ downloadModal: true })}>下载结果</Button>
                  </a>
                </Row>
              </Card>
              <Card bordered={false} title="查询结果" style={{ marginTop: '24px', minHeight: '420px' }} extra={
                <div style={{ color: '#999' }}>
                  <Spin spinning={loading}>
                    查询结果共： <span>{statistics.totalCnt || 0} 条</span>
                    <Divider type='vertical' />
                    总金额： <span>{statistics.totalAmt || 0} 元</span>
                    <Divider type='vertical' />
                    手续费： <span>{statistics.totalFeeAmt || 0} 元</span>
                  </Spin>
                </div>
              }>
                <Row>
                  <Col xs={0} md={0} lg={24}>
                    <Table columns={columns} dataSource={(list || []).map((item, idx) => {
                      const { orderDt, orderTm, orderNo, outOrderNo, tranType, orderAmt, recFeeAmt, busType, orderSts, mercCd } = item
                      const status = ORDER_STATUS[orderSts]
                      return {
                        key: idx,
                        orderSts,
                        orderDate: formatTime(orderDt + orderTm),
                        orderNo,
                        outOrderNo,
                        mercCd,
                        _tranType: tranType,
                        tranType: TRAN_TYPE[tranType],
                        busType: BUS_TYPE[tranType][busType] || '-',
                        orderAmt: fMoney(orderAmt),
                        feeAmt: fMoney(recFeeAmt),
                        status: <span style={{ color: status.color }}>{status.icon ? <Icon type={status.icon} /> : null} {status.name}</span>
                      }
                    })} loading={loading || notifyFetching} pagination={tablePagination} />
                  </Col>
                  <Col xs={24} md={24} lg={0}>
                    <Table columns={[
                      {
                        title: '订单号',
                        dataIndex: 'outOrderNo',
                        key: 'outOrderNo',
                        width: '30%',
                        render: (text) => {
                          return <span key='outOrderNo' style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>
                        }
                      },
                      {
                        title: '交易状态',
                        dataIndex: 'status',
                        key: 'status'
                      },
                      {
                        title: '操作',
                        key: 'handle',
                        render: (record) => {
                          const { orderSts, orderNo } = record
                          const menu = (
                            <Menu>
                              <Menu.Item>
                                <a onClick={() => this.queryDetail(orderNo)}>查看详情</a>
                              </Menu.Item>
                              {
                                orderSts == 'SUCCESS' ? <Menu.Item>
                                  <Popconfirm onConfirm={() => this.sendNotify(record)} title='确定补发通知吗'>
                                    <a>补发通知</a>
                                  </Popconfirm>
                                </Menu.Item> : null
                              }
                              {
                                orderSts == 'SUCCESS' ? <Menu.Item>
                                  <a onClick={() => this.refundModalControl(record, true)}>申请退款</a>
                                </Menu.Item> : null
                              }
                              {
                                orderSts == 'REFUND' ? <Menu.Item>
                                  <a onClick={() => this.refundMsgSearch(orderNo)}>退款信息</a>
                                </Menu.Item> : null
                              }
                            </Menu>
                          )
                          return (

                            <Dropdown overlay={menu}>
                              <a className='ant-dropdown-link'>
                                详情 <Icon type='down' />
                              </a>
                            </Dropdown>
                          )
                        }
                      }
                    ]} dataSource={(list || []).map((item, idx) => {
                      const { outOrderNo, orderSts, orderNo, mercCd, tranType } = item
                      const status = ORDER_STATUS[orderSts]
                      return {
                        key: idx,
                        orderSts,
                        orderNo,
                        outOrderNo,
                        mercCd,
                        _tranType: tranType,
                        status: <span style={{ color: status.color }}>{status.icon ? <Icon type={status.icon} /> : null} {status.name}</span>
                      }
                    })} loading={loading || notifyFetching} pagination={tablePagination} />
                  </Col>
                </Row>
              </Card>
            </PageHeaderLayout> :
            <PageHeaderLayout
              title="退款申请"
            >
              <Card bordered={false} title="退款信息">
                <Form
                  hideRequiredMark
                  style={{ marginTop: 8 }}
                >
                  <FormItem
                    {...formItemLayout}
                    label="商户订单号"
                  >
                    <Input disabled value={refundMessage.outOrderNo} />
                    {/* <span>{refundMessage.outOrderNo}</span> */}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="平台订单号"
                  >
                    <Input disabled value={refundMessage.orderNo} />
                    {/* <span>{refundMessage.orderNo}</span> */}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="订单金额（元）"
                  >
                    <Input disabled value={refundMessage.orderAmt} />
                    {/* <span>{refundMessage.orderAmt}<span style={{ paddingLeft: 8 }}>元</span></span> */}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="退款方式"
                  >
                    <span>原路返回</span>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="退款扣款资金（元）"
                  >
                    <Input disabled value={refundMessage.orderAmt} />
                    {/* <span>{refundMessage.orderAmt}<span style={{ paddingLeft: 8 }}>元</span></span> */}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="退款原因"
                  >
                    <Input.TextArea rows={3} value={refundReason} onPressEnter={this.refundFetch} onChange={e => this.setState({ refundReason: e.target.value })} />
                  </FormItem>
                  <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                    <Button type="primary" loading={refundFetching} onClick={this.refundFetch}>
                      确认修改
                    </Button>
                  </FormItem>
                </Form>
              </Card>
            </PageHeaderLayout>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { loading, list, total, statistics, detail, detailModal } = state.order
  return { loading, list, total, statistics, detail, detailModal, currentUser: state.user.info, }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(Order)