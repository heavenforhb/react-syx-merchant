import React, { Component } from 'react'
import { message, Icon, Spin, notification, Input } from 'antd'
import request from '../../utils/request'

import styles from './index.less'

import { getData, getEnStr } from '../../utils/passGuardLib'

import { getBrowser } from '../../utils/utils'

class PassGuard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      installed: false,
      ocxUrl: 'https://newenterprise.allscore.com/ocx/AllscoreEdge.exe',
      pgeRZRandNum: '',
      CIJSON: { 'interfacetype': 0, 'data': { 'switch': 3 } },
      OPJSON: { 'interfacetype': 0, 'data': { 'switch': 0 } },
      ICJSON: { 'interfacetype': 0, 'data': { 'switch': 2 } },
      INCJSON: { 'interfacetype': 1, 'data': {} },
      XTJSON: { 'interfacetype': 0, 'data': { 'switch': 5 } },
      CPJSON: { 'interfacetype': 0, 'data': { 'switch': 1 } },
      CLPJSON: { 'interfacetype': 0, 'data': { 'switch': 4 } },
      OUTJSON: { 'interfacetype': 2, 'data': {} },
      licenseMac: '',
      licenseWin: '',
      rsaPublicKey: '',
      pgeEdittype: 0,
      pgeMaxLength: props.maxLength || 20,
      pgeEreg1: props.pgeEreg1 || '[\\s\\S]*',
      pgeEreg2: props.pgeEreg2 || '[\\s\\S]{8,20}',
      inFlag: false,
      onceInterv: '',
      iterArray: [],
      value: '',
      pgeId: props.pgeId + new Date().getTime() || 'ocx_password' + new Date().getTime(),
      pgeEdgeVersion: '1.0.0.4',
      pgeVersion: '',
      browser: getBrowser(),
      initialized: false
    }
    this.pgeOnFocus = this.pgeOnFocus.bind(this)
    this.pgeOnBlur = this.pgeOnBlur.bind(this)
    this.pgeOnClick = this.pgeOnClick.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  setMyState(obj, callback) {
    if (this._isMounted) {
      this.setState(obj, callback)
    } else {
      return false
    }
  }

  componentWillReceiveProps(nextProps) {
    const { initData } = nextProps
    if (!this.state.initialized && initData && typeof initData == 'object') {
      this.init(initData)
    }
  }

  init(initData) {
    if (!initData) return false
    const { randKey, randData, licenseMac, licenseWin, rsaPublicKey } = initData
    this.setMyState({
      initialized: true,
      pgeRZRandNum: randKey, pgeRZDataB: randData,
      licenseMac, licenseWin, rsaPublicKey, onceInterv: ''
    }, this.checkInstall)
  }

  checkInstall() {
    const { pgeRZRandNum, pgeRZDataB, CIJSON, pgeId } = this.state
    CIJSON.id = pgeId
    const datac = getEnStr(pgeRZRandNum, CIJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON,
      (data) => {
        this.setMyState({ loading: false, installed: true, pgeVersion: data.data }, this.installControl)
      },
      () => this.setMyState({ installed: false, loading: false })
    )
  }

  installControl() {
    const { pgeRZRandNum, pgeRZDataB, pgeId, ICJSON } = this.state
    ICJSON.id = pgeId
    const datac = getEnStr(pgeRZRandNum, ICJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON,
      data => {
        if (data.code == '0') {
          const pgeEle = this.getPgeElement()
          if (pgeEle) {
            pgeEle.onkeypress = () => this.state.inFlag
            this.initControl()
          }

        } else {
          message.error('密码控件加载失败')
        }
      },
      () => message.error('密码控件加载失败')
    )
  }

  onClear() {
    this.pwdClear()
  }

  pwdClear() {
    const { CLPJSON, pgeRZRandNum, pgeRZDataB, pgeId } = this.state
    CLPJSON.id = pgeId
    const datac = getEnStr(pgeRZRandNum, CLPJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON,
      data => {
        this.setState({ value: '' })
      }
    )
  }

  openProt() {
    const { pgeRZRandNum, pgeRZDataB, OPJSON, pgeId, onceInterv, iterArray } = this.state
    OPJSON.id = pgeId
    const datac = getEnStr(pgeRZRandNum, OPJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON,
      data => {
        this.setState({ inFlag: true })
      }
    )
    if (typeof onceInterv == 'string') {
      let tmpInterv = window.setInterval(() => this.intervlOut(), 800)
      this.setState({ onceInterv: tmpInterv })
    }
  }

  intervlOut() {
    const { pgeRZDataB, XTJSON, pgeRZRandNum, pgeId } = this.state
    XTJSON.id = pgeId
    const datac = getEnStr(pgeRZRandNum, XTJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON,
      data => {
        let y = ''
        for (let i = 0, len = parseInt(data.data); i < len; i++) y += '*'
        this.setState({ value: y })
      }
    )
  }

  pwdSetSk(sKey, callback, error) {
    const { pgeRZRandNum, pgeRZDataB, pgeId } = this.state
    const INCJSON = { 'interfacetype': 1, data: {} }
    INCJSON.id = pgeId
    INCJSON.data.aeskey = sKey
    const datac = getEnStr(pgeRZRandNum, INCJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON,
      data => callback && callback(),
      e => error && error(e)
    )
  }

  pwdResultRsa(callback, error) {
    const { pgeRZRandNum, pgeRZDataB, pgeId, OUTJSON } = this.state
    OUTJSON.id = pgeId
    OUTJSON.data.datatype = 7
    OUTJSON.data.encrypttype = 4
    const datac = getEnStr(pgeRZRandNum, OUTJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON,
      data => {
        if (data.code == '0') {
          callback && callback(data.data)
        } else {
          let msg = ''
          switch (data.code) {
            case 4:
              msg = '密码不能为空'
              break
            default:
              msg = '获取密文失败'
              break
          }
          error && error(msg)
        }
      },
      e => error && error(e)
    )
  }

  machineNetwork(callback) {
    const { pgeRZRandNum, pgeRZDataB, pgeId, OUTJSON } = this.state
    OUTJSON.id = pgeId
    OUTJSON.data.datatype = 9
    OUTJSON.data.encrypttype = 0
    const datac = getEnStr(pgeRZRandNum, OUTJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON,
      data => {
        if (data.code == '0') {
          callback && callback(data.data)
        }
      }
    )
  }

  getConvertVersion(version) {
    const { config, browser } = this.state
    try {
      if (!version) {
        return 0
      } else {
        let flag = false, m = ''
        if (browser.code == 1 || browser.code == 3) {
          if (version.indexOf(',') > -1) flag = true
        }
        m = version.split((flag ? ',' : '.'))
        return parseInt(m[0] * 1000) + parseInt(m[1] * 100) + parseInt(m[2] * 10) + parseInt(m[3])
      }
    } catch (e) {
      return 0
    }
  }

  getResult(callback, error) {
    const { installed } = this.state
    if (!installed) {
      return error && error('请先安装密码控件')
    }
    request('/api/common/passGuardAes').then(data => {
      const { randKey } = data
      this.pwdSetSk(randKey,
        () => this.pwdResultRsa(
          rsa => this.machineNetwork(address => {
            callback && callback({
              rsa, address, randKey
            })
          }),
          e => {
            error && error(e)
          }
        ),
        e => {
          error && error('获取密文失败: 02')
        }
      )
    }).catch(e => {
      error && error('获取密文失败: 01')
    })
  }

  setCX() {
    const pgeEle = this.getPgeElement()
    let caretPos = 0, len = pgeEle.value.length

    if (window.document.selection) {
      let sel = document.selection.createRange()
      sel.moveStart('character', -len)
      caretPos = sel.text.length
    } else if (pgeEle.selectionStart || pgeEle.selectionStart == '0') {
      caretPos = pgeEle.selectionStart
    }

    if (caretPos <= len) {
      if (pgeEle.setSelectionRange) {
        setTimeout(() => pgeEle.setSelectionRange(len, len), 1)
      } else if (pgeEle.createTextRange) {
        let range = pgeEle.createTextRange()
        range.collapse(true)
        range.moveEnd('character', len)
        range.moveStart('character', len)
        range.select()
      }
    }
  }

  closeProt() {
    const { pgeRZRandNum, pgeRZDataB, CPJSON, pgeId, onceInterv, iterArray } = this.state
    CPJSON.id = pgeId
    const datac = getEnStr(pgeRZRandNum, CPJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON,
      data => this.setState({ inFlag: false })
    )
    if (typeof onceInterv == 'number') {
      window.clearInterval(onceInterv)
      this.setState({ onceInterv: '' })
    }
  }

  getPgeElement() {
    const { pgeId } = this.state
    return document.getElementById(pgeId)
  }

  pgeOnFocus() {
    this.openProt()
    this.setCX()
    this.props.onFocus()
  }

  pgeOnBlur() {
    this.closeProt()
    this.props.onBlur()
  }

  pgeOnClick() {
    this.setCX()
  }

  initControl() {
    const {
      INCJSON, licenseWin, licenseMac, pgeRZRandNum, pgeRZDataB,
      pgeId, rsaPublicKey, pgeEdittype, pgeMaxLength,
      pgeEreg1, pgeEreg2
    } = this.state

    INCJSON.id = pgeId
    INCJSON.data.edittype = pgeEdittype
    INCJSON.data.maxlength = pgeMaxLength
    INCJSON.data.reg1 = pgeEreg1
    INCJSON.data.reg2 = pgeEreg2
    INCJSON.data.rsakey = rsaPublicKey
    INCJSON.data.lic = { 'liccode': licenseWin, 'url': 'aHR0cDovLzE5Mi4xNjguMS4xMTg6ODA4Ny9EZW1vWF9BTExfQUVTL2xvZ2luLmpzcA==' }
    const datac = getEnStr(pgeRZRandNum, INCJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON)
  }

  onChange(e) {
    this.setState({ value: e.target.value })
    this.props.onChange(e)
  }

  pwdHash(callback, error) {
    const { OUTJSON, pgeRZRandNum, pgeRZDataB, pgeId } = this.state
    OUTJSON.id = pgeId
    OUTJSON.data.datatype = 2
    OUTJSON.data.encrypttype = 1
    let datac = getEnStr(pgeRZRandNum, OUTJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON, 
      data => {callback && callback(data.data)}, 
      e => error && error(e))
  }

  pwdWeak(callback, error) {
    const { OUTJSON, pgeRZRandNum, pgeRZDataB, pgeId } = this.state
    OUTJSON.id = pgeId
    OUTJSON.data.datatype = 900
    OUTJSON.data.encrypttype = 0
    let datac = getEnStr(pgeRZRandNum, OUTJSON)
    let RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON, 
      data => callback && callback(data), 
      e => error && error(e))
  }

  pwdValid(callback, error) {
    const { OUTJSON, pgeRZRandNum, pgeRZDataB, pgeId } = this.state
    OUTJSON.id = pgeId
    OUTJSON.data.datatype = 5
    OUTJSON.data.encrypttype = 0
    let datac = getEnStr(pgeRZRandNum, OUTJSON)
    const RZCIJSON = {
      rankey: pgeRZRandNum,
      datab: pgeRZDataB,
      datac: datac
    }
    getData(RZCIJSON, 
      data => callback && callback(data), 
      e => error && error(e))
  }

  getRSA(randKey, callback, error) {
    this.pwdSetSk(randKey, 
      () => this.pwdResultRsa(
        rsa => this.machineNetwork(address => {
          callback && callback({
            rsa, address, randKey
          })
        }),
        e => {
          error && error(e)
        }
      ),
      e => {
        error && error('获取密文失败: 02')
      }
    )
  }


  render() {
    const { installed, ocxUrl, value, pgeId, loading, pgeEdgeVersion, pgeVersion, browser } = this.state
    /* 控件地址安装 */
    let pgeDownloadLink = ''
    if (browser.code == 10) {
      pgeDownloadLink = '192.168.35.42/ocx/AllscoreEdge.exe'
    } else if (browser.code == 11) {
      pgeDownloadLink = '192.168.35.42/ocx/AllscoreEdge.pkg'
    }
    const { autoComplete, autoFocus, className, onBlur, onChange, onFocus, onKeyDown, placeholder, type } = this.props
    const inputProps = {
      autoComplete,
      autoFocus,
      className,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      placeholder,
      type
    }
    return (
      installed ? <div>{
        this.getConvertVersion(pgeVersion) < this.getConvertVersion(pgeEdgeVersion) ? <div className={styles.downLoadLinkWrap}>
          <Spin spinning={loading}>
            <a className={styles.downLoadLink} href={pgeDownloadLink} target="_blank">
              点击升级密码控件版本 <Icon type='download' />
            </a>
          </Spin>
        </div> : <input {...inputProps} id={pgeId} type="text" onFocus={this.pgeOnFocus} value={value}
          onBlur={this.pgeOnBlur} onClick={this.pgeOnClick} onChange={this.onChange} />}</div> :
        <div className={styles.downLoadLinkWrap}>
          <Spin spinning={loading}>
            <a className={styles.downLoadLink} href={pgeDownloadLink} target="_blank">
              请先安装密码控件 <Icon type='download' />
            </a>
          </Spin>
        </div>
    )
  }
}

export default PassGuard
