import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, Button, Divider, Table, Icon, Spin, Modal, Form, notification } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import moment from 'moment'

import { OPR_STATUS } from '../../../common/constants'

import { formatTime } from '../../../utils/utils'

import InputComponent from '../../../components/Input'
import PassGuard from '../../../components/PassGuard/'
import request from '../../../utils/request'

const FormItem = Form.Item

class AddOprComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initData: null,
      submiting: false,
      query: {
        mercCd: props.mercCd,
        page: 1,
        size: 5
      },
      selectedRowKeys: [],
      postRoleCd: '',
      rmk: '',
      validating: ''
    }
  }
  componentDidMount() {
    this.init()
    this.refresh()
  }
  init = () => {
    request('/api/common/passGuardInit')
      .then(data => {
        this.setState({ initData: data })
      })
      .catch(e => {
        notification.error({ message: '密码控件初始化失败' })
      })
  }
  refresh = () => {
    this.props.dispatch({ type: 'roleManage/fetch', payload: this.state.query })
  }

  onChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, postRoleCd: selectedRows[0].roleCd })
  }

  verifyPassword = (callback) => {
    const { password_new, password_re } = this.refs
    this.setState({ submiting: true })
    password_new.pwdValid(data => {
      if (data.data == '1') {
        this.setState({ submiting: false })
        return notification.error({ message: '密码不符合规范' })
      }
      password_new.pwdWeak(data => {
        if (data.data == '1') {
          this.setState({ submiting: false })
          return notification.error({ message: '您设置的密码太简单，无法保障账户安全，请重新设置' })
        }
        let new_hash, re_hash
        password_new.pwdHash(data => {
          new_hash = data
          password_re.pwdHash(data => {
            re_hash = data
            if (new_hash != re_hash) {
              this.setState({ submiting: false })
              return notification.error({ message: '两次密码不一致' })
            }
            request('/api/common/passGuardAes').then(data => {
              let randKey = data.randKey, loginPwd, rePayPwd
              password_new.getRSA(randKey, data => {
                loginPwd = data.rsa
                password_re.getRSA(randKey, data => {
                  rePayPwd = data.rsa
                  if (!loginPwd || !rePayPwd) return notification.error({ message: '请确认输入完成' })
                  callback({ randKey, loginPwd })
                }, err => {
                  this.setState({ submiting: false })
                  notification.error({ message: err })
                })
              }, err => {
                this.setState({ submiting: false })
                notification.error({ message: err })
              })
            }).catch(e => {
              this.setState({ submiting: false })
              notification.error({ message: '获取密文出错' })
            })
          }, err => {
            this.setState({ submiting: false })
            notification.error({ message: err })
          })
        }, err => {
          this.setState({ submiting: false })
          notification.error({ message: err })
        })
      }, err => {
        this.setState({ submiting: false })
        notification.error({ message: err })
      })
    }, err => {
      this.setState({ submiting: false })
      notification.error({ message: err })
    })
  }

  checkExist = (rule, value, callback) => {
    if (!value) {
      this.setState({ validating: 'error' })
      return callback('请输入操作员账号')
    }
    if (!/^[0-9]*$/g.test(value)) {
      return callback('操作员账号为纯数字')
    }
    return callback()
  }

  queryOprisExist = (value) => {
    if (!value) return false
    this.setState({ validating: 'validating' })
    request('/api/oprManage/queryOprisExist', { data: { oprCd: value, mercCd: this.props.mercCd } })
      .then(data => {
        if (!data) {
          this.setState({ validating: 'error' })
          notification.error({ message: '该操作员已存在' })
        } else {
          this.setState({ validating: 'success' })
        }
      })
      .catch(error => {
        if (error.number == 401) {
          notification.error({ message: error.message })
          this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
        } else {
          this.setState({ validating: 'error' })
          notification.error({ message: '操作员检测失败' })
        }
      })
  }

  onSubmit = (e) => {
    e.preventDefault()
    if (!this.state.postRoleCd) return notification.info({ message: '请选择角色' })
    this.verifyPassword(({ randKey, loginPwd }) => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          let queryData = Object.assign({}, values, {
            randKey,
            loginPwd,
            mercCd: this.props.mercCd,
            rmk: this.state.rmk,
            roleCd: this.state.postRoleCd
          })
          request('/api/oprManage/oprAdd', { data: queryData, method: 'POST' }).then(data => {
            this.setState({ submiting: false })
            notification.success({ message: '操作员添加成功' })
            this.props.refresh()
            this.props.dispatch({ type: 'oprManage/addOprModal', payload: { show: false } })
          }).catch(error => {
            if (error.number == 401) {
              notification.error({ message: error.message })
              this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
            } else {
              this.setState({ submiting: false })
              notification.error({ message: '操作员添加失败，请稍后重试' })
            }
          })
        }
      })
    })
  }
  render() {
    const { roleInfo, form } = this.props
    const { getFieldDecorator } = form
    const { submiting, initData, query, selectedRowKeys, rmk, validating } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 3,
        },
      },
    }

    const tablePagination = {
      total: roleInfo.total || 0,
      pageNumber: query.page,
      pageSize: query.size,
      onChange: page => {
        this.setState({ query: Object.assign({}, query, { page }) }, this.refresh)
      }
    }

    return (
      <Form onSubmit={this.onSubmit} layout='horizontal'>
        <Divider orientation="left">角色信息</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="操作员账号"
              hasFeedback
              validateStatus={validating}
            >
              {getFieldDecorator('oprCd', {
                rules: [{
                  required: true, validator: this.checkExist
                }],
              })(
                <Input placeholder='请输入操作员账号' onBlur={({ target: { value } }) => this.queryOprisExist(value)} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="操作员名称"
            >
              {getFieldDecorator('oprName', {
                rules: [{
                  required: true, message: '请输入操作员名称',
                }],
              })(
                <Input placeholder='请输入操作员名称' />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="操作员手机号"
              hasFeedback
            >
              {getFieldDecorator('phoneNo', {
                rules: [{
                  pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '请输入正确手机号'
                }, {
                  required: true, message: '请输入操作员手机号',
                }],
              })(
                <Input placeholder='请输入操作员手机号' maxLength={11} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="操作员邮箱"
              hasFeedback
            >
              {getFieldDecorator('eMail', {
                rules: [{
                  type: 'email', message: '请输入正确邮箱',
                }, {
                  required: true, message: '请输入操作员邮箱',
                }],
              })(
                <Input placeholder='请输入操作员邮箱' />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="设置登录密码"
            >
              <InputComponent placeholder="请输入新密码（8~20位）" ref="password_new" maxLength={20}>
                <PassGuard initData={this.state.initData} pgeId='password_new' />
              </InputComponent>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="确认登录密码"
            >
              <InputComponent placeholder="请再输一遍新密码" ref="password_re" maxLength={20}>
                <PassGuard initData={this.state.initData} pgeId='password_re' />
              </InputComponent>
            </FormItem>
          </Col>
        </Row>
        <Divider orientation="left">角色设置</Divider>
        <Row gutter={16}>
          <Col xs={0} sm={1}></Col>
          <Col xs={24} sm={23}>
            <Table columns={[
              { title: '角色编码', dataIndex: 'roleCd' },
              { title: '角色名称', dataIndex: 'roleName' },
              { title: '角色说明', dataIndex: 'rmk' }
            ]} dataSource={roleInfo.list.map((item, idx) => {
              const { uuid, rmk } = item
              return Object.assign({}, item, { key: uuid, rmk: rmk || '-' })
            })} rowSelection={{
              type: 'radio',
              selectedRowKeys,
              onChange: this.onChange
            }} pagination={tablePagination} loading={roleInfo.loading} />
          </Col>
        </Row>
        <Divider orientation="left">操作员说明</Divider>
        <Row gutter={16}>
          <Col xs={0} sm={1}></Col>
          <Col xs={24} sm={23}>
            <Input.TextArea rows={4} value={rmk} onChange={({ target: { value } }) => this.setState({ rmk: value })} />
          </Col>
        </Row>
        <Divider></Divider>
        <Row gutter={16}><Col style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit" size='large' loading={submiting}>确认添加</Button>
        </Col></Row>
      </Form>
    )
  }
}

const AddOprFormComponent = Form.create()(AddOprComponent)

class ModifyOprComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submiting: false,
      query: {
        mercCd: props.mercCd,
        page: 1,
        size: 5
      },
      selectedRowKeys: [],
      roleCd: '',
      rmk: '',
      oprName: '',
      oprCd: '',
      phoneNo: ''
    }
  }
  componentDidMount() {
    this.refresh()
    const { oprCd, phoneNo, rmk, roleCd, oprName } = this.props.record
    const selectedRowKeys = []
    selectedRowKeys.push(roleCd)
    this.setState({ oprName, phoneNo, rmk, roleCd, selectedRowKeys, oprCd })
  }

  refresh = () => {
    this.props.dispatch({ type: 'roleManage/fetch', payload: this.state.query })
  }

  onChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, postRoleCd: selectedRows[0].roleCd })
  }

  modify = (e) => {
    e.preventDefault()
    const { oprName, rmk, oprCd, phoneNo, roleCd } = this.state
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let queryDate = Object.assign({}, values, { oprCd, rmk, roleCd, mercCd: this.props.mercCd })
        this.setState({ submiting: true }, () => {
          request('/api/oprManage/modifyOprInfo', { data: queryDate, method: 'PUT' }).then(data => {
            this.setState({ submiting: false })
            notification.success({ message: '操作员修改成功' })
            this.props.cancelModal()
            this.props.refresh()
          }).catch(error => {
            if (error.number == 401) {
              notification.error({ message: error.message })
              this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
            } else {
              this.setState({ submiting: false })
              notification.error({ message: '操作员修改失败，请稍后重试' })
            }
          })
        })
      }
    })
  }

  render() {
    const { roleInfo, form } = this.props
    const { submiting, query, selectedRowKeys, rmk, oprCd, phoneNo, oprName } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 3,
        },
      },
    }

    const tablePagination = {
      total: roleInfo.total || 0,
      pageNumber: query.page,
      pageSize: query.size,
      onChange: page => {
        this.setState({ query: Object.assign({}, query, { page }) }, this.refresh)
      }
    }

    return (
      <Form>
        <Divider orientation="left">角色信息</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="操作员名称"
              hasFeedback
            >
              {getFieldDecorator('oprName', {
                rules: [{
                  required: true, message: '请输入操作员名称',
                }],
                initialValue: oprName
              })(
                <Input placeholder='请输入操作员名称' />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="操作员手机号"
              hasFeedback
            >
              {getFieldDecorator('phoneNo', {
                rules: [{
                  pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '请输入正确手机号'
                }, {
                  required: true, message: '请输入操作员手机号',
                }],
                initialValue: phoneNo
              })(
                <Input placeholder='请输入操作员手机号' maxLength={11} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Divider orientation="left">角色设置</Divider>
        <Row gutter={16}>
          <Col xs={0} sm={1}></Col>
          <Col xs={24} sm={23}>
            <Table columns={[
              { title: '角色编码', dataIndex: 'roleCd' },
              { title: '角色名称', dataIndex: 'roleName' },
              { title: '角色说明', dataIndex: 'rmk' }
            ]} dataSource={roleInfo.list.map((item, idx) => {
              const { roleCd, rmk } = item
              return Object.assign({}, item, { key: roleCd, rmk: rmk || '-' })
            })} rowSelection={{
              type: 'radio',
              selectedRowKeys,
              onChange: this.onChange
            }} pagination={tablePagination} loading={roleInfo.loading} />
          </Col>
        </Row>
        <Divider orientation="left">操作员说明</Divider>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col xs={0} sm={1}></Col>
          <Col xs={24} sm={23}>
            <Input.TextArea rows={4} value={rmk} onChange={({ target: { value } }) => this.setState({ rmk: value })} />
          </Col>
        </Row>
        <Divider></Divider>
        <Row gutter={16}><Col style={{ textAlign: 'right' }}>
          <Button type="primary" size='large' onClick={this.modify} loading={submiting}>确认修改</Button>
        </Col></Row>
      </Form>
    )
  }
}

const ModifyOprComponentForm = Form.create()(ModifyOprComponent)

class ModifyStatusComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submiting: false,
      query: {
        mercCd: props.mercCd,
        oprCd: props.record.oprCd,
        page: 1,
        size: 5
      },
      oprSts: props.record.oprSts || '',
      rmk: ''
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
    if (!this._isMounted) return false
    this.props.dispatch({ type: 'oprManage/statusPage', payload: this.state.query })
  }

  modifyStatus = () => {
    const { record, mercCd } = this.props
    const { uuid, oprCd } = record
    const { oprSts, rmk } = this.state
    if (oprSts == record.oprSts) return notification.error({ message: '操作员状态未改变' })
    if (!rmk) return notification.error({ message: '请填写变更原因' })
    let queryData = { mercCd, oprCd, oprSts, uuid, rmk }
    this.setState({ submiting: true })
    request('/api/oprManage/modifyOprStatus', { data: queryData, method: 'PUT' })
      .then(data => {
        this.setState({ submiting: false })
        this.refresh()
        notification.success({ message: '状态修改成功' })
      })
      .catch(error => {
        if (error.number == '401') {
          notification.error({ message: error.message })
          this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
        } else {
          this.setState({ submiting: false })
          notification.error({ message: '状态修改失败，请稍后重试' })
        }
      })
  }

  render() {
    const { statusPageInfo, form } = this.props
    const { statusList, statusLoading, statusTotal } = statusPageInfo
    const { submiting, query, oprSts, rmk } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 3,
        },
      },
    }

    const tablePagination = {
      total: statusTotal || 0,
      pageNumber: query.page,
      pageSize: query.size,
      onChange: page => {
        this.setState({ query: Object.assign({}, query, { page }) }, this.refresh)
      }
    }

    return (
      <Form>
        <Row gutter={16}>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="状态"
            >
              <Select value={oprSts} onChange={e => this.setState({ oprSts: e })}>
                {Object.keys(OPR_STATUS).map(key => <Select.Option value={key} key={key}>{OPR_STATUS[key]}</Select.Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={13}>
            <FormItem
              {...formItemLayout}
              label={<span><span style={{ paddingRight: 5 }}>*</span>变更原因</span>}
            >
              <Input placeholder='请输入变更原因（必填）' value={rmk} onChange={e => this.setState({ rmk: e.target.value })} />
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              {...tailFormItemLayout}
            >
              <Button type='primary' onClick={this.modifyStatus} loading={submiting}>确认修改</Button>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col xs={0} sm={1}></Col>
          <Col xs={24} sm={23}>
            <Table columns={[
              { title: '操作时间', dataIndex: 'time' },
              { title: '变更前状态', dataIndex: 'preSts' },
              { title: '变更后状态', dataIndex: 'aftSts' },
              { title: '操作员', dataIndex: 'oprCd' },
              { title: '变更原因', dataIndex: 'rmk' }
            ]} dataSource={statusList.map((item, idx) => {
              const { aftSts, preSts, tranDt, tranTm, oprCd, rmk } = item
              return Object.assign({}, item, {
                key: idx,
                rmk: rmk || '-',
                time: formatTime(tranDt, tranTm),
                aftSts: OPR_STATUS[aftSts],
                preSts: OPR_STATUS[preSts]
              })
            })} pagination={tablePagination} loading={statusLoading} />
          </Col>
        </Row>
      </Form>
    )
  }
}

class OprManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        mercCd: props.currentUser.mercCd,
        page: 1,
        size: 10,
        oprName: '',
        oprCd: ''
      },
      modifyOprModal: false,
      statusModal: false,
      record: {}
    }
  }

  componentDidMount() {
    this.refresh()
  }

  queryChange = (key, val) => {
    const tmpObj = { page: 1 }
    tmpObj[key] = val
    this.setState({ query: Object.assign({}, this.state.query, tmpObj) })
  }


  refresh = () => {
    const { dispatch, loading } = this.props
    if (loading) return false
    dispatch({ type: 'oprManage/fetch', payload: this.state.query })
  }

  modifyOprInfo = (record) => {
    this.setState({ record }, () => this.setState({ modifyOprModal: true }))
  }

  modifyStatus = (record) => {
    this.setState({ record }, () => this.setState({ statusModal: true }))
  }

  cancelStatusModal = () => {
    this.setState({ statusModal: false }, () => this.refresh())
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

    const columns = [
      {
        title: '操作员账号',
        dataIndex: 'oprCd',
        key: 'oprCd',
      }, {
        title: '操作员名称',
        dataIndex: 'oprName',
        key: 'oprName',
      }, {
        title: '操作员手机号',
        dataIndex: 'phoneNo',
        key: 'phoneNo',
      }, {
        title: '创建时间',
        dataIndex: 'creTime',
        key: 'creTime',
      }, {
        title: '角色',
        dataIndex: 'roleCd',
        key: 'roleCd',
      }, {
        title: '操作员说明',
        dataIndex: 'rmk',
        key: 'rmk',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      }, {
        title: '操作',
        key: 'handle',
        render: (record) => {
          return (
            <span>
              <a onClick={() => this.modifyOprInfo(record)}>编辑</a>
              <a style={{ marginLeft: 10 }} onClick={() => this.modifyStatus(record)}>状态</a>
            </span>
          )
        }
      }
    ]

    const { query, modifyOprModal, record, statusModal } = this.state
    const { total, list, loading, dispatch, addOprModal, roleInfo, currentUser, statusLoading, statusList, statusTotal } = this.props

    const tablePagination = {
      total: total,
      pageNumber: query.page,
      pageSize: query.size,
      onChange: page => {
        this.setState({ query: Object.assign({}, query, { page }) }, this.refresh)
      }
    }
    return (
      <PageHeaderLayout
        title="操作员管理"
      >
        <Modal title='添加操作员' visible={addOprModal} width={1000} footer={null} destroyOnClose={true} maskClosable={false}
          onCancel={() => dispatch({ type: 'oprManage/addOprModal', payload: { show: false } })}>
          <AddOprFormComponent roleInfo={roleInfo} mercCd={currentUser.mercCd} dispatch={dispatch} refresh={this.refresh} />
        </Modal>
        <Modal title='修改操作员' visible={modifyOprModal} width={1000} footer={null} destroyOnClose={true} maskClosable={false}
          onCancel={() => this.setState({ modifyOprModal: false })}>
          <ModifyOprComponentForm refresh={this.refresh} roleInfo={roleInfo} record={record} mercCd={currentUser.mercCd} dispatch={dispatch} cancelModal={() => this.setState({ modifyOprModal: false })} />
        </Modal>
        <Modal title='操作员状态' visible={statusModal} width={1000} footer={
          <Button type='primary' onClick={this.cancelStatusModal}>关闭</Button>
        } destroyOnClose={true} maskClosable={false}
          onCancel={this.cancelStatusModal}>
          <ModifyStatusComponent
            refresh={this.refresh}
            record={record}
            mercCd={currentUser.mercCd}
            dispatch={dispatch}
            statusPageInfo={{ statusLoading, statusList, statusTotal }}
            cancelModal={this.cancelStatusModal}
          />
        </Modal>
        <Card bordered={false} title="查询条件">
          <Row gutter={24}>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>操作员账号：</span>
              <Input className={styles.inputBox} placeholder="请输入操作员账号"
                onChange={({ target: { value } }) => this.queryChange('oprCd', value)} />
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>操作员名称：</span>
              <Input className={styles.inputBox} placeholder="请输入操作员名称"
                onChange={({ target: { value } }) => this.queryChange('oprName', value)} />
            </Col>
          </Row>
          <Divider style={{ marginTop: 0 }} dashed={true} />
          <Row style={{ textAlign: 'right' }}>
            <Button type="primary" icon="search" onClick={this.refresh} loading={loading}>查询</Button>
            <a target='_blank' className={'xs-hide'} style={{ marginLeft: 20 }} >
              <Button type="default" icon="plus" onClick={() => dispatch({ type: 'oprManage/addOprModal', payload: { show: true } })}>添加</Button>
            </a>
          </Row>
        </Card>
        <Card bordered={false} title="查询结果" style={{ marginTop: '24px', minHeight: '420px' }}>
          <Row>
            <Col xs={0} md={0} lg={24}>
              <Table columns={columns} dataSource={list.map((item, idx) => {
                const { creDt, creTm, oprSts, rmk } = item
                return Object.assign({}, item, {
                  key: idx,
                  creTime: formatTime(creDt, creTm),
                  status: OPR_STATUS[oprSts],
                  rmk: rmk || '-'
                })
              })} loading={loading} pagination={tablePagination} />
            </Col>
            <Col xs={24} md={24} lg={0}>
              <Table columns={[
                {
                  title: '操作员名称',
                  dataIndex: 'oprName',
                  key: 'oprName',
                  width: '30%',
                  render: (text) => {
                    return <span key='orderNo' style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>
                  }
                },
                {
                  title: '角色',
                  dataIndex: 'roleCd',
                  key: 'roleCd'
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status'
                },
                {
                  title: '操作',
                  key: 'handle',
                  render: (record) => {
                    return (
                      <span>
                        <a onClick={() => this.modifyOprInfo(record)}>编辑</a>
                        <a style={{ marginLeft: 10 }} onClick={() => this.modifyStatus(record)}>状态</a>
                      </span>
                    )
                  }
                }
              ]} dataSource={list.map((item, idx) => {
                const { creDt, creTm, oprSts, rmk } = item
                return Object.assign({}, item, {
                  key: idx,
                  creTime: formatTime(creDt, creTm),
                  status: OPR_STATUS[oprSts]
                })
              })} loading={loading} pagination={tablePagination} />
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    )
  }
}

function mapStateToProps(state) {
  const { loading, list, total, addOprModal, statusLoading, statusList, statusTotal } = state.oprManage
  return {
    addOprModal, roleInfo: state.roleManage,
    statusLoading, statusList, statusTotal,
    loading, list, total, currentUser: state.user.info
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(OprManage)