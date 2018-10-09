import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Button, Divider, Table, Icon, Spin, Tabs } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'
import { Bar } from '../../../components/Charts'

import moment from 'moment'

import { ORDER_STATUS, TRAN_TYPE, BUS_TYPE } from '../../../common/constants'

import { formatTime, fMoney, sum } from '../../../utils/utils'

import Detail from '../../../components/Detail'
import ChartGrid from '../../../components/ChartGrid'

const { RangePicker } = DatePicker

class Volume extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: {
                beginDate: moment().subtract(10, 'days'),
                endDate: moment(),
                mercCd: props.currentUser.mercCd
            }
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.refresh()
    }

    componentWillUnmount() {
        this._isMounted = false
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

    refresh = () => {
        const { dispatch } = this.props
        if (!this._isMounted) return false
        dispatch({ type: 'volume/sales', payload: this.state.query })
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
        const { saslesLoading, saslesInfo } = this.props
        const { query } = this.state
        const tradeCunt = [], tradeAmt = [], AMT = [], CNT = [], TOTAL_AMT = [], TOTAL_CNT = []
        saslesInfo.map(item => {
            const { orderDt = '', succAmt = '', succCnt = '', totalCnt = '', totalAmt = '' } = item
            let t = formatTime(orderDt)
            tradeAmt.push({ x: t, y: succAmt })
            tradeCunt.push({ x: t, y: succCnt })
            AMT.push(succAmt)
            CNT.push(succCnt)
            TOTAL_AMT.push(totalAmt)
            TOTAL_CNT.push(totalCnt)
        })
        let maxCnt, minCnt, maxAmt, minAmt, sumAmt, sumCnt, totalCount, countPercent
        CNT && CNT.length ? maxCnt = Math.max.apply(null, CNT) : maxCnt = 0
        CNT && CNT.length ? minCnt = Math.min.apply(null, CNT) : minCnt = 0
        AMT && AMT.length ? maxAmt = Math.max.apply(null, AMT) : maxAmt = 0
        AMT && AMT.length ? minAmt = Math.min.apply(null, AMT) : minAmt = 0

        AMT ? sumAmt = sum(AMT) : sumAmt = 0
        CNT ? sumCnt = sum(CNT) : sumCnt = 0

        TOTAL_CNT ? totalCount = sum(TOTAL_CNT) : totalCount = 0

        totalCount != 0 ? countPercent = ((sumCnt / totalCount) * 100).toFixed(2) + '%' : countPercent = '0%'
        return (
            <PageHeaderLayout
                title="按交易量查询"
            >
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
                        <Button type="primary" icon="search" onClick={this.refresh} loading={saslesLoading}>查询</Button>
                    </Row>
                </Card>
                <Card bordered={false} title="查询结果" style={{ marginTop: '24px', minHeight: '420px' }}>
                    <Spin spinning={saslesLoading}>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
                                <Row type='flex' justify='space-around'>
                                    <Col xs={24} md={12} lg={3} style={{ textAlign: 'center', borderRight: '1px solid #cccccc', lineHeight: '32px', margin: '20px 0' }}>
                                        <span style={{ color: '#999999', display: 'block' }}>总金额（元）</span>
                                        <span>{fMoney(sumAmt)}</span>
                                    </Col>
                                    <Col xs={24} md={12} lg={3} style={{ textAlign: 'center', borderRight: '1px solid #cccccc', lineHeight: '32px', margin: '20px 0' }}>
                                        <span style={{ color: '#999999', display: 'block' }}>总笔数</span>
                                        <span>{totalCount}</span>
                                    </Col>
                                    <Col xs={24} md={12} lg={3} style={{ textAlign: 'center', borderRight: '1px solid #cccccc', lineHeight: '32px', margin: '20px 0' }}>
                                        <span style={{ color: '#999999', display: 'block' }}>单日最高金额（元）</span>
                                        <span>{fMoney(maxAmt)}</span>
                                    </Col>
                                    <Col xs={24} md={12} lg={3} style={{ textAlign: 'center', borderRight: '1px solid #cccccc', lineHeight: '32px', margin: '20px 0' }}>
                                        <span style={{ color: '#999999', display: 'block' }}>单日最低金额（元）</span>
                                        <span>{fMoney(minAmt)}</span>
                                    </Col>
                                    <Col xs={24} md={12} lg={3} style={{ textAlign: 'center', borderRight: '1px solid #cccccc', lineHeight: '32px', margin: '20px 0' }}>
                                        <span style={{ color: '#999999', display: 'block' }}>单日最高笔数</span>
                                        <span>{maxCnt}</span>
                                    </Col>
                                    <Col xs={24} md={12} lg={3} style={{ textAlign: 'center', borderRight: '1px solid #cccccc', lineHeight: '32px', margin: '20px 0' }}>
                                        <span style={{ color: '#999999', display: 'block' }}>单日最低笔数</span>
                                        <span>{minCnt}</span>
                                    </Col>
                                    <Col xs={24} md={12} lg={3} style={{ textAlign: 'center', lineHeight: '32px', margin: '20px 0' }}>
                                        <span style={{ color: '#999999', display: 'block' }}>平均成功率</span>
                                        <span>{countPercent}</span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} md={24} lg={24}>
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
                            </Col>
                        </Row>
                    </Spin>
                </Card>
            </PageHeaderLayout>
        )
    }
}

function mapStateToProps(state) {
    const { user, volume } = state
    const { info } = user
    const { saslesInfo, saslesLoading } = volume
    return {
        currentUser: info,
        saslesInfo,
        saslesLoading
    }
}

function mapDispatchToProps(dispatch) {
    return { dispatch }
}

export default connect(mapStateToProps)(Volume)