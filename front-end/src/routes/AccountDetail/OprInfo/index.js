import React, { Component } from 'react'
import { Card, Input, Row, Col, Button, Divider, Icon, Spin, Modal, Form, notification } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'
import { Link } from 'dva/router'

import request from '../../../utils/request'

import { WORK_SHEET_STATUS } from '../../../common/constants'

import { formatTime } from '../../../utils/utils'

import ImageContainer from '../../../components/ImageContainer'
import SendPhoneCode from '../../../components/SendPhoneCode'
import InputComponent from '../../../components/Input'
import PassGuard from '../../../components/PassGuard/'


class ModifyLinkMsgForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const { form, dispatch, mercCd, oprCd } = this.props
        form.validateFields((errors, values) => {
            if (!errors) {
                dispatch({ type: 'oprInfo/oprInfoNormalUpdate', payload: { ...values, mercCd, oprCd } })
            }
        })
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            }
        }
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            }
        }
        const { form, oprPhoneNo, mercCd, submiting, baseInfoModal, updateOprLoading } = this.props
        const { getFieldDecorator } = form
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item {...formItemLayout} label='联系人姓名'>
                    {getFieldDecorator('contactName', {
                        rules: [{
                            required: true, message: '请输入联系人姓名',
                        }],
                    })(
                        <Input placeholder='请输入联系人姓名' />
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='联系电话'>
                    {getFieldDecorator('phoneNo', {
                        rules: [{
                            required: true, message: '请输入联系电话'
                        }, {
                            pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '手机号格式错误',
                        }],
                    })(
                        <Input placeholder='请输入联系电话' maxLength='11' />
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='联系邮箱'>
                    {getFieldDecorator('email', {
                        rules: [{
                            required: true, message: '请输入联系邮箱'
                        }, {
                            type: 'email', message: '邮箱格式错误'
                        }],
                    })(
                        <Input placeholder='请输入联系邮箱' />
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='联系电话'>
                    <SendPhoneCode phoneNo={oprPhoneNo} smsType={11} mercCd={mercCd} />
                </Form.Item>
                <Form.Item {...formItemLayout} label='验证码'>
                    {getFieldDecorator('smsCode', {
                        rules: [{
                            required: true, message: '请输入验证码',
                        }],
                    })(
                        <Input placeholder='请输入验证码' />
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type='primary' htmlType='submit'
                        loading={updateOprLoading} disabled={updateOprLoading}>确认修改</Button>
                </Form.Item>
            </Form>
        )
    }
}

const WrapedModifyLinkMsgForm = Form.create()(ModifyLinkMsgForm)

class ModifyReseForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reseVal: '',
            submiting: false,
            initData: null
        }
    }

    componentDidMount() {
        request('/api/common/passGuardInit').then(data => {
            this.setState({ initData: data })
          }).catch(e => {
            console.error(e)
            notification.error({message: '密码控件初始化失败'})
          })
    }

    handleSubmit = () => {
        if(!this.state.reseVal) {
            return notification.error({ message: '预留信息不能为空' })
        }
        const { form, dispatch, mercCd } = this.props
        const { passwordOcx } = this.refs
        if (passwordOcx) {
          this.setState({ submiting: true })
          passwordOcx.getResult(result => {
            const { rsa, randKey } = result
            this.setState({ submiting: false })
            dispatch({ type: 'oprInfo/setReseInfolUpdate', payload: { mercCd, reseInfo: this.state.reseVal, loginPwd: rsa, randKey } })
          }, e => {
            this.setState({ submiting: false })
            notification.error({ message: e.toString() })
          })
        }  
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            }
        }
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 8,
                },
            }
        }
        const { reseInfo, setReseInfoLoading } = this.props
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item {...tailFormItemLayout} label=''>
                    <span>
                        <Icon type='info-circle' style={{ color: '#2196EA', fontSize: '16px' }} />
                        <span style={{ paddingLeft: '10px' }}>您正在修改预留信息，请输入以下信息后提交</span>
                    </span>
                </Form.Item>
                <Form.Item {...formItemLayout} label='目前预留信息'>
                    <span>{reseInfo ? reseInfo : ''}</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label='新的预留信息'>
                    <Input placeholder='请输入新的预留信息' value={this.state.reseVal} onChange={e => this.setState({ reseVal: e.target.value })} />
                </Form.Item>
                <Form.Item {...formItemLayout} label='登录密码'>
                    <InputComponent placeholder="请输入登录密码" ref="passwordOcx" maxLength={20}>
                        <PassGuard initData={this.state.initData} />
                    </InputComponent>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type='primary' htmlType='submit'
                        loading={setReseInfoLoading || this.state.submiting} disabled={setReseInfoLoading || this.state.submiting}>确认修改</Button>
                </Form.Item>
            </Form>
        )
    }
}

const WrapedModifyReseForm = Form.create()(ModifyReseForm)


class OprInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.props.dispatch({ type: 'oprInfo/baseModal', payload: { show: false } })
    }

    componentWillMount() {
        this._isMounted = false
    }

    toggleModal = (target, show) => {
        switch (target) {
            case 'baseInfo':
                this.props.dispatch({ type: 'oprInfo/baseModal', payload: { show } })
                break
            case 'reseInfo':
                this.props.dispatch({ type: 'oprInfo/reseModal', payload: { show } })
                break
            default:
                break
        }
    }

    render() {
        const colProps = {
            xs: 24,
            md: 24,
            lg: 12,
            style: {
                marginBottom: '30px'
            }
        }
        const { mercCd, oprCd, oprRoleCd, oprCreDt, oprCreTm, oprName, oprPhoneNo, oprEmail, reseInfo, baseInfoModal, reseInfoModal, updateOprLoading, setReseInfoLoading } = this.props
        const { baseInfo } = this.state
        return (
            <PageHeaderLayout
                title="个人信息"
            >
                <Modal
                    title='修改联系信息'
                    width={800}
                    visible={baseInfoModal}
                    onCancel={() => this.toggleModal('baseInfo', false)}
                    footer={null}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    {oprRoleCd != 'Admin' ? <WrapedModifyLinkMsgForm
                        oprPhoneNo={oprPhoneNo}
                        mercCd={mercCd}
                        oprCd={oprCd}
                        updateOprLoading={updateOprLoading}
                        dispatch={this.props.dispatch}
                        baseInfoModal={baseInfoModal}
                    /> : <div style={{ padding: '30px', textAlign: 'center' }}>
                            <div>
                                <span style={{ fontSize: '45px', color: '#108EE9', verticalAlign: 'middle' }}><Icon type="exclamation-circle" /></span>
                                <span style={{ fontSize: '16px', lineHeight: '45px', marginLeft: '20px' }}>超级管理员信息为敏感信息，请进入商户信息修改</span>
                            </div>
                            <div style={{ marginTop: '30px' }}>
                                <span><Button type='primary' size='large'><Link to='/account/merchantInfo'>商户信息</Link></Button></span>
                                <span style={{ marginLeft: '20px' }}><Button size='large' onClick={() => this.toggleModal('baseInfo', false)}>取消</Button></span>
                            </div>
                        </div>}
                </Modal>
                <Modal
                    title='修改预留信息'
                    width={800}
                    visible={reseInfoModal}
                    onCancel={() => this.toggleModal('reseInfo', false)}
                    footer={null}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <WrapedModifyReseForm reseInfo={reseInfo} mercCd={mercCd} setReseInfoLoading={setReseInfoLoading} dispatch={this.props.dispatch} />
                </Modal>
                <Card bordered={false} title="账号信息">
                    <div className={styles.itemContent}>
                        <Row gutter={16}>
                            <Col {...colProps}>
                                <Row>
                                    <Col span={6}>登录账号</Col>
                                    <Col span={18}><span>{oprCd}</span>
                                        <Link style={{ marginLeft: '30px', fontSize: '10px' }} to='/security/password'>修改密码</Link>
                                    </Col>
                                </Row>
                            </Col>
                            <Col {...colProps}>
                                <Row>
                                    <Col span={6}>登录角色</Col>
                                    <Col span={18}>{oprRoleCd == 'Admin' ? '管理员' : oprRoleCd}</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col {...colProps}>
                                <Row>
                                    <Col span={6}>创建时间</Col>
                                    <Col span={18}>{formatTime(oprCreDt, oprCreTm)}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Card>
                <Card bordered={false} title="基本信息" style={{ marginTop: '24px' }} extra={<a onClick={() => this.toggleModal('baseInfo', true)}>修改</a>}>
                    <div className={styles.itemContent}>
                        <Row gutter={16}>
                            <Col {...colProps}>
                                <Row>
                                    <Col span={6}>姓名</Col>
                                    <Col span={18}>{oprName}</Col>
                                </Row>
                            </Col>
                            <Col {...colProps}>
                                <Row>
                                    <Col span={6}>联系手机</Col>
                                    <Col span={18}>{oprPhoneNo}</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col {...colProps}>
                                <Row>
                                    <Col span={6}>联系邮箱</Col>
                                    <Col span={18}>{oprEmail}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Card>
                <Card bordered={false} title="安全信息" style={{ marginTop: '24px' }}>
                    <div className={styles.itemContent}>
                        <Row gutter={16}>
                            <Col span={4}><span>预留信息</span></Col>
                            <Col span={18}>
                                <p style={{ marginBottom: '20px' }}>{reseInfo ? reseInfo : ' 您还没有添加预留信息'}</p>
                                <p style={{ color: '#B49CA8', fontSize: '12px' }}>预留信息是由你自己设置的一段文字，用来鉴定网站身份，防止假冒网站造成损失。</p>
                                <p style={{ color: '#B49CA8', fontSize: '12px' }}>配置后将在首页及充值页面显示。若未看到预留信息，表明当前访问的网站存在风险，请终止操作并修改密码。</p>
                                <p style={{ color: '#B49CA8', fontSize: '12px' }}>未安装操作证书时预留信息将被部分掩码。</p>
                            </Col>
                            <Col span={2}><a style={{ fontSize: '10px' }} onClick={() => this.toggleModal('reseInfo', true)}>修改</a></Col>
                        </Row>
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}

function mapStateToProps(state) {
    const { oprCd, oprRoleCd, oprCreDt, oprCreTm, oprName, oprPhoneNo, oprEmail, mercCd } = state.user.info
    const { reseInfo } = state.user.merchantInfo
    const { baseInfoModal, reseInfoModal, updateOprLoading, setReseInfoLoading } = state.oprInfo
    return {
        oprCd, oprRoleCd, oprCreDt, oprCreTm, oprName, oprPhoneNo, oprEmail, mercCd, reseInfo,
        baseInfoModal, reseInfoModal, updateOprLoading, setReseInfoLoading
    }
}

function mapDispatchToProps(dispatch) {
    return { dispatch }
}

export default connect(mapStateToProps)(OprInfo)