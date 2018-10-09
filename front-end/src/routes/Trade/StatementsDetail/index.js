import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Button, Divider, Table, Icon, Spin, Menu, Dropdown, Popconfirm, Modal } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import moment from 'moment'

import { STATEMENT_STATUS, TRAN_TYPE, BUS_TYPE, STLAC_TYPE } from '../../../common/constants'

import { formatTime, fMoney } from '../../../utils/utils'

import DownloadComponent from '../../../components/Download'

const { RangePicker } = DatePicker

class Order extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        page: 1,
        size: 10,
        beginDate: moment().subtract(10, 'days'),
        endDate: moment(),
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
    dispatch({ type: 'statement/fetch', payload: this.state.query })
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
      title: '结算订单号',
      dataIndex: 'orderNo',
      key: 'orderNo'
    }, {
      title: '结算日期',
      dataIndex: 'orderDt',
      key: 'orderDt'
    }, {
      title: '结算起始日期',
      dataIndex: 'startDt',
      key: 'startDt'
    }, {
      title: '结算结束日期 ',
      dataIndex: 'endDt',
      key: 'endDt',
    }, {
      title: '收入结算笔数',
      dataIndex: 'inCnt',
      key: 'inCnt',
    }, {
      title: '收入结算金额（元）',
      dataIndex: 'inAmt',
      key: 'inAmt',
    }, {
      title: '支出结算笔数',
      dataIndex: 'outCnt',
      key: 'outCnt',
    }, {
      title: '支出结算金额（元）',
      dataIndex: 'outAmt',
      key: 'outAmt'
    }, {
      title: '结算单金额（元）',
      dataIndex: 'orderAmt',
      key: 'orderAmt'
    }, {
      title: '结算账户类型',
      dataIndex: 'STLAC_TYPE',
      key: 'STLAC_TYPE'
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      fixed: 'right'
    }]

    const { query, downloadModal } = this.state
    const { total, list, loading, dispatch } = this.props

    const tablePagination = {
      total: total,
      current: query.page,
      pageSize: query.size,
      onChange: page => {
        this.setState({ query: Object.assign({}, query, { page }) }, this.refresh)
      }
    }

    return (
      <PageHeaderLayout
        title="结算明细"
      >
        <Modal visible={downloadModal} width={800} destroyOnClose={true} maskClosable={false} onCancel={() => this.setState({ downloadModal: false }) } title='订单详情' footer={null}>
          <DownloadComponent query={query} madeFileUrl={'/api/download/statement/madeFile'} downloadUrl={'/api/download/pss/createUrl'} cancel={() => this.setState({ downloadModal: false })} />
        </Modal>
        <Card bordered={false} title="查询条件">
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
        <Card bordered={false} title="查询结果" style={{ marginTop: '24px', minHeight: '420px' }} >
          <Row>
            <Col xs={0} md={0} lg={24}>
              <Table columns={columns} dataSource={(list || []).map((item, idx) => {
                const { inAmt, startDt, endDt, outAmt, inCnt, outCnt, orderDt, orderAmt, pssOrderSts, stlAcType } = item
                const status = STATEMENT_STATUS[pssOrderSts]
                return Object.assign({}, item, {
                  key: idx,
                  inAmt: fMoney(inAmt),
                  outAmt: fMoney(outAmt),
                  orderAmt: fMoney(orderAmt),
                  startDt: formatTime(startDt),
                  endDt: formatTime(endDt),
                  orderDt: formatTime(orderDt),
                  STLAC_TYPE: STLAC_TYPE[stlAcType],
                  status: <span style={{ color: status.color }}>{status.icon ? <Icon type={status.icon} /> : null} {status.name}</span>
                }
              )})} loading={loading} pagination={tablePagination} scroll={{ x: 1690 }} />
            </Col>
            <Col xs={24} md={24} lg={0}>
              <Table columns={[
                {
                  title: '结算订单号',
                  dataIndex: 'orderNo',
                  key: 'orderNo',
                  width: '30%',
                  render: (text) => {
                    return <span key='orderNo' style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>
                  }
                },
                {
                  title: '结算单金额（元）',
                  dataIndex: 'orderAmt',
                  key: 'orderAmt'
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status'
                }
              ]} dataSource={(list || []).map((item, idx) => {
                const { orderAmt, pssOrderSts, orderNo } = item
                const status = STATEMENT_STATUS[pssOrderSts]
                return {
                  key: idx,
                  orderAmt: fMoney(orderAmt),
                  orderNo: orderNo,
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
  const { loading, list, total } = state.statement
  return { loading, list, total, currentUser: state.user.info, }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(Order)