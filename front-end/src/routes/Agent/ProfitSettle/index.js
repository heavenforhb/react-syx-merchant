import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Button, Divider, Table, Icon, Spin, Menu, Dropdown, Popconfirm, Modal, notification } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import { Link, routerRedux } from 'dva/router'

import moment from 'moment'

import { PROFIT_STATUS } from '../../../common/constants'

import { formatTime, fMoney } from '../../../utils/utils'

import request from '../../../utils/request'

import ApplySettlement from '../../../components/ApplySettlement'

const { RangePicker } = DatePicker

class ProfitSettle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        queryDate: moment(new Date()),
        agentCd: props.currentUser.mercCd
      },
      filteredInfo: {},
      applyFetching: false,
      applyInfo: {},
      cancelFetching: false
    }
  }

  componentDidMount() {
    this.refresh()
  }

  fetch = (e) => {
    this.setState({ query: Object.assign({}, this.state.query, { queryDate: e }) }, this.refresh)
  }

  GetLastDay = (year, month) => {
    var date = new Date(year, month, 1),
      lastDay = new Date(date.getTime() - 864e5).getDate()
    return lastDay
  }

  rangeDate = (queryDate) => {
    if(!queryDate) return false
    let d = queryDate.format('YYYY-MM')
    let y = d.substr(0, 4), m = d.substr(5, 2)
    let len = this.GetLastDay(y, m)
    let beginDate = d + '-' + '01'
    let endDate = d + '-' + len
    return { beginDate, endDate }
  }

  refresh = () => {
    const { dispatch, loading } = this.props
    if (loading) return false
    const { beginDate, endDate } = this.rangeDate(this.state.query.queryDate)
    dispatch({ type: 'profitSettle/fetch', payload: Object.assign({}, this.state.query, { beginDate, endDate }) })
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

  apply = () => {
    const { beginDate, endDate } = this.rangeDate(this.state.query.queryDate)
    const { mercCd } = this.props.currentUser
    const { mercName } = this.props
    this.props.dispatch({
      type: 'profitSettle/openApply',
      payload: { agentCd: mercCd, agentName: mercName, beginDate, endDate }
    })
  }

  linkToApply = () => {
    this.props.dispatch(routerRedux.replace('/agent/profit/profitApply'))
  }

  cancelApply = () => {
    const { mercCd } = this.props.currentUser
    this.setState({ cancelFetching: true })
    request('/api/profitApply/cancelApply', { method: 'POST', data: { applyUuid: this.props.uuid, agentCd: mercCd } }).then(data => {
      notification.success({ message: '取消申请成功' })
      this.setState({ cancelFetching: false })
      this.props.dispatch({ type: 'profitSettle/visible', payload: { show: false } })
      this.refresh()
    }).catch(error => {
      if (error.number == '401') {
        notification.error({ message: error.message })
        this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
      } else {
        notification.error({ message: '取消申请失败，请稍后重试' })
        this.setState({ cancelFetching: false })
      }
    })
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
    const { query, filteredInfo, cancelFetching } = this.state


    const columns = [{
      title: '交易日期',
      dataIndex: 'ORDER_DT',
      key: 'ORDER_DT',
    }, {
      title: '交易总金额（元）',
      dataIndex: 'TRAN_AMT',
      key: 'TRAN_AMT',
    }, {
      title: '交易总笔数',
      dataIndex: 'tranCnt',
      key: 'tranCnt',
    }, {
      title: '分润金额（元）',
      dataIndex: 'ORDER_AMT',
      key: 'ORDER_AMT'
    }, {
      title: '结算状态',
      dataIndex: 'PRO_ORDER_STS',
      key: 'PRO_ORDER_STS',
      filters: [
        { text: '未结算', value: '未结算' },
        { text: '已申请', value: '已申请' },
        { text: '已结算', value: '已结算' },
        { text: '审核拒绝', value: '审核拒绝' },
      ],
      filteredValue: filteredInfo.PRO_ORDER_STS || null,
      onFilter: (value, record) => record.PRO_ORDER_STS.includes(value)
    }]

    const { list, total, applyable, loading, dispatch, openApplyLoading, visible, step, dateList } = this.props

    const tablePagination = {
      pageSize: 10,
    }

    const { beginDate, endDate } = this.rangeDate(query.queryDate)
    return (
      <PageHeaderLayout
        title="分润结算管理"
      >
        <Modal title='结算申请' visible={visible} width={1000} footer={null} onCancel={() => dispatch({ type: 'profitSettle/visible', payload: { show: false } })} maskClosable={false} destroyOnClose={true}>
          {
            dateList ? <div style={{ padding: '50px 20px', textAlign: 'center' }}>
              <div>
                <span style={{ fontSize: '45px', color: '#108EE9', verticalAlign: 'middle' }}><Icon type="exclamation-circle" /></span>
                <span style={{ fontSize: '16px', lineHeight: '45px', marginLeft: '20px' }}>您还有未完成的申请，请去分润结算申请记录进行操作</span>
              </div>
              <div style={{ marginTop: '30px' }}>
                <span><Button type='primary' size='large' onClick={() => this.linkToApply()}>去完成</Button></span>
                <span style={{ marginLeft: '20px' }}><Button size='large' onClick={this.cancelApply} loading={cancelFetching}>取消申请</Button></span>
              </div>
            </div> : <ApplySettlement />
        }
          
        </Modal>
        {/* <Card bordered={false} title="查询条件">
        </Card> */}
        <Card bordered={false} title={<Button onClick={this.apply} loading={openApplyLoading}>申请结算</Button>} style={{ marginTop: '24px', minHeight: '650px' }} extra={
          <div style={{ color: '#999' }}>
            <Spin spinning={false}>
              总分润：<span>{total.total || 0} 条</span>
              <Divider type='vertical' />
              已结算分润：<span>{total.balanced || 0} 元</span> 
              <Divider type='vertical' />
              未结算分润：<span>{total.unBalanced || 0} 元</span>
              <Divider type='vertical' />
              分润日期：<DatePicker.MonthPicker value={query.queryDate} disabled={loading} onChange={e => this.fetch(e)} />
            </Spin>
          </div>
        }>
          <Row>
            <Col xs={0} md={0} lg={24}>
              <Table columns={columns} dataSource={(list || []).map((item, idx) => {
                const { orderDt, proOrderSts, tranAmt, orderAmt } = item
                return Object.assign({}, item, {
                  key: idx,
                  ORDER_DT: formatTime(orderDt),
                  TRAN_AMT: fMoney(tranAmt),
                  ORDER_AMT: fMoney(orderAmt),
                  PRO_ORDER_STS:  PROFIT_STATUS[proOrderSts].name
                }
              )})} loading={loading} pagination={tablePagination} onChange={(pagination, filters) => this.setState({ filteredInfo: filters })} />
            </Col>
            <Col xs={24} md={24} lg={0}>
              <Table columns={[
                {
                  title: '交易日期',
                  dataIndex: 'ORDER_DT',
                  key: 'ORDER_DT',
                  width: '30%',
                  render: (text) => {
                    return <span key='orderNo' style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>
                  }
                },
                {
                  title: '分润金额（元）',
                  dataIndex: 'ORDER_AMT',
                  key: 'ORDER_AMT'
                },
                {
                  title: '结算状态',
                  dataIndex: 'PRO_ORDER_STS',
                  key: 'PRO_ORDER_STS',
                  filters: [
                    { text: '未结算', value: '未结算' },
                    { text: '已申请', value: '已申请' },
                    { text: '已结算', value: '已结算' },
                    { text: '审核拒绝', value: '审核拒绝' },
                  ],
                  filteredValue: filteredInfo.PRO_ORDER_STS || null,
                  onFilter: (value, record) => record.PRO_ORDER_STS.includes(value)
                }
              ]} dataSource={(list || []).map((item, idx) => {
                const { orderDt, proOrderSts, tranAmt, orderAmt } = item
                return Object.assign({}, item, {
                  key: idx,
                  ORDER_DT: formatTime(orderDt),
                  ORDER_AMT: fMoney(orderAmt),
                  PRO_ORDER_STS:  PROFIT_STATUS[proOrderSts].name
                }
              )})} loading={loading} pagination={tablePagination} onChange={(pagination, filters) => this.setState({ filteredInfo: filters })} />
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    )
  }
}

function mapStateToProps(state) {
  const { loading, list, total, applyable, openApplyLoading, visible, dateList, step, uuid } = state.profitSettle
  return { loading, list, total, applyable, openApplyLoading, visible, dateList, step, uuid,
    currentUser: state.user.info, mercName: state.user.merchantInfo.mercName }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(ProfitSettle)