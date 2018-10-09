import React, { Component } from 'react'
import { Row, Col, Icon, Card, Tabs, Table, Tooltip, Divider, Spin, Modal } from 'antd'
import moment from 'moment'
import { connect } from 'dva'
import request from '../../../utils/request'
import { Link } from 'dva/router'

import NumberScroller from '../../../components/NumberScroller'
import { Bar } from '../../../components/Charts'

import { fMoney, formatTime } from '../../../utils/utils'
import { TRAN_TYPE, BUS_TYPE, AGENT_MERCHANT_TYPE, MERCHANT_STATUS } from '../../../common/constants'
import styles from './index.less'
import { setInterval } from 'timers'
import ChartGrid from '../../../components/ChartGrid'


class NumberCard extends Component {
  render() {
    const { title, number, iconDesc, linkTitle } = this.props
    return (
      <div className={styles.card}>
        <div className={styles.cardHead}>
          <span className={styles.cardHeadTitle}>{title}</span>
          {linkTitle ? <Divider type="vertical" /> : null}
          <Link to='/center/money/freeze'>{linkTitle}</Link>
          <span className={styles.cardHeadExtra}>
            <Tooltip title={iconDesc}>
              <Icon type='question-circle-o' />
            </Tooltip>
          </span>
        </div>
        <div className={styles.cardBody}>
          <span style={{ marginRight: '5px', fontSize: '16px' }}>¥</span>
          <NumberScroller number={number} size={25} />
        </div>
      </div>
    )
  }
}

class Analysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        page: 1,
        size: 5,
        capType: '000',
        beginDate: moment().subtract(10, 'days'),
        endDate: moment(),
        mercCd: props.currentUser.mercCd
      },
      showNoticeModal: false,
      noticeDetail: null
    }
  }
  componentDidMount() {
    this._isMounted = true
    this.queryNotice()
    this.queryAccountPage()
    this.querySalesData()
    this.queryAccountAmt()
  }
  componentWillUnmount() {
    this._isMounted = false

  }
  queryAccountPage = () => {
    const { dispatch } = this.props
    if (!this._isMounted || this.props.list.length) return false
    dispatch({ type: 'home/accountPage', payload: this.state.query })
  }
  queryAccountAmt = () => {
    const { dispatch, currentUser } = this.props
    if (!this._isMounted || this.props.stateAccountAmt.cashAcBal) return false
    dispatch({ type: 'home/accountAmt', payload: { mercCd: currentUser.mercCd } })
  }
  querySalesData = () => {
    const { dispatch, currentUser } = this.props
    const { mercCd, beginDate, endDate } = this.state.query
    if (!this._isMounted || this.props.saslesInfo.length) return false
    dispatch({ type: 'home/sales', payload: { mercCd, beginDate, endDate } })
  }
  queryNotice = () => {
    const { dispatch } = this.props
    if (!this._isMounted || this.props.noticeInfo.length) return false
    dispatch({ type: 'home/notice', payload: { page: 1, size: 7, platCd: 'MERC' } })
  }
  queryNoticeDetail = (item) => {
    this.setState({ showNoticeModal: true, noticeDetail: item })
  }
  render() {
    const { merchantInfo, list, total, statistics, accountPageLoading, accountAmtLoading,
      stateAccountAmt, baseAccountAmt, saslesInfo, saslesLoading, noticeInfo, noticeLoading } = this.props
    const { showNoticeModal, noticeDetail, query } = this.state
    const topColResponsiveProps = {
      xs: 24,
      sm: 24,
      lg: 8,
      style: { marginBottom: 24 },
    }

    const secondColResponseiveProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 7,
      style: { marginBottom: 24 }
    }

    const tradeCunt = [], tradeAmt = []
    saslesInfo.map(item => {
      const { orderDt = '', succAmt = '', succCnt = '' } = item
      let t = formatTime(orderDt)
      tradeAmt.push({ x: t, y: succAmt })
      tradeCunt.push({ x: t, y: succCnt })
    })
    return (
      <div>
        <Modal visible={showNoticeModal} title={false}
          onCancel={() => this.setState({ showNoticeModal: false })} footer={null}
          width={800}>
          <div style={{ padding: '30px' }}>
            <h2 style={{ textAlign: 'center', padding: 20 }}>{noticeDetail ? noticeDetail.title : '公告'}</h2>
            <div style={{ padding: 20 }} dangerouslySetInnerHTML={{ __html: noticeDetail ? noticeDetail.content : '加载中...' }} />
          </div>
        </Modal>
        <Spin spinning={accountAmtLoading}>
          <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <NumberCard title="可用金额(元)" number={fMoney(baseAccountAmt.cashAcBal)} iconDesc='商户可提现支付金额' />
            </Col>
            <Col {...topColResponsiveProps}>
              <NumberCard title="冻结金额(元)" number={fMoney(baseAccountAmt.uncashAcBal)} iconDesc='冻结金额，不可用' linkTitle='查看详情' />
            </Col>
            <Col {...topColResponsiveProps}>
              <NumberCard title="待结金额(元)" number={fMoney(stateAccountAmt.cashAcBal)} iconDesc='周期待结算金额' />
            </Col>
          </Row>
        </Spin>
        <Row gutter={24}>
          <Col {...secondColResponseiveProps} xs={24}>
            <Card title={'商户信息'} bordered={false}>
              <Spin spinning={merchantInfo.merchantLoading}>
                <p>商户名称：{merchantInfo.mercName}</p>
                <p>商户编号：{merchantInfo.mercCd}</p>
                <p>经营范围：{merchantInfo.mccDesc}</p>
                <p>账户类型：{AGENT_MERCHANT_TYPE[merchantInfo.mercType]}</p>
                <p>账户状态：{MERCHANT_STATUS[merchantInfo.mercSts]}</p>
                <p>绑定手机：{merchantInfo.phoneNo}</p>
                <p>预留信息：{merchantInfo.reseInfo}</p>
              </Spin>
            </Card>
          </Col>
          <Col {...secondColResponseiveProps} lg={17}>
            <Spin spinning={saslesLoading}>
              <Tabs defaultActiveKey="1" className={styles.salesCard} size="large">
                <Tabs.TabPane tab="交易笔数（笔）" key="1">
                  <Row>
                    <Col>
                      <div className={styles.salesCardContent}>
                        {
                          tradeCunt && tradeCunt.length ? <Bar
                            height={295}
                            data={tradeCunt}
                          /> : <ChartGrid />
                        }

                      </div>
                    </Col>
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="交易金额（元）" key="2">
                  <Row>
                    <Col>
                      <div className={styles.salesCardContent}>
                        {
                          tradeAmt && tradeAmt.length ? <Bar
                            height={295}
                            data={tradeAmt}
                          /> : <ChartGrid />
                        }
                      </div>
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Spin>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col {...secondColResponseiveProps} lg={17} xs={0}>
            <Card title={<span>最近一周账户流水<span style={{ marginLeft: 20, fontSize: 14 }}><Link to='/center/money/accountDetail'>查看全部</Link></span> </span>} bordered={false} extra={
              <div style={{ color: '#999' }}>
                查询结果共： <span>{total || 0} 条</span>
                <Divider type='vertical' />
                入账金额： <span>{fMoney(statistics.totalInAmt) || 0} 元</span>
                <Divider type='vertical' />
                出账金额： <span>{fMoney(statistics.totalOutAmt) || 0} 元</span>
                <Divider type='vertical' />
                入账笔数： <span>{statistics.totalInCnt || 0} 笔</span>
                <Divider type='vertical' />
                出账笔数： <span>{statistics.totalInCnt || 0} 笔</span>
              </div>
            }>
              <Table loading={accountPageLoading} columns={[
                {
                  title: '支付订单号',
                  dataIndex: 'payOrder',
                  key: 'payOrder'
                }, {
                  title: '交易类型',
                  dataIndex: 'tranType',
                  key: 'tranType',
                }, {
                  title: '业务类型',
                  dataIndex: 'busType',
                  key: 'busType'
                }, {
                  title: '变动前余额',
                  dataIndex: 'preAcBal',
                  key: 'preAcBal',
                }, {
                  title: <span><Tooltip title='记账金额 = 交易金额 - 手续费'>记账金额<Icon type='question-circle-o' style={{ marginLeft: 5 }} /></Tooltip></span>,
                  dataIndex: 'acAmt',
                  key: 'cashIn',
                }, {
                  title: '交易金额',
                  dataIndex: 'tranAmt',
                  key: 'cashOut',
                }, {
                  title: '手续费',
                  dataIndex: 'feeAmt',
                  key: 'feeAmt',
                }, {
                  title: '变动后余额',
                  dataIndex: 'aftAcBal',
                  key: 'aftAcBal',
                }, {
                  title: '记账时间',
                  dataIndex: 'tranTm',
                  key: 'tranTm'
                }
              ]} dataSource={list.map((item, idx) => {
                const { payOrder, tranType, busType, dcFlg, preAcBal, aftAcBal, feeAmt, tranAmt, tranDt, tranTm, acAmt } = item
                return Object.assign({}, item, {
                  key: idx,
                  payOrder: payOrder,
                  tranType: TRAN_TYPE[tranType],
                  busType: BUS_TYPE[tranType][busType],
                  acAmt: (dcFlg == 'IN' ? '+' : '-') + fMoney(acAmt),
                  preAcBal: fMoney(preAcBal),
                  aftAcBal: fMoney(aftAcBal),
                  tranAmt: fMoney(tranAmt),
                  feeAmt: fMoney(feeAmt),
                  tranTm: formatTime(tranDt, tranTm)
                })
              })} pagination={{
                defaultPageSize: 5,
                total,
                onChange: pageNumber => { this.setState({ query: Object.assign({}, query, { page: pageNumber }) }, this.queryAccountPage) }
              }} />
            </Card>
          </Col>
          <Col {...secondColResponseiveProps} xs={24}>
            <Card title={'商银信公告'} bordered={false}>
              <Spin spinning={noticeLoading}>
                <ul className={styles.newsList}>
                  {
                    noticeInfo && noticeInfo.length ?
                      noticeInfo.map((item, idx) => {
                        const { content, title, id, uptDtTm, rlsDt, rlsTm } = item
                        return (
                          <li className={styles.newsItem} key={idx}>
                            <a onClick={() => this.queryNoticeDetail(item)}>[{uptDtTm ? formatTime(uptDtTm) : formatTime(rlsDt, rlsTm)}] {title}</a>
                          </li>
                        )
                      }) : <li>暂无公告</li>
                  }
                  <li className={styles.newsMore}>
                    <Link to='/notice'>更多>></Link>
                  </li>
                </ul>
              </Spin>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user, home } = state
  const { info, merchantInfo } = user
  const { accountPageLoading, accountPageInfo, accountAmtLoading, accountAmtInfo, saslesInfo, saslesLoading, noticeInfo, noticeLoading } = home
  const { list, total, statistics } = accountPageInfo
  const { stateAccountAmt, baseAccountAmt } = accountAmtInfo
  return {
    currentUser: info,
    merchantInfo: merchantInfo,
    list,
    total,
    statistics,
    accountPageLoading,
    accountAmtLoading,
    stateAccountAmt,
    baseAccountAmt,
    saslesInfo,
    saslesLoading,
    noticeInfo,
    noticeLoading
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(Analysis)