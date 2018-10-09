import React, { Component } from 'react'
import { Card, Input, Row, Col, Button, Divider, Icon, Spin, Modal, Form, notification, Table, Select } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'
import { Link } from 'dva/router'

import { AGENT_MERCHANT_TYPE, TRAN_TYPE, BUS_TYPE, FEE_TYPE, CAP_FLG, PP_FLG } from '../../../common/constants'

import { formatTime, fMoney } from '../../../utils/utils'

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
                dispatch({ type: 'merchantInfo/mercInfoUpdate', payload: { ...values, mercCd, oprCd } })
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
        const { form, phoneNo, mercCd, submiting, mercInfoUpdating, contactInfoModal } = this.props
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
                    <SendPhoneCode phoneNo={phoneNo} smsType={11} mercCd={mercCd} />
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
                        loading={mercInfoUpdating} disabled={mercInfoUpdating}>确认修改</Button>
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
        }
    }
    componentDidMount() {
        this._isMounted = true
        this.props.dispatch({ type: 'common/bank', payload: null })
        this.props.dispatch({ type: 'common/province', payload: { acdType: '00' } })
    }
    componentWillMount() {
        this._isMounted = false
    }
    queryCityList = (pacdCd) => {
        this.props.form.setFieldsValue({ 'cityCd': '' })
        this.props.dispatch({ type: 'common/city', payload: {  acdType: '01', pacdCd  } })
    }
    queryLbank = () => {
        let bankCd = this.props.form.getFieldValue('bankCd')
        let cityCd = this.props.form.getFieldValue('cityCd')
        this.props.dispatch({ type: 'common/lbank', payload: { bankCd, cityCd  } })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const { form, dispatch, mercCd, oprCd, cityList, bankList, lbankList, provinceList } = this.props
        form.validateFields((errors, values) => {
            if (!errors) {
                const { bankCd, lbankCd, cityCd, provCd } = values
                let cityName, bankName, lbankName, provName
                cityList.map(item => { if(item.acdCd == cityCd)  {cityName = item.acdDesc} })
                bankList.map(item => { if(item.bankCd == bankCd)  {bankName = item.bankName} })
                lbankList.map(item => { if(item.lbankCd == lbankCd)  {lbankName = item.lbankName} })
                provinceList.map(item => { if(item.acdCd == provCd)  {provName = item.acdDesc} })
                let query = Object.assign({}, values, { mercCd, oprCd, cityName, bankName, lbankName, provName })
                this.props.dispatch({ type: 'merchantInfo/mercStateInfoUpdate', payload: query }) 
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
        const { stateInfo, form, stateInfoUpdating, stateInfoModal, mercCd, phoneNo, cityList, bankList, lbankList, provinceList } = this.props
        const { ppFlg, acctName } = stateInfo
        const { getFieldDecorator } = form
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item {...formItemLayout} label='账户类型'>
                    <span>{PP_FLG[ppFlg]}</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label='开户名称'>
                    <div>
                        <p>{acctName}</p>
                    </div>
                </Form.Item>
                <Form.Item {...formItemLayout} label='开户银行'>
                    {getFieldDecorator('bankCd', {
                        rules: [{
                            required: true, message: '请输入开户银行',
                        }],
                    })(
                        <Select placeholder='请选择开户银行'>
                            <Select.Option value=''>请选择开户银行</Select.Option>
                            {bankList.map((item, idx) => {
                                return <Select.Option key={idx} value={item.bankCd}>{item.bankName}</Select.Option>
                            })}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label='开户行省市'
                >
                    <Row>
                        <Col span={11}>
                            {getFieldDecorator('provCd', {
                                rules: [{ required: true, message: '请选择开户行省份' }],
                            })(
                                <Select placeholder='请选择开户行省份' onChange={e => this.queryCityList(e)}>
                                    <Select.Option value=''>请选择开户行省份</Select.Option>
                                    {provinceList.map((item, idx) => {
                                        return <Select.Option key={idx} value={item.acdCd}>{item.acdDesc}</Select.Option>
                                    })}
                                </Select>
                            )}
                        </Col>
                        <Col span={11} offset={2}>
                            {getFieldDecorator('cityCd', {
                                rules: [{ required: true, message: '请选择开户行城市' }],
                            })(
                                <Select placeholder='请选择开户行城市'>
                                    <Select.Option value=''>请选择开户行城市</Select.Option>
                                    {cityList.map((item, idx) => {
                                        return <Select.Option key={idx} value={item.acdCd}>{item.acdDesc}</Select.Option>
                                    })}
                                </Select>
                            )}
                        </Col>
                    </Row>
                </Form.Item>
                {
                    this.props.form.getFieldValue('bankCd') && this.props.form.getFieldValue('cityCd') ? <Form.Item {...formItemLayout} label='开户支行'>
                        {getFieldDecorator('lbankCd', {
                            rules: [{ required: true, message: '请选择开户支行', }],
                        })(
                            <Select
                                onFocus={() => this.queryLbank()}
                                placeholder='请选择开户支行'
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Select.Option value=''>请选择开户支行</Select.Option>
                                {lbankList.map((item, idx) => {
                                    return <Select.Option key={idx} value={item.lbankCd}>{item.lbankName}</Select.Option>
                                })}
                            </Select>
                        )}
                    </Form.Item> : null
                }
                <Form.Item {...formItemLayout} label='银行账户'>
                    {getFieldDecorator('cardNo', {
                        rules: [{ required: true, message: '请输入银行账户', }],
                    })(
                        <Input placeholder='请输入银行账户' />
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='联系电话'>
                    <SendPhoneCode phoneNo={phoneNo} smsType={11} mercCd={mercCd} />
                </Form.Item>
                <Form.Item {...formItemLayout} label='验证码'>
                    {getFieldDecorator('smsCode', {
                        rules: [{ required: true, message: '请输入短信验证码', }],
                    })(
                        <Input placeholder='请输入验证码' />
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type='primary' htmlType='submit'
                        loading={stateInfoUpdating} disabled={stateInfoUpdating}>确认修改</Button>
                </Form.Item>
            </Form>
        )
    }
}

const WrapedModifyReseForm = Form.create()(ModifyReseForm)


class MerchantInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: {
                page: 1,
                size: 5,
                mercCd: props.mercCd
            }
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.props.dispatch({ type: 'merchantInfo/queryMercBusiInfo', payload: { mercCd: this.props.mercCd } })
        this.props.dispatch({ type: 'merchantInfo/queryMerStateInfo', payload: { mercCd: this.props.mercCd } })
        this.queryFeePage()
    }

    componentWillMount() {
        this._isMounted = false
    }

    queryFeePage = () => {
        if (!this._isMounted) return false
        this.props.dispatch({ type: 'merchantInfo/mercFeePage', payload: this.state.query })
    }

    toggleModal = (target, show) => {
        switch (target) {
            case 'contactInfo':
                this.props.dispatch({ type: 'merchantInfo/contactInfoModal', payload: { show } })
                break
            case 'stateInfo':
                this.props.dispatch({ type: 'merchantInfo/stateInfoModal', payload: { show } })
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
        const tableColumns = [
            {
                title: '交易类型',
                dataIndex: 'tranType',
                key: 'tranType'
            }, {
                title: '业务类型',
                dataIndex: 'busType',
                key: 'busType'
            }, {
                title: '费率类型',
                dataIndex: 'feeType',
                key: 'feeType'
            }, {
                title: '费率(%)',
                dataIndex: 'feeRate',
                key: 'feeRate'
            }, {
                title: '固定手续费(元)',
                dataIndex: 'fixAmt',
                key: 'fixAmt'
            }, {
                title: '是否封顶',
                dataIndex: 'capFlg',
                key: 'capFlg'
            }, {
                title: '封顶手续费(元)',
                dataIndex: 'capAmt',
                key: 'capAmt'
            }, {
                title: '单笔最低(元)',
                dataIndex: 'minAmt',
                key: 'minAmt'
            }, {
                title: '生效日期',
                dataIndex: 'effDt',
                key: 'effDt'
            }, {
                title: '失效日期',
                dataIndex: 'expDt',
                key: 'expDt'
            }
        ]
        const {
            contactName, eMail, mccDesc, mercAbbr, mercAddr, mercCd, mercName, mercRisk, mercType, mercUrl, phoneNo,
            feePageLoading, list, total, busiInfo, stateInfo, stateInfoLoading, busiInfoLoading, oprRoleCd,
            stateInfoModal, contactInfoModal, oprCd, mercInfoUpdating, stateInfoUpdating, bankList, lbankList, cityList, provinceList
        } = this.props
        const { query } = this.state
        const tablePagination = {
            total: total,
            current: query.page,
            pageSize: query.size,
            onChange: page => {
                this.setState({ query: Object.assign({}, query, { page }) }, this.queryFeePage)
            }
        }
        return (
            <PageHeaderLayout
                title="实名信息"
            >
                <Modal
                    title='修改联系信息'
                    width={800}
                    visible={contactInfoModal}
                    onCancel={() => this.toggleModal('contactInfo', false)}
                    footer={null}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <WrapedModifyLinkMsgForm
                        phoneNo={phoneNo}
                        mercCd={mercCd}
                        oprCd={oprCd}
                        dispatch={this.props.dispatch}
                        mercInfoUpdating={mercInfoUpdating}
                        contactInfoModal={contactInfoModal}
                    />
                </Modal>
                <Modal
                    title='修改结算信息'
                    width={800}
                    visible={stateInfoModal}
                    onCancel={() => this.toggleModal('stateInfo', false)}
                    footer={null}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <WrapedModifyReseForm
                        mercCd={mercCd}
                        oprCd={oprCd}
                        stateInfoUpdating={stateInfoUpdating}
                        phoneNo={phoneNo}
                        stateInfoModal={stateInfoModal}
                        stateInfo={stateInfo}
                        bankList={bankList}
                        lbankList={lbankList}
                        cityList={cityList}
                        provinceList={provinceList}
                        dispatch={this.props.dispatch}
                    />
                </Modal>
                <Card bordered={false} title="账户基本信息">
                    <div className={styles.itemContent}>
                        <Row gutter={16}>
                            <Col {...colProps}>
                                <Row><Col span={6}>商银信支付商户号</Col>
                                    <Col span={18}><span>{mercCd}</span></Col></Row>
                            </Col>
                            <Col {...colProps}>
                                <Row><Col span={6}>商户类型</Col>
                                    <Col span={18}>{AGENT_MERCHANT_TYPE[mercType]}</Col></Row>
                            </Col>
                        </Row>
                    </div>
                </Card>
                <Card bordered={false} title="联系信息" style={{ marginTop: '24px' }}
                    extra={oprRoleCd == 'Admin' ? <a onClick={() => this.toggleModal('contactInfo', true)}>修改</a> : null}
                >
                    <div className={styles.itemContent}>
                        <Row gutter={16}>
                            <Col {...colProps}>
                                <Row><Col span={6}>联系人姓名</Col>
                                    <Col span={18}>{contactName}</Col></Row>
                            </Col>
                            <Col {...colProps}>
                                <Row><Col span={6}>手机号码</Col>
                                    <Col span={18}>{phoneNo}</Col></Row>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col {...colProps}>
                                <Row><Col span={6}>联系邮箱</Col>
                                    <Col span={18}>{eMail}</Col></Row>
                            </Col>
                        </Row>
                    </div>
                </Card>
                <Card bordered={false} title="企业信息与营业信息" style={{ marginTop: '24px' }}>
                    <div className={styles.itemContent}>
                        <Spin spinning={busiInfoLoading}>
                            <div>
                                <span className={styles.lastTitle}>企业基本信息</span>
                                <Row gutter={16} className={styles.rowGapChild} style={{ marginTop: 20 }}>
                                    <Col span={5}><span>商户名称</span></Col>
                                    <Col span={16}><span className={styles.spanGap}>{mercName}</span></Col>
                                </Row>
                                <Row gutter={16} className={styles.rowGapChild}>
                                    <Col span={5}><span>注册地址</span></Col>
                                    <Col span={16}><span className={styles.spanGap}>{mercAddr}</span></Col>
                                </Row>
                            </div>
                            <div>
                                <span className={styles.lastTitle}>营业执照</span>
                                <Row gutter={16} className={styles.rowGapChild} style={{ marginTop: 20 }}>
                                    <Col span={5}><span>营业执照注册号</span></Col>
                                    <Col span={16}><span className={styles.spanGap}>{busiInfo.busiNo}</span></Col>
                                </Row>
                                <Row gutter={16} className={styles.rowGapChild}>
                                    <Col span={5}><span>营业范围</span></Col>
                                    <Col span={16}><span className={styles.spanGap}>{busiInfo.busiDesc}</span></Col>
                                </Row>
                                <Row gutter={16} className={styles.rowGapChild}>
                                    <Col span={5}><span>营业期限</span></Col>
                                    <Col span={16}><span className={styles.spanGap}>{formatTime(busiInfo.busiEffDt)}~{busiInfo.busiExpDt ? formatTime(busiInfo.busiExpDt) : '长期'}</span></Col>
                                </Row>
                                <Row gutter={16} className={styles.rowGapChild}>
                                    <Col span={5}><span>营业执照影印件</span></Col>
                                    <Col span={16}><span className={styles.spanGap}><ImageContainer url={busiInfo.busiUrl} /></span></Col>
                                </Row>
                            </div>
                            {
                                busiInfo.busiType == '01' ? null : <div>
                                    <span className={styles.lastTitle}>组织机构代码</span>
                                    <Row gutter={16} className={styles.rowGapChild} style={{ marginTop: 20 }}>
                                        <Col span={5}><span>组织机构代码</span></Col>
                                        <Col span={16}><span className={styles.spanGap}>{busiInfo.organNo}</span></Col>
                                    </Row>
                                    <Row gutter={16} className={styles.rowGapChild}>
                                        <Col span={5}><span>组织机构影印件</span></Col>
                                        <Col span={16}><span className={styles.spanGap}><ImageContainer url={busiInfo.organUrl} /></span></Col>
                                    </Row>
                                </div>
                            }
                            <div>
                                <span className={styles.lastTitle}>企业法人/经办人</span>
                                <Row gutter={16} className={styles.rowGapChild} style={{ marginTop: 20 }}>
                                    <Col span={5}><span>证件持有人类型</span></Col>
                                    <Col span={16}><span className={styles.spanGap}>{busiInfo.corpType == '00' ? '法人' : '经办人'}</span></Col>
                                </Row>
                                <Row gutter={16} className={styles.rowGapChild}>
                                    <Col span={5}><span>证件持有人姓名</span></Col>
                                    <Col span={16}><span className={styles.spanGap}>{busiInfo.idName}</span></Col>
                                </Row>
                                <Row gutter={16} className={styles.rowGapChild}>
                                    <Col span={5}><span>证件类型</span></Col>
                                    <Col span={16}><span className={styles.spanGap}>{busiInfo.idType == '00' ? '身份证' : ''}</span></Col>
                                </Row>
                                <Row gutter={16} className={styles.rowGapChild}>
                                    <Col span={5}><span>证件号码</span></Col>
                                    <Col span={16}><span className={styles.spanGap}>{busiInfo.idNo}</span></Col>
                                </Row>
                                <Row gutter={16} className={styles.rowGapChild}>
                                    <Col span={5}><span>证件有效期</span></Col>
                                    <Col span={16}><span className={styles.spanGap}>{formatTime(busiInfo.idEffDt)}~{busiInfo.idExpDt ? formatTime(busiInfo.idExpDt) : '长期'}</span></Col>
                                </Row>
                                <Row gutter={16} className={styles.rowGapChild}>
                                    <Col span={5}><span>证件影印件</span></Col>
                                    <Col span={16}>
                                        <span className={styles.spanGap}><ImageContainer url={busiInfo.idFontUrl} /></span>
                                        <span className={styles.spanGap}><ImageContainer url={busiInfo.idBackUrl} /></span>
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <span className={styles.lastTitle}>经营信息</span>
                                <Row gutter={16} className={styles.rowGapChild} style={{ marginTop: 20 }}><Col span={5}><span>商户简称</span></Col>
                                    <Col span={16}><span className={styles.rowGap}>{mercAbbr}</span></Col></Row>
                                <Row gutter={16} className={styles.rowGapChild}><Col span={5}><span>经营类目</span></Col>
                                    <Col span={16}><span className={styles.rowGap}>{mccDesc}</span></Col></Row>
                                {
                                    mercUrl ? <Row gutter={16} className={styles.rowGapChild}><Col span={5}><span>公司网站</span></Col>
                                        <Col span={16}><span className={styles.rowGap}>{mercUrl}</span></Col></Row> : null
                                }
                            </div>
                        </Spin>
                    </div>
                </Card>
                <Card bordered={false} title="结算信息" style={{ marginTop: '24px' }}
                    extra={<a onClick={() => this.toggleModal('stateInfo', true)}>修改</a>}
                >
                    <div className={styles.itemContent}>
                        <Spin spinning={stateInfoLoading}>
                            <Row gutter={16}>
                                <Col {...colProps}>
                                    <Row><Col span={6}>开户名称</Col><Col span={18}>{stateInfo.acctName}</Col></Row>
                                </Col>
                                <Col {...colProps}>
                                    <Row><Col span={6}>开户银行省市</Col><Col span={18}>{stateInfo.provName}-{stateInfo.cityName}</Col></Row>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col {...colProps}>
                                    <Row><Col span={6}>开户支行</Col><Col span={18}>{stateInfo.lbankName}</Col></Row>
                                </Col>
                                <Col {...colProps}>
                                    <Row><Col span={6}>银行账户</Col><Col span={18}>{stateInfo.cardNo}</Col></Row>
                                </Col>
                            </Row>
                        </Spin>
                    </div>
                </Card>
                <Card bordered={false} title="签约产品" style={{ marginTop: '24px' }}>
                    <div className={styles.itemContent}>
                        <Col xs={0} md={0} lg={24}>
                            <Table columns={tableColumns} loading={feePageLoading} dataSource={list.map((item, idx) => {
                                const { tranType, busType, feeType, capFlg, effDt, expDt, capAmt, feeRate, minAmt, fixAmt } = item
                                return Object.assign({}, item, {
                                    key: idx,
                                    tranType: TRAN_TYPE[tranType],
                                    busType: BUS_TYPE[tranType][busType],
                                    feeType: FEE_TYPE[feeType],
                                    capFlg: CAP_FLG[capFlg],
                                    effDt: formatTime(effDt),
                                    expDt: formatTime(expDt),
                                    capAmt: fMoney(capAmt),
                                    feeRate: feeType == 'F' ? '-' : feeRate,
                                    fixAmt: fMoney(fixAmt),
                                    minAmt: fMoney(minAmt)
                                })
                            })
                            } pagination={tablePagination} />
                        </Col>
                        <Col xs={24} md={24} lg={0}>
                            <Table columns={[
                                {
                                    title: '交易类型',
                                    dataIndex: 'tranType',
                                    key: 'tranType'
                                }, {
                                    title: '业务类型',
                                    dataIndex: 'busType',
                                    key: 'busType'
                                }, {
                                    title: '费率类型',
                                    dataIndex: 'feeType',
                                    key: 'feeType'
                                }, {
                                    title: '生效日期',
                                    dataIndex: 'effDt',
                                    key: 'effDt'
                                }, {
                                    title: '失效日期',
                                    dataIndex: 'expDt',
                                    key: 'expDt'
                                }
                            ]} loading={feePageLoading} dataSource={list.map((item, idx) => {
                                const { tranType, busType, feeType, capFlg, effDt, expDt, capAmt, feeRate, minAmt, fixAmt } = item
                                return Object.assign({}, item, {
                                    key: idx,
                                    tranType: TRAN_TYPE[tranType],
                                    busType: BUS_TYPE[tranType][busType],
                                    feeType: FEE_TYPE[feeType],
                                    capFlg: CAP_FLG[capFlg],
                                    effDt: formatTime(effDt),
                                    expDt: formatTime(expDt),
                                    capAmt: fMoney(capAmt),
                                    feeRate: feeType == 'F' ? '-' : feeRate,
                                    fixAmt: fMoney(fixAmt),
                                    minAmt: fMoney(minAmt)
                                })
                            })
                            } pagination={tablePagination} />
                        </Col>
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}

function mapStateToProps(state) {
    const {
        contactName, eMail, mccDesc, mercAbbr, mercAddr, mercName, mercRisk, mercType, mercUrl, phoneNo
    } = state.user.merchantInfo
    const {
        feePageLoading, list, total, busiInfo, stateInfo, stateInfoLoading, busiInfoLoading, stateInfoModal, contactInfoModal,
        mercInfoUpdating, stateInfoUpdating
    } = state.merchantInfo
    const {
        mercCd, oprRoleCd, oprCd
    } = state.user.info
    const { 
        bankList, lbankList, cityList, provinceList
    } = state.common
    return {
        contactName, eMail, mccDesc, mercAbbr, mercAddr, mercName, mercRisk, mercType, mercUrl, phoneNo,
        feePageLoading, list, total, busiInfo, stateInfo, stateInfoLoading, busiInfoLoading, stateInfoModal, contactInfoModal,
        mercCd, oprRoleCd, oprCd, mercInfoUpdating, stateInfoUpdating, bankList, lbankList, cityList, provinceList
    }
}

function mapDispatchToProps(dispatch) {
    return { dispatch }
}

export default connect(mapStateToProps)(MerchantInfo)