
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form, Input, Alert, Button, Slider, Spin, message, Icon, Modal, Row, Col, notification } from 'antd'

import PassGuardComponent from './PassGuard'
import InputComponent from './Input'
import SendPhoneCode from './SendPhoneCode'
import request from '../utils/request'

class FindBackPayword extends Component {

  constructor(props) {
    super(props)
    this.state = {
      smsCode: '',
      submiting: false,
      initData: null,
      smsCode: ''

    }
    this.onsubmit = this.onsubmit.bind(this)
    this.setPayPwdVerify = this.setPayPwdVerify.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    request('/api/common/passGuardInit').then(data => {
      this.setState({ initData: data })
    }).catch(e => {
      notification.error({ message: '密码控件初始化失败' })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  setPayPwdVerify(callback) {
    const { passwordOcx_new, passwordOcx_re } = this.refs
    this.setState({ submiting: true })
    passwordOcx_new.pwdValid(data => {
      if (data.data == '1') {
        this.setState({ submiting: false })
        return notification.error({ message: '密码不符合规范' })
      }
      passwordOcx_new.pwdWeak(data => {
        if (data.data == '1') {
          this.setState({ submiting: false })
          return notification.error({ message: '您设置的密码太简单，无法保障账户安全，请重新设置' })
        }
        let new_hash, re_hash
        passwordOcx_new.pwdHash(data => {
          new_hash = data
          passwordOcx_re.pwdHash(data => {
            re_hash = data
            if (new_hash != re_hash) {
              this.setState({ submiting: false })
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
            message.info(err)
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

  onsubmit() {
    const { smsCode } = this.state
    if (!smsCode) return notification.error({ message: '请输入短信验证码' })
    const { mercCd, findBackPayword } = this.props
    this.setPayPwdVerify(result => {
        const { payPwd, randKey } = result
        this.setState({ submiting: true })
        request('/api/security/resetPayPwd', {
          method: 'POST', data: {
            mercCd,
            smsCode,
            payPwd,
            randKey
          }
        }).then(data => {
          this.setState({ submiting: false })
          notification.success({ message: '支付密码重置成功' })
          findBackPayword()
        }).catch(error => {
          if (error.number == '401') {
            notification.error({ message: error.message })
            this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
          } else {
            this.setState({ submiting: false })
            notification.error({ message: '支付密码修改失败，请稍后重试' })
          }
        })
    })
  }

  render() {

    const { initData, submiting, smsCode } = this.state
    const { phoneNo, mercCd } = this.props

    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col offset={2} span={8} style={{ textAlign: 'right' }}>接收验证码的手机号：</Col>
          <Col span={10}>
            <SendPhoneCode phoneNo={phoneNo} smsType={'01'} mercCd={mercCd} />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col offset={2} span={8} style={{ textAlign: 'right' }}>请输入验证码：</Col>
          <Col span={10}><Input placeholder='请输入验证码' onChange={e => this.setState({ smsCode: e.target.value })} value={smsCode} /></Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col offset={2} span={8} style={{ textAlign: 'right' }}>新支付密码：</Col>
          <Col span={10}>
            <InputComponent placeholder='请输入新支付密码(6位数字)' ref="passwordOcx_new" maxLength={6}>
              <PassGuardComponent initData={initData} pgeEreg2='[0-9]{6}' pgeId='payword_new' />
            </InputComponent>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col offset={2} span={8} style={{ textAlign: 'right' }}>确认新密码：</Col>
          <Col span={10}>
            <InputComponent placeholder='请再输一遍新密码' ref="passwordOcx_re" maxLength={6}>
              <PassGuardComponent initData={initData} pgeEreg2='[0-9]{6}' pgeId='payword_re' />
            </InputComponent>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col offset={2} span={8}></Col>
          <Col span={10}><Button type='primary' onClick={() => this.onsubmit()} loading={submiting}>确认修改</Button></Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { phoneNo, mercCd } = state.user.merchantInfo
  return { phoneNo, mercCd }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(FindBackPayword)