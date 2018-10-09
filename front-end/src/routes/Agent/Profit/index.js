import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Button, Divider, Table, Icon, Spin, Menu, Dropdown, Popconfirm, Modal } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import moment from 'moment'

import { TRAN_TYPE, BUS_TYPE } from '../../../common/constants'

import { formatTime, fMoney } from '../../../utils/utils'

import Detail from '../../../components/Detail'
import DownloadComponent from '../../../components/Download'

const { RangePicker } = DatePicker

class Profit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        page: 1,
        size: 10,
        tranType: '',
        busType: '',
        orderDt: '',
        beginDate: moment().subtract(10, 'days'),
        endDate: moment(),
        agentCd: props.currentUser.mercCd
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
    dispatch({ type: 'profit/fetch', payload: this.state.query })
  }

  queryDetail = (orderNo) => {
    const { dispatch, loading, currentUser } = this.props
    if (loading) return false
    dispatch({ type: 'profit/detail', payload: { orderNo, agentCd: currentUser.mercCd } })
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
      title: '商户编号',
      dataIndex: 'mercCd',
      key: 'mercCd'
    }, {
      title: '商户订单号',
      dataIndex: 'outOrderNo',
      key: 'outOrderNo',
    }, {
      title: '交易类型',
      dataIndex: 'tranType',
      key: 'tranType',
    }, {
      title: '业务类型',
      dataIndex: 'busType',
      key: 'busType',
    }, {
      title: '订单金额',
      dataIndex: 'orderAmt',
      key: 'orderAmt'
    }, {
      title: '分润金额',
      dataIndex: 'profitAmt',
      key: 'profitAmt'
    }, {
      title: '订单日期',
      dataIndex: 'orderTime',
      key: 'orderTime'
    }, {
      title: '分润日期',
      dataIndex: 'tranTime',
      key: 'tranTime'
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <a onClick={() => this.queryDetail(record.orderNo)}>详情 </a>
        )
      }
    }]

    const { query, downloadModal } = this.state
    const { total, list, loading, dispatch, statistics, detailModal, detail } = this.props
    let { agentName, agentCd, mercCd, outOrderNo, tranType, busType, profitAmt, orderAmt, 
      orderNo, recFeeAmt, refFeeAmt, tranDt, tranTm, orderDt, orderTm } = detail
    let showDetail = [{
      key: '代理商名称',
      val: agentName ? agentName : '-'
    }, {
      key: '代理商编号',
      val: agentCd ? agentCd : '-'
    }, {
      key: '商户编号',
      val: mercCd ? mercCd : '-'
    }, {
      key: '商户订单号',
      val: outOrderNo ? outOrderNo : '-'
    }, {
      key: '订单号',
      val: orderNo ? orderNo : '-'
    }, {
      key: '交易类型',
      val: tranType ? TRAN_TYPE[tranType] : '-'
    }, {
      key: '业务类型',
      val: busType ? BUS_TYPE[tranType][busType] : '-'
    }, {
      key: '订单金额',
      val: orderAmt ? fMoney(orderAmt) : '-'
    }, {
      key: '分润金额',
      val: profitAmt ? fMoney(profitAmt) : '-'
    }, {
      key: '商户手续费',
      val: recFeeAmt ? fMoney(recFeeAmt) : '-'
    }, {
      key: '成本手续费',
      val: refFeeAmt ? fMoney(refFeeAmt) : '-'
    }, {
      key: '订单日期',
      val: orderDt ? formatTime(orderDt, orderTm) : '-'
    }, {
      key: '分润日期',
      val: tranDt ? formatTime(tranDt, tranTm) : '-'
    }]

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
        title="分润明细查询"
      >
        <Modal visible={downloadModal} width={800} destroyOnClose={true} maskClosable={false} onCancel={() => this.setState({ downloadModal: false }) } title='订单详情' footer={null}>
          <DownloadComponent query={query} madeFileUrl={'/api/download/profit/madeFile'} downloadUrl={'/api/download/order/createUrl'} cancel={() => this.setState({ downloadModal: false })} />
        </Modal>
        <Modal visible={detailModal} width={800} destroyOnClose={true} maskClosable={false} onCancel={() => dispatch({ type: 'profit/detailModalFlag', payload: { show: false } })} title='订单详情' footer={
          <Button type='primary' size='large' onClick={() => dispatch({ type: 'profit/detailModalFlag', payload: { show: false } })}>关闭</Button>}>
          <Detail detail={showDetail} />
        </Modal>
        <Card bordered={false} title="查询条件">
          <Row gutter={24}>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>商户编号：</span>
              <Input className={styles.inputBox} placeholder="请输入商户编号"
                onChange={({ target: { value } }) => this.queryChange('mercCd', value)} />
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>订单日期：</span>
              <DatePicker className={styles.select} placeholder='请选择订单日期' onChange={val => this.queryChange('orderDt', val)}  />
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>交易类型：</span>
              <Select className={styles.select} value={query.tranType} onChange={val => this.queryChange('tranType', val)}>
                <Select.Option value=''>全部</Select.Option>
                {Object.keys(TRAN_TYPE).map(key => <Select.Option value={key} key={key}>{TRAN_TYPE[key]}</Select.Option>)}
              </Select>
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>业务类型：</span>
              <Select className={styles.select} value={query.busType} onChange={val => this.queryChange('busType', val)}>
                <Select.Option value=''>全部</Select.Option>
                {Object.keys(filterBusType).map(key => <Select.Option value={key} key={key}>{filterBusType[key]}</Select.Option>)}
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
            分润总金额： <span>{statistics.totalFeeAmt || 0} 元</span>
          </Spin>
        </div>
        } >
          <Row>
            <Col xs={0} md={0} lg={24}>
              <Table columns={columns} dataSource={(list || []).map((item, idx) => {
                const { orderDt, orderTm, tranDt, tranTm, busType, orderAmt, tranType, profitAmt } = item
                return Object.assign({}, item, {
                  key: idx,
                  orderTime: formatTime(orderDt, orderTm),
                  tranTime: formatTime(tranDt, tranTm),
                  tranType: TRAN_TYPE[tranType],
                  busType: BUS_TYPE[tranType][busType],
                  orderAmt: fMoney(orderAmt),
                  profitAmt: fMoney(profitAmt)
                }
              )})} loading={loading} pagination={tablePagination} />
            </Col>
            <Col xs={24} md={24} lg={0}>
              <Table columns={[
                {
                  title: '商户编号',
                  dataIndex: 'mercCd',
                  key: 'mercCd'
                },
                {
                  title: '商户订单号',
                  dataIndex: 'outOrderNo',
                  key: 'outOrderNo',
                  width: '30%',
                  render: (text) => {
                    return <span key='orderNo' style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>
                  }
                },
                {
                  title: '分润金额',
                  dataIndex: 'orderAmt',
                  key: 'orderAmt'
                }
              ]} dataSource={(list || []).map((item, idx) => {
                const { mercCd, outOrderNo, orderAmt } = item
                return {
                  key: idx,
                  orderAmt: fMoney(orderAmt),
                  outOrderNo: outOrderNo,
                  mercCd: mercCd
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
  const { loading, list, total, statistics, detailModal, detail } = state.profit
  return { loading, list, total, statistics, detailModal, detail, currentUser: state.user.info, }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(Profit)