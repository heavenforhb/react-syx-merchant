import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Button, Divider, Table, Icon, Spin, Menu, Dropdown, Popconfirm, Modal, notification } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import moment from 'moment'

import { APPLY_AGENT_STS } from '../../../common/constants'

import { formatTime, fMoney } from '../../../utils/utils'

import ImageContainer from '../../../components/ImageContainer'
import ApplySettlement from '../../../components/ApplySettlement'
import request from '../../../utils/request'

const { RangePicker } = DatePicker

class ProfitApply extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        page: 1,
        size: 10,
        beginDate: moment().subtract(10, 'days'),
        endDate: moment(),
        reviewSts: '',
        showNotStart: 'true',
        agentCd: props.currentUser.mercCd
      },
      downloadModal: false,
      filteredInfo: {},
      detailModal: false, 
      detailMsg: {},
      applyAgainFetching: false,
      endApplyFetching: false
    }

  }

  componentDidMount() {
    this.refresh()
  }

  refresh = () => {
    const { dispatch, loading } = this.props
    if (loading) return false
    dispatch({ type: 'profitApply/fetch', payload: this.state.query })
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

  applyAgain = () => {
    const { uuid } = this.state.detailMsg
    const { mercCd } = this.props.currentUser
    this.setState({ applyAgainFetching: true }, () => {
      request('/api/profitApply/againApply', { method: 'POST', data: { applyUuid: uuid, agentCd: mercCd } }).then(data => {
        notification.success({ message: '申请成功' })
        this.setState({ applyAgainFetching: false, detailModal: false })
        this.refresh()
      }).catch(error => {
        if (error.number == '401') {
          notification.error({ message: error.message })
          this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
        } else {
          notification.error({ message: '申请失败，请稍后重试' })
          this.setState({ applyAgainFetching: false })
        }
      })
    })
  }

  cancelApply = (uuid) => {
    const { mercCd } = this.props.currentUser
    request('/api/profitApply/cancelApply', { method: 'POST', data: { applyUuid: uuid, agentCd: mercCd } }).then(data => {
      notification.success({ message: '取消申请成功' })
      this.refresh()
    }).catch(error => {
      if (error.number == '401') {
        notification.error({ message: error.message })
        this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
      } else {
        notification.error({ message: '取消申请失败，请稍后重试' })
      }
    })
  }

  apply = (profitDataBeginDt, profitDataEndDt) => {
    const { mercCd } = this.props.currentUser
    const { mercName } = this.props
    this.props.dispatch({
      type: 'profitSettle/openApply',
      payload: { agentCd: mercCd, agentName: mercName, beginDate: profitDataBeginDt, endDate: profitDataEndDt }
    })
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
    const { query, downloadModal, filteredInfo, detailModal, detailMsg, applyAgainFetching } = this.state


    const columns = [{
      title: '申请日期',
      dataIndex: 'orderDt',
      key: 'orderDt',
    }, {
      title: '交易总金额（元）',
      dataIndex: 'tranAmt',
      key: 'tranAmt',
    }, {
      title: '交易总笔数',
      dataIndex: 'tranCnt',
      key: 'tranCnt',
    }, {
      title: '分润金额（元）',
      dataIndex: 'orderAmt',
      key: 'orderAmt'
    }, {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status'
    }, {
      title: '操作',
      key: 'handle',
      render: (text, record) => {
        const { reviewSts, uuid, profitDataBeginDt, profitDataEndDt } = record
        return (
          <span>
            {reviewSts != 'UNSTART' ? <a onClick={() => this.setState({ detailModal: true, detailMsg: record })}>详情</a> : null}
            {reviewSts == 'UNSTART' ? <a onClick={() => this.apply(profitDataBeginDt, profitDataEndDt)}>提交申请</a> : null}
            {reviewSts == 'UNSTART' ? <Popconfirm title="确认取消吗？" okText="确认" cancelText="取消" onConfirm={() => this.cancelApply(uuid)}>
                <a style={{ marginLeft: 10 }}>取消申请</a>
              </Popconfirm> : null}
          </span>
        )
      }
    }]

    const { total, list, loading, dispatch, visible } = this.props

    const tablePagination = {
      total: total,
      current: query.page,
      pageSize: query.size,
      onChange: page => {
        this.setState({ query: Object.assign({}, query, { page }) }, this.refresh)
      }
    }

    let imgArr = detailMsg.imageAddress ? detailMsg.imageAddress.split(',') : []
    const imgContainer = (
      <Row gutter={16}>
        {
          imgArr.map((item, idx) => {
            return <Col span={3} key={idx}><ImageContainer url={item} key={idx} /></Col>
          })
        }
      </Row>
    )

    let _tranDt = detailMsg.profitDateList ? detailMsg.profitDateList.split(',').map(item => {
      return formatTime(item)
    }) : []

    return (
      <PageHeaderLayout
        title="分润结算申请记录"
      >
        <Modal visible={detailModal} title='结算申请详情' width={1000} footer={
          <span>
            {detailMsg.reviewSts == 'REFUSE' ? <Button type='primary' loading={applyAgainFetching} onClick={this.applyAgain}>重新申请</Button> : null}
            <Button type={detailMsg.reviewSts == 'REFUSE' ? 'normal' : 'primary'} style={{ marginLeft: 20 }} onClick={() => this.setState({ detailModal: false })}>关闭</Button></span>
        } onCancel={() => this.setState({ detailModal: false })} maskClosable={false}>
          <div style={{ padding: 20 }}>
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={6} style={{ textAlign: 'right' }}>交易日期：</Col>
              <Col span={14}>
                <Input.TextArea rows={3} disabled value={_tranDt.join(',')} />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={6} style={{ textAlign: 'right' }}>结算分润金额（元）：</Col>
              <Col span={14}>
                <Input disabled value={detailMsg.orderAmt} />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={6} style={{ textAlign: 'right' }}>发票信息：</Col>
              <Col span={14}>
                <div style={{ border: '1px solid #DFDFDF', borderRadius: '4px', backgroundColor: '#F7F7F7', padding: '10px' }}>
                  <p style={{ marginBottom: 8 }}>纳税登记号：9111010266751881X3</p>
                  <p style={{ marginBottom: 8 }}>企业名称：商银信支付服务有限责任公司</p>
                  <p style={{ marginBottom: 8 }}>营业地址：北京市西城区平安里西大街26号楼等3幢28号楼401-01室</p>
                  <p style={{ marginBottom: 8 }}>电话号码：83496600</p>
                  <p>银行账号：招商银行北京宣武门支行 861982256910001</p>
                </div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={6} style={{ textAlign: 'right' }}>发票编号：</Col>
              <Col span={14}>
                <Input.TextArea rows={3} disabled value={detailMsg.invoice} />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={6} style={{ textAlign: 'right' }}>发票图片：</Col>
              <Col span={14}>{imgContainer}</Col>
            </Row>
            {
              detailMsg.reviewSts == 'REFUSE' || detailMsg.reviewSts == 'TERMINATE' ?
                <Row gutter={16} style={{ marginBottom: 20 }}>
                  <Col span={6} style={{ textAlign: 'right' }}>拒绝原因：</Col>
                  <Col span={14}>
                    <Input disabled value={detailMsg.refuseReason} />
                  </Col>
                </Row> : null
            }

          </div>
        </Modal>
        <Modal title='结算申请' visible={visible} width={1000} footer={null} onCancel={() => dispatch({ type: 'profitSettle/visible', payload: { show: false } })} maskClosable={false} destroyOnClose={true}>
          <ApplySettlement />
        </Modal>
        <Card bordered={false} title="查询条件">
          <Row gutter={24}>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>审核状态：</span>
              <Select className={styles.select} value={query.reviewSts} onChange={val => this.queryChange('reviewSts', val)}>
                <Select.Option value=''>全部</Select.Option>
                {Object.keys(APPLY_AGENT_STS).map(key => <Select.Option value={key} key={key}>{APPLY_AGENT_STS[key]}</Select.Option>)}
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
          </Row>
        </Card>
        <Card bordered={false} title="查询结果" style={{ marginTop: '24px', minHeight: '420px' }}>
          <Row>
            <Col xs={0} md={0} lg={24}>
              <Table columns={columns} dataSource={(list || []).map((item, idx) => {
                const { orderAmt, orderDt, reviewSts, tranAmt } = item
                return Object.assign({}, item, {
                  key: idx,
                  tranAmt: fMoney(tranAmt),
                  orderAmt: fMoney(orderAmt),
                  orderDt: formatTime(orderDt),
                  status: APPLY_AGENT_STS[reviewSts]
                }
                )
              })} loading={loading} pagination={tablePagination} />
            </Col>
            <Col xs={24} md={24} lg={0}>
              <Table columns={[
                {
                  title: '申请日期',
                  dataIndex: 'orderDt',
                  key: 'orderDt',
                  width: '30%',
                  render: (text) => {
                    return <span key='orderNo' style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>
                  }
                },
                {
                  title: '结算状态',
                  dataIndex: 'status',
                  key: 'status'
                },
                {
                  title: '操作',
                  key: 'handle',
                  render: (text, record) => {
                    const { reviewSts, uuid, profitDataBeginDt, profitDataEndDt } = record
                    return (
                      <span>
                      {reviewSts != 'UNSTART' ? <a onClick={() => this.setState({ detailModal: true, detailMsg: record })}>详情</a> : null}
                      {reviewSts == 'UNSTART' ? <a onClick={() => this.apply(profitDataBeginDt, profitDataEndDt)}>提交申请</a> : null}
                      {reviewSts == 'UNSTART' ? <Popconfirm title="确认取消吗？" okText="确认" cancelText="取消" onConfirm={() => this.cancelApply(uuid)}>
                          <a style={{ marginLeft: 10 }}>取消申请</a>
                        </Popconfirm> : null}
                    </span>
                    )
                  }
                }
              ]} dataSource={(list || []).map((item, idx) => {
                const { orderDt, reviewSts } = item
                return {
                  key: idx,
                  orderDt: formatTime(orderDt),
                  status: APPLY_AGENT_STS[reviewSts]
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
  const { loading, list, total, dataStatistics } = state.profitApply
  const { visible } = state.profitSettle
  return { loading, list, total, visible, currentUser: state.user.info, mercName: state.user.merchantInfo.mercName }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(ProfitApply)