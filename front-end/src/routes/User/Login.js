import React, { Component } from 'react'
import { Checkbox, Icon, Spin, message, notification } from 'antd'
import styles from './Login.css'
import { Link, routerRedux } from 'dva/router'
import { connect } from 'dva'

import request from '../../utils/request'
import localStorage from '../../utils/localStorage'
import PassGuard from '../../components/PassGuard/'
import WavesContainer from '../../components/WavesContainer'

class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: false,
      value: props.defaultValue || ''
    }
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
    this.placeOnClick = this.placeOnClick.bind(this)
    this.onClear = this.onClear.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  onClear() {
    this.valueChange('')
    const { inputbox } = this.refs
    if (inputbox && inputbox.onClear) {
      inputbox.onClear()
    }
  }

  onFocus() {
    this.setState({
      focused: true
    })
  }

  onBlur() {
    this.setState({
      focused: false
    })
  }

  onChange(e) {
    this.valueChange(e.target.value)
  }

  valueChange(value) {
    this.setState({ value })
    const { onChange } = this.props
    if (onChange) {
      onChange(value)
    }
  }

  placeOnClick() {
    if (this.refs.inputbox) {
      let dom = this.refs.inputbox
      if (dom && dom.focus) {
        dom.focus()
      }
    }
  }

  onKeyDown(e) {
    if (e.keyCode == 13) {
      this.props.onPressEnter()
    }
  }

  getResult(callback, error) {
    const { inputbox } = this.refs
    inputbox.getResult(callback, error)
  }

  render() {
    const { focused, value } = this.state
    const { placeholder, autoFocus, maxLength, type, style, children } = this.props
    let placeholderWidth = 0

    if (this.refs.placeholder) {
      let dom = this.refs.placeholder
      
      placeholderWidth = dom.clientWidth
    }

    const inputProps = {
      className: styles.inputBox,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      ref: 'inputbox',
      autoComplete: 'off',
      onChange: this.onChange,
      autoFocus: autoFocus,
      type: type,
      maxLength: maxLength,
      value,
      onKeyDown: this.onKeyDown
    }
    
    return (
      <div className={`${styles.inputWrap}${focused ? ' ' + styles.inputFocused : ''}${value ? ' ' + styles.inputHasValue : ''}`}
        style={{ display: 'inline-block', width: '100%', ...style }}>
        <span className={styles.maskLine} style={{ width: (focused || value ? placeholderWidth : 0) + 'px' }} />
        <span className={styles.inputPlaceholder} ref="placeholder" onClick={this.placeOnClick}>{ placeholder }</span>
        {
          children ? React.cloneElement(children, inputProps) :
          <input {...inputProps} />
        }
        {
          value ? 
          <a className={styles.clearBtn} onClick={this.onClear}>
            <Icon type="close-circle" />
          </a>: null
        }
      </div>
    )
  }
}

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imgCode: '',
      imgCodeLoading: true,
      picKey: '',
      merc: localStorage.get('_LOGIN_MERC'),
      opr: localStorage.get('_LOGIN_OPR'),
      verCode: '',
      loginType: '01',
      submiting: false,
      remember: localStorage.get('_LOGIN_MERC') ? true : false,
      initData: null
    }
  }

  componentDidMount() {
    if (this.props.userAuthenticated) {
      // message.info('您已登录')
      this.props.dispatch(routerRedux.replace('/'))
      return false
    }
    this.getImgCode()
    this.init()
  }

  init() {
    request('/api/common/passGuardInit').then(data => {
      this.setState({ initData: data })
    }).catch(e => {
      console.error(e)
      notification.error({message: '密码控件初始化失败'})
    })
  }

  onSubmit = () => {
    const { submiting, merc, opr, verCode, loginType, picKey, remember } = this.state
    if (submiting) {
      return false
    }
    if (!merc || !verCode) {
      return false
    }
    if (!verCode) {
      return notification.error({ message: '验证码不能为空' })
    }
    const { passwordOcx } = this.refs
    if (passwordOcx) {
      this.setState({ submiting: true })
      passwordOcx.getResult(result => {
        const { rsa, address, randKey } = result
        request('/api/user/login', {
          method: 'POST',
          data: {
            merc, verCode, password: rsa, picKey, randKey,
            loginType, opr, addr: address
          }
        }).then(data => {
          if (data.errCode) {
            this.setState({ submiting: false })
            this.getImgCode()
            notification.error({ message: data.errCodeDesc })
          } else {
            if (remember) {
              localStorage.set('_LOGIN_MERC', merc)
              localStorage.set('_LOGIN_OPR', opr)
            } else {
              localStorage.remove('_LOGIN_MERC')
              localStorage.remove('_LOGIN_OPR')
            }
            this.props.dispatch({ type: 'user/update', payload: { info: data } })
            setTimeout(() => {
              this.props.dispatch(routerRedux.replace('/'))
            }, 100)
          }
        }).catch(e => {
          notification.error({ message: e.message })
          this.setState({ submiting: false })
          this.getImgCode()
        })
      }, e => {
        this.getImgCode()
        this.setState({ submiting: false })
        notification.error({ message: e.toString() })
      })
    }
  }
  
  getImgCode() {
    this.setState({ imgCodeLoading: true })
    request('/api/common/imgCode').then(data => {
      const { picBase64Str, picKey } = data
      this.setState({ imgCode: 'data:image/gif;base64,' + picBase64Str, picKey, imgCodeLoading: false })
    }).catch(e => {
      this.setState({ imgCodeLoading: false })
    })
  }

  render() {
    const { imgCode, imgCodeLoading, submiting, loginType, remember, merc, opr, verCode, initData } = this.state
    return (
      <div className={styles.container}>
        <div className={styles.containerMask}>
          <div className={styles.loginForm}>
            <div className={styles.formTitle}>
              <h1>商银信支付</h1>
            </div>
            <div className={styles.formTab}>
              <div className={`${styles.formTabItem} ${loginType == '01' ? styles.formTabItemActive : ''}`} 
                onClick={() => this.setState({ loginType: '01' })}>
                <WavesContainer>管理员登录</WavesContainer>
              </div>
              <div className={`${styles.formTabItem} ${loginType == '02' ? styles.formTabItemActive : ''}`} 
                onClick={() => this.setState({ loginType: '02' })}>
                <WavesContainer>操作员登录</WavesContainer>
              </div>
            </div>
            <div style={{ padding: '25px' }}>
              <div className={styles.formItem}>
                <div style={{ display: loginType == '02' ? 'flex' : 'none' }}>
                  <Input placeholder="操作员编号" defaultValue={opr} maxLength={16} onChange={val => this.setState({ opr: val })} style={{ flex: '1.1' }} />
                  <span style={{ height: '45px', lineHeight: '45px', padding: '0 5px', color: '#999', fontWeight: 'bold', fontStyle: 'italic' }}>@</span>
                  <Input placeholder="商户编号" defaultValue={merc} maxLength={16} onChange={val => this.setState({ merc: val })} style={{ flex: '1.9' }}  />
                </div>
                <div style={{ display: loginType == '01' ? 'flex' : 'none' }}>
                  <Input placeholder="商户编号" defaultValue={merc} maxLength={16} onChange={val => this.setState({ merc: val })} />
                </div>  
              </div>
              
              <div className={styles.formItem}>
                <Input placeholder="密码" ref="passwordOcx">
                  <PassGuard initData={initData} />
                </Input>
              </div>
              <div className={styles.formItem}>
                <Input placeholder="验证码" maxLength={8} style={{ width: 'calc(100% - 130px)' }} 
                  onChange={val => this.setState({ verCode: val })} onPressEnter={this.onSubmit} />
                <span className={styles.verCode} onClick={this.getImgCode.bind(this)}>
                  <Spin spinning={imgCodeLoading}>
                    <img src={imgCode} />
                  </Spin>
                </span>
              </div>
              <div className={styles.formItem} style={{ overflow: 'hidden' }}>
                <span style={{ float: 'left' }}>
                  <Checkbox style={{ color: '#7c7c7c' }} checked={remember} 
                    onChange={({ target: { checked } }) => this.setState({ remember: checked })}>记住我</Checkbox>
                </span>
                <Link to="" style={{ float: 'right' }}>忘记密码?</Link>
              </div>
              <div className={styles.formItem} style={{ marginTop: '25px', marginBottom: '5px' }}>
                <Spin spinning={submiting}>
                  <button className={styles.button} onClick={this.onSubmit}>
                    <WavesContainer>
                      <span>登 录</span>
                    </WavesContainer>
                  </button>
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userAuthenticated: state.user.authenticated
  }
}

const mapDispatchToProps = dispatch => {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)