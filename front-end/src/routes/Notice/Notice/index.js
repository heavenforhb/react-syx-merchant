import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Button, Divider, Table, Icon, Spin, Modal } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import moment from 'moment'

import { formatTime } from '../../../utils/utils'


class Notice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: {
                page: 1,
                size: 15,
                platCd: 'MERC'
            },
            noticeDetail: null,
            showNoticeModal: false
        }

    }

    componentDidMount() {
        this._isMounted = true
        this.refresh()
    }

    componentWillMount() {
        this._isMounted = false
    }

    refresh = () => {
        const { dispatch, loading } = this.props
        if (!this._isMounted) return false
        dispatch({ type: 'notice/fetch', payload: this.state.query })
    }

    onRowClick = (item) => {
        this.setState({ noticeDetail: item, showNoticeModal: true })
    }


    render() {
        const { query, showNoticeModal, noticeDetail } = this.state
        const { total, list, statistics, loading } = this.props

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
                title="平台公告"
            >
                <Modal visible={showNoticeModal} title={null}
                    onCancel={() => this.setState({ showNoticeModal: false })} footer={null}
                    width={800}>
                    <div style={{ padding: '30px' }}>
                        <h2 style={{ textAlign: 'center', padding: 20 }}>{noticeDetail ? noticeDetail.title : '公告'}</h2>
                        <div dangerouslySetInnerHTML={{ __html: noticeDetail ? noticeDetail.content : '加载中...' }} />
                        {/* <p style={{ textAlign: 'right', padding: 20 }}>{noticeDetail ? (noticeDetail.uptDtTm ? formatTime(noticeDetail.uptDtTm) : formatTime(noticeDetail.rlsDt, noticeDetail.rlsTm)) : ''}</p> */}
                    </div>
                </Modal>
                <Card bordered={false}>
                    <Row>
                        <Col xs={24} md={24} lg={24}>
                            <Spin spinning={loading}>
                                <Table columns={[{
                                    title: '标题',
                                    dataIndex: '_title',
                                    key: '_title',
                                }]} pagination={tablePagination} showHeader={false} dataSource={list.map((item, idx) => {
                                    const { id, title, connect, uptDtTm, rlsDt, rlsTm } = item
                                    return Object.assign({}, item, {
                                        key: idx,
                                        id,
                                        _title: <a className={styles.linkWrap}>
                                            <span>[{uptDtTm ? formatTime(uptDtTm) : formatTime(rlsDt, rlsTm)}] {title}</span>
                                        </a>
                                    })
                                })} onRow={(record) => {
                                    return {
                                        onClick: () => { this.onRowClick(record) }
                                    }
                                }} />
                            </Spin>
                        </Col>
                    </Row>
                </Card>
            </PageHeaderLayout>
        )
    }
}

function mapStateToProps(state) {
    const { loading, list, total, statistics } = state.notice
    return { loading, list, total, statistics }
}

function mapDispatchToProps(dispatch) {
    return { dispatch }
}

export default connect(mapStateToProps)(Notice)