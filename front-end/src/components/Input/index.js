import React, { Component } from 'react'
import { Icon, Spin, notification } from 'antd'
import Styles from './index.less'
import { connect } from 'react-redux'


class InputComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: false,
      isValue: false,
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
    if(e.target.value) {
      this.setState({ isValue: true })
    } else {
      this.setState({ isValue: false })
    }
    
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

  getRSA(randKey, callback, error) {
    const { inputbox } = this.refs
    inputbox.getRSA(randKey, callback, error)
  }

  pwdHash(callback, error) {
    const { inputbox } = this.refs
    inputbox.pwdHash(callback, error)
  }

  pwdWeak(callback, error) {
    const { inputbox } = this.refs
    inputbox.pwdWeak(callback, error)
  }

  pwdValid(callback, error) {
    const { inputbox } = this.refs
    inputbox.pwdValid(callback, error)
  }

  pwdStrength(callback, error) {
    const { inputbox } = this.refs
    inputbox.pwdStrength(callback, error)
  }

  render() {
    const { focused, value, isValue } = this.state
    const { placeholder, autoFocus, maxLength, type, style, children } = this.props
    let placeholderWidth = 0

    if (this.refs.placeholder) {
      let dom = this.refs.placeholder
      
      placeholderWidth = dom.clientWidth
    }

    const inputProps = {
      className: Styles.inputBox,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      ref: 'inputbox',
      autoComplete: 'off',
      onChange: this.onChange,
      autoFocus: autoFocus,
      type: type,
      maxLength: maxLength,
      value,
      onKeyDown: this.onKeyDown,
      placeholder,
    }

    return (
      <div className={Styles.inputWrap} style={{ display: 'inline-block', width: '100%', ...style }}>
        {/* { isValue ? null : <span className={Styles.inputPlaceholder} ref="placeholder" onClick={this.placeOnClick}>{ placeholder }</span>} */}
        {
          children ? React.cloneElement(children, inputProps) :
          <input {...inputProps} />
        }
      </div>
    )
  }
}

export default InputComponent
