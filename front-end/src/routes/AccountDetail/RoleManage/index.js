import React, { Component } from 'react'
import { Card, Input, Row, Col, Button, Divider, Table, Icon, Spin, Modal, Form, Tree, notification } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'
import request from '../../../utils/request'
import moment from 'moment'
const FormItem = Form.Item
const TreeNode = Tree.TreeNode

import { REFUND_STATUS } from '../../../common/constants'

import { formatTime, unique } from '../../../utils/utils'

class RoleComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submiting: false,
      rmk: props.record.rmk || '',
      menuData: [],
      checkedKeys: [],
      postMenuPath: [],
      postMenuCd: [],
      showMenuName: [],
      postMenuInfo: []
    }
  }
  componentDidMount() {
    const { menuInfo } = this.props
    this.dataPectination_one(menuInfo, true)
  }

  dataPectination_one = (menuInfo, bool) => {
    let menuOne = [], menuTwo = {}, menuThree = {}
    menuInfo.map(item => {
      const { menuCd, menuName } = item
      if (item.menuLev == "00") {
        menuOne.push(item)
      } else if (item.menuLev == "01") {
        if (menuTwo[item.pmenuCd]) {
          menuTwo[item.pmenuCd].push(item)
        } else {
          menuTwo[item.pmenuCd] = [item]
        }
      } else {
        if (menuThree[item.pmenuCd]) {
          menuThree[item.pmenuCd].push(item)
        } else {
          menuThree[item.pmenuCd] = [item]
        }
      }
    })
    this.dataPectination_two(menuOne, menuTwo, menuThree, bool)
  }

  dataPectination_two = (menuOne, menuTwo, menuThree, bool) => {
    let menuData = []
    menuOne.map(item => {
      const { menuCd, menuName, menuPath } = item
      let obj = {}
      obj['name'] = menuName
      obj['path'] = menuPath
      if (menuTwo[menuCd]) {
        obj['children'] = []
        menuTwo[menuCd].map(_item => {
          const { menuCd, menuName, menuPath } = _item
          let _obj = {}
          _obj['name'] = menuName
          _obj['path'] = menuPath
          obj['children'].push(_obj)
          if (menuThree[menuCd]) {
            _obj['children'] = []
            menuThree[menuCd].map(_item_ => {
              const { menuName, menuPath } = _item_
              let _obj_ = {}
              _obj_['name'] = menuName
              _obj_['path'] = menuPath
              _obj['children'].push(_obj_)
            })
          }
        })
      }
      menuData.push(obj)
    })
    if (bool) {
      if(!this.props.record.mercCd) {
        let checkedKeys = [menuOne[0]['menuPath']], showMenuName = [menuOne[0]['menuName']]
        this.setState({ menuData, checkedKeys, showMenuName, postMenuCd: menuOne[0]['menuCd'], postMenuPath: checkedKeys, postMenuInfo: menuData[0] })
      } else {
        let checkedKeys = [], showMenuName = []
        const { menuInfo, menuInfo1, menuInfo2 } = this.props.record
        let dataInfo 
        menuInfo2 ? dataInfo = JSON.parse(menuInfo2) : dataInfo = []
        const queryShowList = (data) => {
          data.map(item => {
            const { children, path, name } = item
            if(!children) {
              dataInfo.map(_item => {
                if(path == _item) {
                  checkedKeys.push(path)
                  showMenuName.push(name)
                }
              })
            } else {
              queryShowList(children)
            }
          })
        }
        queryShowList(menuData)
        this.setState({ menuData, showMenuName, checkedKeys, postMenuCd: JSON.parse(menuInfo), postMenuInfo: JSON.parse(menuInfo1), postMenuPath: JSON.parse(menuInfo2) })
      }
    } else {
      this.setState({ postMenuInfo: menuData })
    }
  }

  onCheck = (checkedKeys, e) => {
    let postMenuPath = []
    this.state.menuData.map(item1 => {
      checkedKeys.map(item => {
        if(!item1.children) {
          if(item1.path == item) {
            postMenuPath.push(item)
          }
        } else {
          item1.children.map(item2 => {
            if(!item2.children) {
              if(item2.path == item) {
                postMenuPath.push(item)
                if(postMenuPath.indexOf(item1.path) == -1) {
                  postMenuPath.push(item1.path)
                }
              }
            } else {
              item2.children.map(item3 => {
                if(item3.path == item) {
                  postMenuPath.push(item)
                  if(postMenuPath.indexOf(item1.path) == -1) {
                    postMenuPath.push(item1.path)
                  }
                  if(postMenuPath.indexOf(item2.path) == -1) {
                    postMenuPath.push(item2.path)
                  }
                }
              })
            }
          })
        }
      })
    })
    this.handleData(postMenuPath, checkedKeys)
  }

  handleData = (postMenuPath, checkedKeys) => {
    let postMenuCd = [], showMenuName = [], menu = []
    this.props.menuInfo.map(_item => {
      postMenuPath.map(item => {
        if (item == _item.menuPath) {
          postMenuCd.push(_item.menuCd)
          menu.push(_item)
        }
      })
    })
    let menuData = this.state.menuData
    const queryShowMenuName = (data) => {
      data.map(item => {
        const { children, name, path } = item
        if (!children) {
          postMenuPath.map(_item => {
            if (path == _item) {
              showMenuName.push(name)
            }
          })
        } else {
          queryShowMenuName(children)
        }
      })
    }
    queryShowMenuName(menuData)
    this.dataPectination_one(menu, false)
    this.setState({ postMenuCd, showMenuName, checkedKeys, postMenuPath })
  }

  checkResult = (rule, value, callback) => {
    if (!value) {
      return callback('请输入角色编码')
    }
    if (value.length != 6) {
      return callback('请输入六位角色编码')
    }
    if (/^admin|Admin*$/.test(value)) {
      return callback('输入信息为敏感信息')
    }
    return callback()
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { postMenuCd, postMenuInfo, postMenuPath, rmk } = this.state
        let menuInfo = JSON.stringify(postMenuCd), menuInfo1 = JSON.stringify(postMenuInfo), menuInfo2 = JSON.stringify(postMenuPath)
        let queryData = Object.assign({}, values, { mercCd: this.props.mercCd, menuInfo, menuInfo1, menuInfo2, rmk })
        this.setState({ submiting: true })
        if (this.props.record.mercCd) {
          request('/api/roleManage/roleUpdate', { method: 'PUT', data: queryData })
            .then(data => {
              this.setState({ submiting: false })
              notification.success({ message: '角色修改成功' })
              this.props.cancelModal()
              this.props.refresh()
            })
            .catch(error => {
              if (error.number == '401') {
                notification.error({ message: error.message })
                this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
              } else {
                this.setState({ submiting: false })
                notification.error({ message: '角色修改失败，请稍后重试' })
              }
            })
        } else {
          request('/api/roleManage/roleSave', { method: 'POST', data: queryData })
            .then(data => {
              this.setState({ submiting: false })
              notification.success({ message: '角色添加成功' })
              this.props.cancelModal()
              this.props.refresh()
            })
            .catch(error => {
              if (error.number == '401') {
                notification.error({ message: error.message })
                this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
              } else {
                this.setState({ submiting: false })
                notification.error({ message: '角色添加失败，请稍后重试' })
              }
            })
        }
      }
    })
  }


  render() {
    const { form, menuInfo, menuLoading, record } = this.props
    const { submiting, rmk, menuData, checkedKeys, showMenuName } = this.state
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

    const renderTreeNodes = (menuData) => {
      return menuData.map((item, idx) => {
        if (item.path == '/merchant/home') {
          return <TreeNode title={<span><Icon type="file-text" style={{ marginRight: 5 }} />{item.name}</span>} key={item.path} disabled />
        }
        if (item.children) {
          return (
            <TreeNode title={<span><Icon type="folder" style={{ marginRight: 5 }} />{item.name}</span>} key={item.path}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          )
        } else {
          return <TreeNode title={<span><Icon type="file-text" style={{ marginRight: 5 }} />{item.name}</span>} key={item.path} />
        }
      })
    }

    return (
      <Form>
        <Divider orientation="left">角色信息</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="角色编码"
              hasFeedback
            >
              {getFieldDecorator('roleCd', {
                rules: [{
                  required: true, validator: this.checkResult
                }],
                initialValue: record.roleCd || ''
              })(
                <Input placeholder='请输入角色编码' maxLength={6} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="角色名称"
            >
              {getFieldDecorator('roleName', {
                rules: [{
                  required: true, message: '请输入角色名称',
                }],
                initialValue: record.roleName || ''
              })(
                <Input placeholder='请输入角色名称' maxLength={11} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Divider orientation="left">菜单设置</Divider>
        <Row gutter={16}>
          <Col xs={0} sm={1}></Col>
          <Col xs={24} sm={23}>
            <Spin spinning={menuLoading}>
              <Row gutter={16}>
                <Col span={1}></Col>
                <Col span={10} style={{ border: '1px solid #eee', height: 300, overflowY: 'scroll', padding: 10 }}>
                  <Tree
                    checkable
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                  >
                    {renderTreeNodes(menuData)}
                  </Tree>
                </Col>
                <Col span={2}></Col>
                <Col span={10} style={{ border: '1px solid #eee', height: 300, overflowY: 'scroll', padding: 20 }}>
                  {showMenuName.map((item, key) => <p key={key}>{item}</p>)}
                </Col>
                <Col span={1}></Col>
              </Row>
            </Spin>
          </Col>
        </Row>
        <Divider orientation="left">角色说明</Divider>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col xs={0} sm={1}></Col>
          <Col xs={24} sm={23}>
            <Input.TextArea placeholder='角色的一些补充说明' rows={4} value={rmk} onChange={({ target: { value } }) => this.setState({ rmk: value })} />
          </Col>
        </Row>
        <Divider></Divider>
        <Row gutter={16}><Col style={{ textAlign: 'right' }}>
          <Button type="primary" size='large' onClick={this.onSubmit} loading={submiting}>确定</Button>
        </Col></Row>
      </Form>
    )
  }
}

const RoleFormComponent = Form.create()(RoleComponent)


class RoleManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        mercCd: props.currentUser.mercCd,
        page: 1,
        size: 10,
        roleName: ''
      },
      visible: false,
      title: '',
      record: {}
    }
  }

  componentDidMount() {
    this.refresh()
    this.init()
  }

  queryChange = (key, val) => {
    const tmpObj = { page: 1 }
    tmpObj[key] = val
    this.setState({ query: Object.assign({}, this.state.query, tmpObj) })
  }

  init = () => {
    const { dispatch, loading } = this.props
    if (loading) return false
    dispatch({ type: 'roleManage/menuInfo', payload: {} })

  }

  refresh = () => {
    const { dispatch, loading } = this.props
    if (loading) return false
    dispatch({ type: 'roleManage/fetch', payload: this.state.query })
  }

  cancelModal = () => {
    this.setState({ visible: false })
  }

  showModal = (record, bool) => {
    if (bool) {
      this.setState({ visible: true, title: '修改角色', record })
    } else {
      this.setState({ visible: true, title: '添加角色', record: {} })
    }
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
        title: '角色编号',
        dataIndex: 'roleCd',
        key: 'roleCd',
      }, {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
      }, {
        title: '创建时间',
        dataIndex: 'creTime',
        key: 'creTime',
      }, {
        title: '角色说明',
        dataIndex: 'RMK',
        key: 'RMK',
      }, {
        title: '操作',
        key: 'handle',
        render: (record) => {
          return <a onClick={() => this.showModal(record, 1)}>修改</a>
        }
      }
    ]

    const { query, visible, title, record } = this.state
    const { total, list, loading, currentUser, dispatch, menuInfo, menuLoading } = this.props

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
        title="角色管理"
      >
        <Modal visible={visible} destroyOnClose={true} maskClosable={false} width={1000} onCancel={this.cancelModal} title={title} footer={null}>
          <RoleFormComponent
            record={record}
            menuInfo={menuInfo}
            menuLoading={menuLoading}
            cancelModal={this.cancelModal}
            mercCd={currentUser.mercCd}
            refresh={this.refresh}
            dispatch={dispatch} />
        </Modal>
        <Card bordered={false} title="查询条件">
          <Row gutter={24}>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>角色名称：</span>
              <Input className={styles.inputBox} placeholder="请输入角色名称"
                onChange={({ target: { value } }) => this.queryChange('roleName', value)} />
            </Col>
          </Row>
          <Divider style={{ marginTop: 0 }} dashed={true} />
          <Row style={{ textAlign: 'right' }}>
            <Button type="primary" icon="search" onClick={this.refresh} loading={loading}>查询</Button>
            <a target='_blank' className={'xs-hide'} style={{ marginLeft: 20 }} >
              <Button type="default" icon="plus" onClick={() => this.showModal(null, 0)}>添加角色</Button>
            </a>
          </Row>
        </Card>
        <Card bordered={false} title="查询结果" style={{ marginTop: '24px', minHeight: '420px' }}>
          <Row>
            <Col xs={0} md={0} lg={24}>
              <Table columns={columns} dataSource={list.map((item, idx) => {
                const { creDt, creTm, rmk } = item
                return Object.assign({}, item, {
                  key: idx,
                  creTime: formatTime(creDt, creTm),
                  RMK: rmk ? rmk : '-'
                })
              })} loading={loading} pagination={tablePagination} />
            </Col>
            <Col xs={24} md={24} lg={0}>
              <Table columns={[
                {
                  title: '角色名称',
                  dataIndex: 'roleName',
                  key: 'roleName',
                  width: '30%',
                  render: (text) => {
                    return <span key='roleName' style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>
                  }
                },
                {
                  title: '创建时间',
                  dataIndex: 'creTime',
                  key: 'creTime'
                },
                {
                  title: '操作',
                  key: 'handle',
                  render: (record) => {
                    return <a onClick={() => this.showModal(record, 1)}>修改</a>
                  }
                }
              ]} dataSource={list.map((item, idx) => {
                const { creDt, creTm } = item
                return Object.assign({}, item, {
                  key: idx,
                  creTime: formatTime(creDt, creTm)
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
  const { loading, list, total, menuInfo, menuLoading } = state.roleManage
  return { loading, list, total, menuInfo, menuLoading, currentUser: state.user.info }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(RoleManage)