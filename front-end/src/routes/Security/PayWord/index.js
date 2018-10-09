import React, { Component } from 'react'
import { connect } from 'dva'
import {
  Form, Input, Button, Card, notification, Spin, Modal
} from 'antd'

import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import styles from './index.less'

import InputComponent from '../../../components/Input'
import PassGuardComponent from '../../../components/PassGuard'
import Result from '../../../components/Result'
import FindBackPayword from '../../../components/FindBackPayword'

import request from '../../../utils/request'

class PayWord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initData: null,
      fetching: false,
      result: false,
      showTxt: '',
      forgetPayWordModal: false
    }
  }

  componentDidMount() {
    this._isMounted = true
    request('/api/common/passGuardInit').then(data => {
      this.setState({ initData: data })
    }).catch(e => {
      console.error(e)
      notification.error({ message: '密码控件初始化失败' })
    })
  }

  componentWillMount() {
    this._isMounted = false
  }

  //修改支付密码
  modifyPayPwdVerify = (callback) => {
    const { passwordOcx_old, passwordOcx_new, passwordOcx_re } = this.refs
    this.setState({ fetching: true })
    passwordOcx_new.pwdValid(data => {
      if (data.data == '1') {
        this.setState({ fetching: false })
        return notification.error({ message: '密码不符合规范' })
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
                let randKey = data.randKey, newPayPwd, oldPayPwd, rePayPwd
                passwordOcx_old.getRSA(randKey, data => {
                  oldPayPwd = data.rsa
                  passwordOcx_new.getRSA(randKey, data => {
                    newPayPwd = data.rsa
                    passwordOcx_re.getRSA(randKey, data => {
                      rePayPwd = data.rsa
                      if (!oldPayPwd || !newPayPwd || !rePayPwd) return notification.error({ message: '请确认输入完成' })
                      callback({ oldPayPwd, newPayPwd, randKey })
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
                notification.error({ message: '获取密文出错' })
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

  //设置支付密码
  setPayPwdVerify = (callback) => {
    const { passwordOcx_new, passwordOcx_re } = this.refs
    this.setState({ fetching: true })
    passwordOcx_new.pwdValid(data => {
      if (data.data == '1') {
        this.setState({ fetching: false })
        return notification.error({ message: '密码不符合规范' })
      }
      passwordOcx_new.pwdWeak(data => {
        if (data.data == '1') {
          this.setState({ fetching: false })
          return notification.error({ message: '您设置的密码太简单，无法保障账户安全，请重新设置' })
        }
        let new_hash, re_hash
        passwordOcx_new.pwdHash(data => {
          new_hash = data
          passwordOcx_re.pwdHash(data => {
            re_hash = data
            if (new_hash != re_hash) {
              this.setState({ fetching: false })
              return notification.error({ message: '两次密码不一致' })
            }
            request('/api/common/passGuardAes').then(data => {
              let randKey = data.randKey, payPwd, rePayPwd
              passwordOcx_new.getRSA(randKey, data => {
                payPwd = data.rsa
                passwordOcx_re.getRSA(randKey, data => {
                  rePayPwd = data.rsa
                  if (!payPwd || !rePayPwd) return notification.error({ message: '请确认输入完成' })
                  callback({ payPwd, randKey })
                }, err => {
                  this.setState({ fetching: false })
                  notification.error({ message: err })
                })
              }, err => {
                this.setState({ fetching: false })
                notification.error({ message: err })
              })
            }).catch(error => {
              this.setState({ fetching: false })
              notification.error({ message: '获取密文出错' })
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

  submit = () => {
    const { info, merchantInfo } = this.props
    if (merchantInfo.payPwdFlag == '1') { //修改支付密码
      this.modifyPayPwdVerify(result => {
        const { oldPayPwd, newPayPwd, randKey } = result
        this.setState({ fetching: true })
        request('/api/security/modifyPayPwd', {
          method: 'POST', data: {
            mercCd: info.mercCd,
            oldPayPwd,
            newPayPwd,
            randKey
          }
        }).then(data => {
          this.setState({ fetching: false, result: true, showTxt: '修改' })
        }).catch(error => {
          if (error.number == '401') {
            notification.error({ message: error.message })
            this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
          } else {
            this.setState({ fetching: false })
            notification.error({ message: '支付密码修改失败，请稍后重试' })
          }
        })
      })
    } else {
      this.setPayPwdVerify(result => {
        const { payPwd, randKey } = result
        this.setState({ fetching: true })
        request('/api/security/setPayPwd', {
          method: 'POST', data: {
            mercCd: info.mercCd,
            payPwd,
            randKey
          }
        }).then(data => {
          this.setState({ fetching: false, result: true, showTxt: '设置' })
        }).catch(error => {
          if (error.number == '401') {
            notification.error({ message: error.message })
            this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
          } else {
            this.setState({ fetching: false })
            notification.error({ message: '支付密码设置失败，请稍后重试' })
          }
        })
      })
    }
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
    const { initData, fetching, result, showTxt, forgetPayWordModal } = this.state
    return (
      <PageHeaderLayout title="支付密码">
        <Modal visible={forgetPayWordModal} title='找回支付密码' width={800} footer={null} destroyOnClose={true} maskClosable={false}
          onCancel={() => this.setState({ forgetPayWordModal: false })}>
          <div style={{ padding: 30 }}>
            <FindBackPayword findBackPayword={() => this.setState({ forgetPayWordModal: false })} />
          </div>
        </Modal>
        <Card bordered={false} style={{ minHeight: 650 }}>
          <div style={{ margin: '0 auto', paddingTop: 50 }}>
            {
              !result ?
                <Form>
                  {
                    this.props.merchantInfo.payPwdFlag == '1' ? <Form.Item {...formItemLayout} label='原支付密码' style={{ position: 'relative' }}>
                      <InputComponent placeholder='请输入原支付密码' ref="passwordOcx_old" maxLength={6}>
                        <PassGuardComponent pgeEreg2='[0-9]{6}' pgeId='payword_old' initData={initData} />
                      </InputComponent>
                      <a style={{ position: 'absolute', top: '-10px', right: '-130px' }} onClick={() => this.setState({ forgetPayWordModal: true })}>忘记支付密码？</a>
                    </Form.Item> : null
                  }
                  <Form.Item {...formItemLayout} label='新支付密码'>
                    <InputComponent placeholder='请输入新支付密码(6位数字)' ref="passwordOcx_new" maxLength={6}>
                      <PassGuardComponent pgeEreg2='[0-9]{6}' pgeId='payword_new' initData={initData} />
                    </InputComponent>
                  </Form.Item>
                  <Form.Item {...formItemLayout} label='确认新密码'>
                    <InputComponent placeholder='请再输一遍新密码' ref="passwordOcx_re" maxLength={6}>
                      <PassGuardComponent pgeEreg2='[0-9]{6}' pgeId='payword_re' initData={initData} />
                    </InputComponent>
                  </Form.Item>
                  <Form.Item style={{ marginTop: 50 }} {...tailFormItemLayout}>
                    <Button type='primary' size='large' style={{ width: '100%' }} onClick={this.submit} loading={fetching}>
                      {this.props.merchantInfo.payPwdFlag == '1' ? '修改支付密码' : '设置支付密码'}</Button>
                  </Form.Item>
                </Form> :
                <Result type="success"
                  title={`支付密码${showTxt}成功`}
                />
            }
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}

function mapStateToProps(state) {
  const { info, merchantInfo } = state.user
  return {
    info, merchantInfo
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(PayWord)


