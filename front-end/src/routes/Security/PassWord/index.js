import React, { Component } from 'react'
import { connect } from 'dva'
import {
  Form, Input, Button, Card, notification, Spin
} from 'antd'

import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import styles from './index.less'

import InputComponent from '../../../components/Input'
import PassGuardComponent from '../../../components/PassGuard'

import request from '../../../utils/request'

class PassWord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initData: null,
      fetching: false
    }
  }

  componentDidMount() {
    this._isMounted = true
    request('/api/common/passGuardInit').then(data => {
      this.setState({ initData: data })
    }).catch(e => {
      console.error(e)
      notification.error({message: '密码控件初始化失败'})
    })
  }

  componentWillMount() {
    this._isMounted = false
  }

  submit = () => {
    const { passwordOcx_old, passwordOcx_new, passwordOcx_re } = this.refs
    this.setState({ fetching: true })
    passwordOcx_new.pwdValid(data => {
      if(data.data == '1') {
        this.setState({ fetching: false })
        return notification.error({ message: '密码不符合规范，新密码长度应在8-20位之间，且至少包含数字、字母和特殊字符中的任意2种' })
      }
      passwordOcx_new.pwdWeak(data => {
        if (data.data == '1') {
          this.setState({ fetching: false })
          return notification.error({ message: '您设置的密码太简单，无法保障账户安全，请重新设置' })
        }
        let old_hash, new_hash, re_hash
        passwordOcx_old.pwdHash(data => {
          old_hash = data
          passwordOcx_new.pwdHash(data => {
            new_hash = data
            passwordOcx_re.pwdHash(data => {
              re_hash = data
              if (old_hash == new_hash) {
                this.setState({ fetching: false })
                return notification.error({ message: '新密码不能跟原密码相同' })
              }
              if (new_hash != re_hash) {
                this.setState({ fetching: false })
                return notification.error({ message: '两次密码不一致' })
              }
              request('/api/common/passGuardAes').then(data => {
                let randKey = data.randKey, newLoginPwd, oldLoginPwd, reLoginPwd
                passwordOcx_old.getRSA(randKey, data => {
                  oldLoginPwd = data.rsa
                  passwordOcx_new.getRSA(randKey, data => {
                    newLoginPwd = data.rsa
                    passwordOcx_re.getRSA(randKey, data => {
                      reLoginPwd = data.rsa
                      this.modifyPassword({ randKey, newLoginPwd, oldLoginPwd })
                    }, err => {
                      this.setState({ fetching: false })
                      notification.error({ message: err })
                    })
                  }, err => {
                    this.setState({ fetching: false })
                    notification.error({ message: err })
                  })
                }, err => {
                  this.setState({ fetching: false })
                  notification.error({ message: err })
                })
              }).catch(e => {
                this.setState({ fetching: false })
                notification.error({ message: e.message })
              })
            }, err => {
              this.setState({ fetching: false })
              notification.error({ message: err })
            })
          }, err => {
            this.setState({ fetching: false })
            notification.error({ message: err })
          })
        }, err => {
          this.setState({ fetching: false })
          notification.error({ message: err })
        })
      }, err => {
        this.setState({ fetching: false })
        notification.error({ message: err })
      })
    }, err => {
      this.setState({ fetching: false })
      notification.error({ message: err })
    })
  }

  modifyPassword = (result) => {
    const { mercCd, oprCd } = this.props.currentUser
    const { oldLoginPwd, newLoginPwd, randKey } = result
    this.setState({ fetching: true })
    request('/api/security/modifyLoginPwd', { method: 'POST', data: {
      mercCd,
      oprCd,
      oldLoginPwd,
      newLoginPwd,
      randKey
    } }).then(data => {
      this.setState({ fetching: false })
      notification.success({ message: '密码修改成功，请重新登录' })
      setTimeout(() => {
        this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
      }, 100)
    }).catch(error => {
      if (error.number == '401') {
        notification.error({ message: error.message })
        this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
      } else {
        this.setState({ fetching: false })
        notification.error({ message: '密码修改失败，请稍后重试' })
      }
    })
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        span: 8,
        offset: 8
      }
    }
    const { initData, fetching } = this.state
    return (
      <PageHeaderLayout title="登录密码">
        <Card bordered={false} style={{ minHeight: 650 }}>
          <div style={{ margin: '0 auto', paddingTop: 50 }}>
            <Spin spinning={fetching}>
              <Form>
                <Form.Item {...formItemLayout} label='原登录密码' style={{ position: 'relative' }}>
                  <InputComponent placeholder='请输入原登录密码' ref="passwordOcx_old" maxLength={20}>
                    <PassGuardComponent pgeId='passwordOcx_old' initData={initData} />
                  </InputComponent>
                </Form.Item>
                <Form.Item {...formItemLayout} label='新登录密码'>
                  <InputComponent placeholder='请输入新登录密码' ref="passwordOcx_new" maxLength={20}>
                    <PassGuardComponent pgeId='passwordOcx_new' initData={initData} />
                  </InputComponent>
                </Form.Item>
                <Form.Item {...formItemLayout} label='确认新密码'>
                  <InputComponent placeholder='请再输一遍新密码' ref="passwordOcx_re" maxLength={20}>
                    <PassGuardComponent pgeId='passwordOcx_re' initData={initData} />
                  </InputComponent>
                </Form.Item>
                <Form.Item style={{ marginTop: 50 }} {...tailFormItemLayout}>
                  <Button type='primary' size='large' style={{ width: '100%' }} loading={fetching} onClick={this.submit}>修改登录密码</Button>
                </Form.Item>
              </Form>
            </Spin>
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.info
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(PassWord)


