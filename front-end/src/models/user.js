import * as userService from '../services/user'
import xStorage from '../utils/xStorage'

import { routerRedux } from 'dva/router'
import { notification } from 'antd'
import SendPhoneCode from '../components/SendPhoneCode';

export default {
  namespace: 'user',

  state: {
    info: {
      oprCd: xStorage.get('oprCd') || '',
      mercCd: xStorage.get('mercCd') || ''
    },
    authenticated: xStorage.get('oprCd') ? true : false,
    loading: false,
    merchantInfo: { merchantLoading: true },
  },
  
  reducers: {
    update(state, { payload: { info, authenticated = true } }) {
      if (authenticated === false) {
        xStorage.remove('oprCd')
        xStorage.remove('mercCd')
      } else {
        const { oprCd, mercCd } = info
        xStorage.set('oprCd', oprCd)
        xStorage.set('mercCd', mercCd)
      }
      return { ...state, info, authenticated }
    },
    merchantInfo(state, { payload: { merchantInfo } }) {
      return { ...state, merchantInfo }
    },
    loading(state, { payload: { show } }) {
      return { ...state, loading: show }
    }
  },
  
  effects: {
    *fetch({ payload: { mercCd, oprCd } }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const data = yield call(userService.fetch, { mercCd, oprCd })
        yield put({ type: 'update', payload: { info: data }})
        yield put({ type: 'loading', payload: { show: false }})
      } catch(error) {
        yield put({ type: 'loading', payload: { show: false }})
        throw error
      }
    }, 
    *merchantBaseInfo({ payload }, { call, put }) {
      try {
        const data = yield call(userService.merchantBaseInfo, payload)
        yield put({ type: 'merchantInfo', payload: { merchantInfo: {...data, merchantLoading: false } }})
      } catch(error) {
        yield put({ type: 'merchantInfo', payload: { merchantInfo: { merchantLoading: false } }})
        throw error
      }
    }
  }  
}
