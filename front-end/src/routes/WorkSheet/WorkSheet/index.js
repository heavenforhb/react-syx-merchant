import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, DatePicker, Button, Divider, Table, Icon, Spin, Menu, Dropdown, Popconfirm, Modal, Form, Upload } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import moment from 'moment'

import { WORK_SHEET_STATUS, WORK_SHEET_TYPE } from '../../../common/constants'

import { formatTime, fMoney } from '../../../utils/utils'

import Detail from '../../../components/Detail'
import ImageContainer from '../../../components/ImageContainer'

const { RangePicker } = DatePicker
const FormItem = Form.Item
class WorkSheet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: {
                page: 1,
                size: 10,
                beginDate: moment().subtract(10, 'days'),
                endDate: moment(),
                wkShtSts: '',
                mercCd: props.currentUser.mercCd
            },
            detail: [],
            updateModal: false,
            detailModal: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],
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
        const { dispatch } = this.props
        if (!this._isMounted) return false
        dispatch({ type: 'workSheet/fetch', payload: this.state.query })
    }

    queryChange = (key, val) => {
        const tmpObj = { page: 1 }
        tmpObj[key] = val
        // 修改交易类型时充值业务类型
        if (key == 'tranType') tmpObj['busType'] = ''
        this.setState({ query: Object.assign({}, this.state.query, tmpObj) })
    }

    showDetail = (record) => {
        const { wkShtTitle, imgsPath, content, wkTime, wkShtCd, wkType, wkShtSts, replyInfo } = record
        const detail = [{
            key: '标题',
            val: wkShtTitle ? wkShtTitle : '-'
        }, {
            key: '工单类型',
            val: wkType ? wkType : '-'
        }, {
            key: '订单编号',
            val: wkShtCd ? wkShtCd : '-'
        }, {
            key: '工单具体描述',
            val: content ? content : '-'
        }, {
            key: '附件',
            val: <ImageContainer url={imgsPath ? imgsPath : null} />
        }, {
            key: '回复信息',
            val: replyInfo ? replyInfo : '-'
        }]
        wkShtSts == 'S1' ? detail.pop() : null
        this.setState({ detailModal: true, detail })
    }

    toggleAddModal = (show) => {
        this.props.dispatch({ type: 'workSheet/toggle', payload: { show } })
        this.props.form.setFieldsValue({ 'wkShtTitle': '', 'wkShtType': '', 'orderNo': '', 'content': '' })
        this.setState({ fileList: [] }) 
    }

    // 上传图片操作
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ file, fileList }) => {
        const { response = {} } = file
        let imgsPath = response.result
        this.setState({ imgsPath, fileList })
    }

    //判断上传对象的格式
    beforeUpload = (file) => {
        if (!file.type) return false
        let fileType = file.type.split('/')[0]
        const isJPG = fileType === 'image'
        if (!isJPG) {
            message.error('只能上传图片')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            message.error('上传图片过大')
        }
        return isJPG && isLt2M
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if (!this._isMounted) return false
        const { dispatch, form, mercCd, mercName } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                let imgsPath = values.imgsPath ? values.imgsPath.file.response.result : ''
                values['imgsPath'] = imgsPath
                values['mercCd'] = mercCd
                values['mercName'] = mercName
                dispatch({ type: 'workSheet/add', payload: values })
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

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        }

        const { query, detailModal, detail, previewVisible, previewImage, fileList } = this.state
        const { total, list, statistics, fetchLoading, dispatch, form, addLoading, addWorkSheetModal } = this.props
        const columns = [
            {
                title: '工单编号',
                dataIndex: 'wkShtCd',
                key: 'wkShtCd',
            }, {
                title: '工单类型',
                dataIndex: 'wkType',
                key: 'wkType',
            }, {
                title: '工单标题',
                dataIndex: 'wkShtTitle',
                key: 'wkShtTitle',
            }, {
                title: '提交时间',
                dataIndex: 'wkTime',
                key: 'wkTime',
            }, {
                title: '工单状态',
                dataIndex: 'status',
                key: 'status',
            }, {
                title: '操作',
                key: 'handle',
                render: (record) => {
                    return (
                        <a onClick={() => this.showDetail(record)}>查看详情</a>
                    )
                }
            }
        ]
        const { getFieldDecorator } = form

        const tablePagination = {
            total: total,
            current: query.page,
            pageSize: query.size,
            onChange: page => {
                this.setState({ query: Object.assign({}, query, { page }) }, this.refresh)
            }
        }

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        return (
            <PageHeaderLayout
                title="工单管理"
            >
                <Modal visible={detailModal} width={800} maskClosable={false} onCancel={() => this.setState({ detailModal: false })} title='工单详情' footer={
                    <Button type='primary' size='large' onClick={() => this.setState({ detailModal: false })}>关闭</Button>}>
                    <Detail detail={detail} />
                </Modal>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <div style={{ padding: 20 }}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </div>
                </Modal>
                <Modal visible={addWorkSheetModal} width={800} maskClosable={false} onCancel={() => this.toggleAddModal(false)} title='添加工单' footer={null}>
                    <Form onSubmit={this.handleSubmit} style={{ width: 600 }}>
                        <FormItem
                            {...formItemLayout}
                            label="标题"
                        >
                            {getFieldDecorator('wkShtTitle', {
                                rules: [{
                                    required: true, message: '请输入标题',
                                }],
                            })(
                                <Input placeholder='请输入标题' />
                            )}
                        </FormItem>
                        <Row>
                            <Col span={12} push={4}>
                                <FormItem
                                    {...formItemLayout}
                                    label="工单类型"
                                >
                                    {getFieldDecorator('wkShtType', {
                                        rules: [{
                                            required: true, message: '请选择工单类型',
                                        }],
                                        initialValue: ''
                                    })(
                                        <Select>
                                            <Select.Option value=''>请选择</Select.Option>
                                            {Object.keys(WORK_SHEET_TYPE).map(key => <Select.Option value={key} key={key}>{WORK_SHEET_TYPE[key]}</Select.Option>)}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10} push={5}>
                                <FormItem
                                    {...formItemLayout}
                                    label=""
                                >
                                    {getFieldDecorator('orderNo', {

                                    })(
                                        <Input placeholder='请输入订单编号' />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem
                            {...formItemLayout}
                            label="工单具体描述"
                        >
                            {getFieldDecorator('content', {
                                rules: [{
                                    required: true, message: '请描述相关问题',
                                }],
                            })(
                                <Input.TextArea placeholder='如是订单相关问题，请留下订单编号，方便定位问题。' rows={4} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="上传附件"
                        >
                            {getFieldDecorator('imgsPath', {
                            })(
                                <Upload
                                    action="/api/common/file"
                                    listType="picture-card"
                                    fileList={fileList}
                                    beforeUpload={this.beforeUpload}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <div style={{ color: '#999999', marginTop: -30 }}>上传问题相关的截图，没有附件可以不上传</div>
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" loading={addLoading}>提交</Button>
                        </FormItem>
                    </Form>
                </Modal>
                <Card bordered={false} title="查询条件">
                    <Row gutter={24}>
                        <Col {...colProps} className={`${styles.col} xs-hide`}>
                            <span className={styles.inputLabel}>工单状态：</span>
                            <Select className={styles.select} value={query.wkShtSts} onChange={val => this.queryChange('wkShtSts', val)}>
                                <Select.Option value=''>全部</Select.Option>
                                {Object.keys(WORK_SHEET_STATUS).map(key => <Select.Option value={key} key={key}>{WORK_SHEET_STATUS[key]['name']}</Select.Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <Divider style={{ marginTop: 0 }} dashed={true} />
                    <Row style={{ textAlign: 'right' }}>
                        <Button type="primary" icon="search" onClick={this.refresh} loading={fetchLoading}>查询</Button>
                        <a target='_blank' className={'xs-hide'} style={{ marginLeft: 20 }} >
                            <Button type="default" onClick={() => this.toggleAddModal(true)}>提交工单</Button>
                        </a>
                    </Row>
                </Card>
                <Card bordered={false} title="查询结果" style={{ marginTop: '24px', minHeight: '420px' }}>
                    <Row>
                        <Col xs={0} md={0} lg={24}>
                            <Table columns={columns} dataSource={(list || []).map((item, idx) => {
                                const { wkShtTitle, imgsPath, content, orderDt, orderTm, wkShtCd, wkShtSts, wkShtType } = item
                                const status = WORK_SHEET_STATUS[wkShtSts]
                                return Object.assign({}, item, {
                                    key: idx,
                                    wkTime: formatTime(orderDt, orderTm),
                                    wkType: WORK_SHEET_TYPE[wkShtType],
                                    status: <span style={{ color: status.color }}>{status.icon ? <Icon type={status.icon} /> : null} {status.name}</span>
                                })
                            })} loading={fetchLoading} pagination={tablePagination} />
                        </Col>
                        <Col xs={24} md={24} lg={0}>
                            <Table columns={[
                                {
                                    title: '工单编号',
                                    dataIndex: 'wkShtCd',
                                    key: 'wkShtCd',
                                    width: '30%',
                                    render: (text) => {
                                        return <span key='outOrderNo' style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>
                                    }
                                },
                                {
                                    title: '工单标题',
                                    dataIndex: 'wkShtTitle',
                                    key: 'wkShtTitle',
                                },
                                {
                                    title: '工单状态',
                                    dataIndex: 'status',
                                    key: 'status'
                                }
                            ]} dataSource={(list || []).map((item, idx) => {
                                const { wkShtTitle, imgsPath, content, orderDt, orderTm, wkShtCd, wkShtSts, wkShtType } = item
                                const status = WORK_SHEET_STATUS[wkShtSts]
                                return Object.assign({}, item, {
                                    key: idx,
                                    wkTime: formatTime(orderDt, orderTm),
                                    wkType: WORK_SHEET_TYPE[wkShtType],
                                    status: <span style={{ color: status.color }}>{status.icon ? <Icon type={status.icon} /> : null} {status.name}</span>
                                })
                            })} loading={fetchLoading} pagination={tablePagination} />
                        </Col>
                    </Row>
                </Card>
            </PageHeaderLayout>
        )
    }
}

const WorkSheetForm = Form.create()(WorkSheet)

function mapStateToProps(state) {
    const { fetchLoading, list, total, statistics, addLoading, addWorkSheetModal } = state.workSheet
    const { mercCd, mercName } = state.user.merchantInfo
    return { fetchLoading, list, total, statistics, addLoading, mercCd, mercName, addWorkSheetModal, currentUser: state.user.info, }
}

function mapDispatchToProps(dispatch) {
    return { dispatch }
}

export default connect(mapStateToProps)(WorkSheetForm)