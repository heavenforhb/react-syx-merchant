import React, { Component } from 'react'
import { Card, Input, Row, Col, Button, Divider, Icon, Spin, Modal, Form, notification } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import CopyToClipboard from 'react-copy-to-clipboard'

class KeyPlatform extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.props.dispatch({ type: 'keyPlatform/fetch', payload: {} })
    }

    componentWillMount() {
        this._isMounted = false
    }

    render() {
        const colProps = {
            xs: 24,
            md: 24,
            lg: 24,
            style: {
                marginBottom: '30px'
            }
        }
        const { RSA, fetching } = this.props
        const { baseInfo } = this.state
        return (
            <PageHeaderLayout
                title="平台公钥下载"
            >
                <Card bordered={false} title="平台公钥" style={{ minHeight: 600 }} >
                    <Spin spinning={fetching}>
                        <Row gutter={20} className={styles.row}>
                            <Col {...colProps}>
                                <div style={{
                                    width: 600,
                                    wordBreak: 'break-all',
                                    height: 180,
                                    margin: '0 auto',
                                    backgroundColor: '#f3f3ff',
                                    padding: 10,
                                    borderRadius: 5
                                }}>{RSA}</div>
                            </Col>
                        </Row>
                        <Row gutter={20} className={styles.row}>
                            <Col {...colProps}>
                                <div style={{ marginTop: 20, width: 600, margin: '0 auto' }}>
                                    <CopyToClipboard text={RSA ? RSA : ''} onCopy={() => notification.success({ message: '已复制到剪贴板'})}>
                                        <Button type='primary' size='large' disabled={RSA ? false : true}>点击复制到剪切板</Button>
                                    </CopyToClipboard>
                                </div>
                            </Col>
                        </Row>
                    </Spin>
                </Card>
            </PageHeaderLayout>
        )
    }
}

function mapStateToProps(state) {
    const { RSA, fetching } = state.keyPlatform
    return {
        RSA, fetching
    }
}

function mapDispatchToProps(dispatch) {
    return { dispatch }
}

export default connect(mapStateToProps)(KeyPlatform)