import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Button, Divider, Table, Icon, Spin, Menu, Dropdown, Popconfirm, Modal } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import moment from 'moment'

import { REFUND_STATUS, TRAN_TYPE, BUS_TYPE } from '../../../common/constants'

import { formatTime, fMoney } from '../../../utils/utils'

import Detail from '../../../components/Detail'

const { RangePicker } = DatePicker

import DownloadComponent from '../../../components/Download'

class Refund extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        page: 1,
        size: 10,
        beginDate: moment().subtract(10, 'days'),
        endDate: moment(),
        oriOrderNo: window.sessionStorage.orderNo ? window.sessionStorage.orderNo : '',
        orderNo: '',
        refOrderSts: '',
        mercCd: props.currentUser.mercCd
      },
      downloadModal: false
    }

  }

  componentDidMount() {
    if(window.sessionStorage.orderNo) {
      window.sessionStorage.removeItem('orderNo')
    }
    this.refresh()
  }

  refresh = () => {
    const { dispatch, loading } = this.props
    if (loading) return false
    dispatch({ type: 'refund/fetch', payload: this.state.query })
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
    dispatch({ type: 'refund/detail', payload: { orderNo, mercCd: currentUser.mercCd } })
  }

  render() {
    const colProps = {
      xs: 24,
      md: 12,
      lg: 8,
      style: {
        marginBottom: '24px'
      }
    }

    const columns = [{
      title: '退款订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    }, {
      title: '原订单号',
      dataIndex: 'oriOrderNo',
      key: 'oriOrderNo',
    }, {
      title: '退款日期',
      dataIndex: 'orderTime',
      key: 'orderTime',
    }, {
      title: '退款金额（元）',
      dataIndex: 'orderAmt',
      key: 'orderAmt',
    }, {
      title: '退款状态',
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
    const { orderNo, payOrder, bankBillNo, oriOrderNo, msgId, outOrderDt, outOrderTm, orderDt, orderTm, payTm, tranType, busType, id,
      mercCd, refOrderSts, spbillIp, resultCode, errCode, errCodeDesc, orderAmt, rmk
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
        key: '原订单号（退款）',
        val: oriOrderNo ? oriOrderNo : '-'
      }, {
        key: '日志号',
        val: msgId ? msgId : '-'
      }, {
        key: '交易时间',
        val: orderDt ? formatTime(orderDt, orderTm) : '-'
      }, {
        key: '支付时间',
        val: payTm ? formatTime(payTm) : '-'
      }, {
        key: '交易类型',
        val: tranType ? TRAN_TYPE[tranType] : '-'
      }, {
        key: '业务类型',
        val: busType ? BUS_TYPE[tranType][busType] : '-'
      }, {
        key: 'ID',
        val: id ? id : '-'
      }, {
        key: '商户编码',
        val: mercCd ? mercCd : '-'
      }, {
        key: '退款状态',
        val: refOrderSts ? REFUND_STATUS[refOrderSts].name : '-'
      }, {
        key: '下单终端Ip',
        val: spbillIp ? spbillIp : '-'
      }, {
        key: '结果代码',
        val: resultCode ? resultCode : '-'
      }, {
        key: '错误代码',
        val: errCode ? errCode : '-'
      }, {
        key: '错误代码描述',
        val: errCodeDesc ? errCodeDesc : '-'
      }, {
        key: '订单金额',
        val: orderAmt ? fMoney(orderAmt) : '-'
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
        title="退款查询"
      >
        <Modal visible={detailModal} width={800} onCancel={() => dispatch({ type: 'refund/detailModalFlag', payload: { show: false } })} title='订单详情' footer={
          <Button type='primary' size='large' onClick={() => dispatch({ type: 'refund/detailModalFlag', payload: { show: false } })}>关闭</Button>}>
          <Detail detail={showDetail} />
        </Modal>
        <Modal visible={downloadModal} width={800} destroyOnClose={true} maskClosable={false} onCancel={() => this.setState({ downloadModal: false })} title='订单详情' footer={null}>
          <DownloadComponent query={query} madeFileUrl={'/api/download/refund/madeFile'} downloadUrl={'/api/download/order/createUrl'} cancel={() => this.setState({ downloadModal: false })} />
        </Modal>
        <Card bordered={false} title="查询条件">
          <Row gutter={24}>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>退款订单号：</span>
              <Input className={styles.inputBox} placeholder="请输入退款订单号"
                onChange={({ target: { value } }) => this.queryChange('orderNo', value)} />
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>原订单号：</span>
              <Input className={styles.inputBox} placeholder="请输入原订单号" value={query.oriOrderNo}
                onChange={({ target: { value } }) => this.queryChange('oriOrderNo', value)} />
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>退款状态：</span>
              <Select className={styles.select} value={query.refOrderSts} onChange={val => this.queryChange('refOrderSts', val)}>
                <Select.Option value=''>全部</Select.Option>
                {Object.keys(REFUND_STATUS).map(key => <Select.Option value={key} key={key}>{REFUND_STATUS[key]['name']}</Select.Option>)}
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
            </Spin>
          </div>
        }>
          <Row>
            <Col xs={0} md={0} lg={24}>
              <Table columns={columns} dataSource={(list || []).map((item, idx) => {
                const { orderDt, orderTm, orderAmt, refOrderSts, orderNo, oriOrderNo } = item
                const status = REFUND_STATUS[refOrderSts]
                return {
                  key: idx,
                  orderNo,
                  oriOrderNo,
                  orderTime: formatTime(orderDt, orderTm),
                  orderAmt: fMoney(orderAmt),
                  status: <span style={{ color: status.color }}>{status.icon ? <Icon type={status.icon} /> : null} {status.name}</span>
                }
              })} loading={loading} pagination={tablePagination} />
            </Col>
            <Col xs={24} md={24} lg={0}>
              <Table columns={[
                {
                  title: '退款订单号',
                  dataIndex: 'orderNo',
                  key: 'orderNo',
                  width: '30%',
                  render: (text) => {
                    return <span key='orderNo' style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>
                  }
                },
                {
                  title: '退款状态',
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
                const { oriOrderNo, refOrderSts, orderNo } = item
                const status = REFUND_STATUS[refOrderSts]
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
  const { loading, list, total, statistics, detail, detailModal } = state.refund
  return { loading, list, total, statistics, detail, detailModal, currentUser: state.user.info, }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(Refund)