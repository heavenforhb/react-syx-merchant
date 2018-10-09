import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Button, Divider, Table, Icon, Spin, Menu, Dropdown, Popconfirm, Modal } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import moment from 'moment'

import { PAYMENT_STATUS, TRAN_TYPE, BUS_TYPE } from '../../../common/constants'

import { formatTime, fMoney } from '../../../utils/utils'

import Detail from '../../../components/Detail'

const { RangePicker } = DatePicker

import DownloadComponent from '../../../components/Download'

class PaymentList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        page: 1,
        size: 10,
        beginDate: moment().subtract(10, 'days'),
        endDate: moment(),
        outOrderNo: '',
        orderNo: '',
        payOrderSts: '',
        busType: '',
        mercCd: props.currentUser.mercCd
      },
      downloadModal: false
    }

  }

  componentDidMount() {
    this.refresh()
  }

  refresh = () => {
    const { dispatch, loading } = this.props
    if (loading) return false
    dispatch({ type: 'paymentList/fetch', payload: this.state.query })
  }

  queryChange = (key, val) => {
    const tmpObj = { page: 1 }
    tmpObj[key] = val
    // 修改交易类型时充值业务类型
    if (key == 'tranType') tmpObj['busType'] = ''
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
    dispatch({ type: 'paymentList/detail', payload: { orderNo, mercCd: currentUser.mercCd } })
  }

  render() {
    const colProps = {
      xs: 24,
      md: 12,
      lg: 6,
      style: {
        marginBottom: '24px'
      }
    }

    const columns = [{
      title: '发起日期/时间',
      dataIndex: 'orderTime',
      key: 'orderTime',
    }, {
      title: '商户订单号',
      dataIndex: 'outOrderNo',
      key: 'outOrderNo',
    }, {
      title: '付款订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    }, {
      title: '业务类型',
      dataIndex: 'busType',
      key: 'busType',
    }, {
      title: '付款金额（元）',
      dataIndex: 'orderAmt',
      key: 'orderAmt',
    }, {
      title: '手续费（元）',
      dataIndex: 'recFeeAmt',
      key: 'recFeeAmt',
    }, {
      title: '银行名称',
      dataIndex: 'bankName',
      key: 'bankName',
    }, {
      title: '付款状态',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '操作',
      key: 'handle',
      render: (record) => {
        return <a onClick={() => this.queryDetail(record.orderNo)}>详情</a>
      }
    }]

    const { query, downloadModal } = this.state
    const { total, list, statistics, loading, detail, detailModal, dispatch } = this.props
    const { orderNo, payOrder, bankBillNo, orderDt, orderTm, payTm, busType, mercCd, errCodeDesc, payOrderSts, bankName, 
      orderAmt, rmk, bankCd, recFeeAmt, oprCd
    } = detail

    const showDetail = [
      {
        key: '付款订单号',
        val: orderNo ? orderNo : '-'
      }, {
        key: '支付订单号',
        val: payOrder ? payOrder : '-'
      }, {
        key: '银行订单号',
        val: bankBillNo ? bankBillNo : '-'
      }, {
        key: '发起日期/时间',
        val: orderDt ? formatTime(orderDt, orderTm) : '-'
      }, {
        key: '业务类型',
        val: busType ? BUS_TYPE['1003'][busType] : '-'
      }, {
        key: '付款状态',
        val: payOrderSts ? PAYMENT_STATUS[payOrderSts].name : '-'
      }, {
        key: '失败原因',
        val: errCodeDesc ? errCodeDesc : '-'
      }, {
        key: '商户编码',
        val: mercCd ? mercCd : '-'
      }, {
        key: '订单金额',
        val: orderAmt ? fMoney(orderAmt) : '-'
      }, {
        key: '手续费',
        val: recFeeAmt ? fMoney(recFeeAmt) : '0.00'
      }, {
        key: '银行名称',
        val: bankName ? bankName : '-'
      }, {
        key: '支付完成时间',
        val: payTm ? formatTime(payTm) : '-'
      }, {
        key: '操作员',
        val: oprCd ? oprCd : '-'
      }, {
        key: '备注',
        val: rmk ? rmk : '-'
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

    return (
      <PageHeaderLayout
        title="付款记录"
      >
        <Modal visible={detailModal} width={800} onCancel={() => dispatch({ type: 'paymentList/detailModalFlag', payload: { show: false } })} title='订单详情' footer={
          <Button type='primary' size='large' onClick={() => dispatch({ type: 'paymentList/detailModalFlag', payload: { show: false } })}>关闭</Button>}>
          <Detail detail={showDetail} />
        </Modal>
        <Modal visible={downloadModal} width={800} destroyOnClose={true} maskClosable={false} onCancel={() => this.setState({ downloadModal: false })} title='订单详情' footer={null}>
          <DownloadComponent query={query} madeFileUrl={'/api/download/paymentList/madeFile'} downloadUrl={'/api/download/posp/createUrl'} cancel={() => this.setState({ downloadModal: false })} />
        </Modal>
        <Card bordered={false} title="查询条件">
          <Row gutter={24}>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>付款订单号：</span>
              <Input className={styles.inputBox} placeholder="请输入付款订单号"
                onChange={({ target: { value } }) => this.queryChange('orderNo', value)} />
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>商户订单号：</span>
              <Input className={styles.inputBox} placeholder="请输入商户订单号"
                onChange={({ target: { value } }) => this.queryChange('outOrderNo', value)} />
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>付款状态：</span>
              <Select className={styles.select} value={query.payOrderSts} onChange={val => this.queryChange('payOrderSts', val)}>
                <Select.Option value=''>全部</Select.Option>
                {Object.keys(PAYMENT_STATUS).map(key => <Select.Option value={key} key={key}>{PAYMENT_STATUS[key]['name']}</Select.Option>)}
              </Select>
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>付款类型：</span>
              <Select className={styles.select} value={query.busType} onChange={val => this.queryChange('busType', val)}>
                <Select.Option value=''>全部</Select.Option>
                {Object.keys(BUS_TYPE['1005']).map(key => <Select.Option value={key} key={key}>{BUS_TYPE['1005'][key]}</Select.Option>)}
              </Select>
            </Col>
          </Row>
          <Row gutter={24}>
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
              总计金额： <span>{statistics.totalAmt || 0} 元</span>
              <Divider type='vertical' />
              总手续费： <span>{statistics.totalFeeAmt || 0} 元</span>
            </Spin>
          </div>
        }>
          <Row>
            <Col xs={0} md={0} lg={24}>
              <Table columns={columns} dataSource={(list || []).map((item, idx) => {
                const { orderDt, orderTm, orderAmt, payOrderSts, recFeeAmt, outOrderNo, orderNo, bankName, busType } = item
                const status = PAYMENT_STATUS[payOrderSts]
                return {
                  key: idx,
                  orderTime: formatTime(orderDt, orderTm),
                  orderAmt: fMoney(orderAmt),
                  recFeeAmt: fMoney(recFeeAmt),
                  busType: BUS_TYPE['1003'][busType],
                  bankName,
                  orderNo,
                  outOrderNo: outOrderNo || '-', 
                  status: <span style={{ color: status.color }}>{status.icon ? <Icon type={status.icon} /> : null} {status.name}</span>
                }
              })} loading={loading} pagination={tablePagination} />
            </Col>
            <Col xs={24} md={24} lg={0}>
              <Table columns={[
                {
                  title: '付款订单号',
                  dataIndex: 'orderNo',
                  key: 'orderNo',
                  width: '30%',
                  render: (text) => {
                    return <span key='orderNo' style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>
                  }
                },
                {
                  title: '付款状态',
                  dataIndex: 'status',
                  key: 'status'
                },
                {
                  title: '操作',
                  key: 'handle',
                  render: (record) => {
                    return <a onClick={() => this.queryDetail(record.orderNo)}>详情</a>
                  }
                }
              ]} dataSource={(list || []).map((item, idx) => {
                const { orderNo, payOrderSts } = item
                const status = PAYMENT_STATUS[payOrderSts]
                return {
                  key: idx,
                  orderNo,
                  status: <span style={{ color: status.color }}>{status.icon ? <Icon type={status.icon} /> : null} {status.name}</span>
                }
              })} loading={loading} pagination={tablePagination} />
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    )
  }
}

function mapStateToProps(state) {
  const { loading, list, total, statistics, detail, detailModal } = state.paymentList
  return { loading, list, total, statistics, detail, detailModal, currentUser: state.user.info, }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(PaymentList)