import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Button, Divider, Table, Icon, Spin, Menu, Dropdown, Popconfirm, Tooltip } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import moment from 'moment'

import { TRAN_TYPE, BUS_TYPE, CAP_TYPE, DC_FLG } from '../../../common/constants'

import { formatTime, fMoney } from '../../../utils/utils'

import Detail from '../../../components/Detail'

const { RangePicker } = DatePicker

class AccountDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: {
                page: 1,
                size: 10,
                beginDate: moment().subtract(10, 'days'),
                endDate: moment(),
                payOrder: '',
                tranType: '',
                busType: '',
                dcFlg: '',
                capType: '',
                mercCd: props.currentUser.mercCd
            },
        }

    }

    componentDidMount() {
        this.refresh()
    }

    refresh = () => {
        const { dispatch } = this.props
        dispatch({ type: 'accountDetail/accountPage', payload: this.state.query })
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
        const { dispatch, currentUser } = this.props
        dispatch({ type: 'order/detail', payload: { orderNo, mercCd: currentUser.mercCd } })
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

        const { query } = this.state
        const { total, list, statistics, accountPageLoading, dispatch } = this.props

        const filterBusType = BUS_TYPE[query.tranType] || {}

        return (
            <PageHeaderLayout
                title="账户收支明细"
            >
                <Card bordered={false} title="查询条件">
                    <Row gutter={24}>
                        <Col {...colProps} className={styles.col}>
                            <span className={styles.inputLabel}>支付订单号：</span>
                            <Input className={styles.inputBox} placeholder="请输入支付订单号"
                                onChange={({ target: { value } }) => this.queryChange('payOrder', value)} />
                        </Col>
                        <Col {...colProps} className={`${styles.col} xs-hide`}>
                            <span className={styles.inputLabel}>交易类型：</span>
                            <Select className={styles.select} value={query.tranType} onChange={val => this.queryChange('tranType', val)}>
                                <Select.Option value=''>全部</Select.Option>
                                {Object.keys(TRAN_TYPE).map(key => <Select.Option value={key} key={key}>{TRAN_TYPE[key]}</Select.Option>)}
                            </Select>
                        </Col>
                        <Col {...colProps} className={`${styles.col} xs-hide`}>
                            <span className={styles.inputLabel}>业务类型：</span>
                            <Select className={styles.select} value={query.busType} onChange={val => this.queryChange('busType', val)}>
                                <Select.Option value=''>全部</Select.Option>
                                {Object.keys(filterBusType).map(key => <Select.Option value={key} key={key}>{filterBusType[key]}</Select.Option>)}
                            </Select>
                        </Col>
                        <Col {...colProps} className={`${styles.col} xs-hide`}>
                            <span className={styles.inputLabel}>账户类型：</span>
                            <Select className={styles.select} value={query.capType} onChange={val => this.queryChange('capType', val)}>
                                <Select.Option value=''>全部</Select.Option>
                                {Object.keys(CAP_TYPE).map(key => <Select.Option value={key} key={key}>{CAP_TYPE[key]}</Select.Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col {...colProps} className={`${styles.col} xs-hide`}>
                            <span className={styles.inputLabel}>收支标识：</span>
                            <Select className={styles.select} value={query.dcFlg} onChange={val => this.queryChange('dcFlg', val)}>
                                <Select.Option value=''>全部</Select.Option>
                                {Object.keys(DC_FLG).map(key => <Select.Option value={key} key={key}>{DC_FLG[key]}</Select.Option>)}
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
                        <Button type="primary" icon="search" onClick={this.refresh} loading={accountPageLoading}>查询</Button>
                        <a target='_blank' className={'xs-hide'} style={{ marginLeft: 20 }} >
                            <Button type="default" icon="download">下载结果</Button>
                        </a>
                    </Row>
                </Card>
                <Card bordered={false} title="查询结果" style={{ marginTop: '24px', minHeight: '420px' }} extra={
                    <div style={{ color: '#999' }}>
                        <Spin spinning={accountPageLoading}>
                            查询结果共： <span>{total || 0} 条</span>
                            <Divider type='vertical' />
                            入账金额： <span>{fMoney(statistics.totalInAmt) || 0} 元</span>
                            <Divider type='vertical' />
                            出账金额： <span>{fMoney(statistics.totalOutAmt) || 0} 元</span>
                            <Divider type='vertical' />
                            入账笔数： <span>{statistics.totalInCnt || 0} 笔</span>
                            <Divider type='vertical' />
                            出账笔数： <span>{statistics.totalInCnt || 0} 笔</span>
                        </Spin>
                    </div>
                }>
                    <Row>
                        <Col xs={0} md={0} lg={24}>
                            <Table loading={accountPageLoading} columns={[{
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
                            }]} dataSource={list.map((item, idx) => {
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
                                defaultPageSize: 10,
                                total,
                                onChange: pageNumber => { this.setState({ query: Object.assign({}, query, { page: pageNumber }) }, this.refresh) }
                            }} />
                        </Col>
                        <Col xs={24} md={24} lg={0}>
                            <Table loading={accountPageLoading} columns={[{
                                title: '支付订单号',
                                dataIndex: 'payOrder',
                                key: 'payOrder'
                            }, {
                                title: '交易金额',
                                dataIndex: 'tranAmt',
                                key: 'cashOut',
                            }, {
                                title: '记账时间',
                                dataIndex: 'tranTm',
                                key: 'tranTm'
                            }]} dataSource={list.map((item, idx) => {
                                const { payOrder, tranType, dcFlg, preAcBal, aftAcBal, feeAmt, tranAmt, tranDt, tranTm, acAmt } = item
                                return Object.assign({}, item, {
                                    key: idx,
                                    payOrder: payOrder,
                                    tranType: TRAN_TYPE[tranType],
                                    acAmt: (dcFlg == 'IN' ? '+' : '-') + fMoney(acAmt),
                                    preAcBal: fMoney(preAcBal),
                                    aftAcBal: fMoney(aftAcBal),
                                    tranAmt: fMoney(tranAmt),
                                    feeAmt: fMoney(feeAmt),
                                    tranTm: formatTime(tranDt, tranTm)
                                })
                            })} pagination={{
                                defaultPageSize: 10,
                                total,
                                onChange: pageNumber => { this.setState({ query: Object.assign({}, query, { page: pageNumber }) }, this.refresh) }
                            }} />
                        </Col>
                    </Row>
                </Card>
            </PageHeaderLayout>
        )
    }
}

function mapStateToProps(state) {
    const { accountPageLoading, accountPageInfo } = state.accountDetail
    const { list, total, statistics, } = accountPageInfo
    return { currentUser: state.user.info, list, total, statistics, accountPageLoading }
}

function mapDispatchToProps(dispatch) {
    return { dispatch }
}

export default connect(mapStateToProps)(AccountDetail)