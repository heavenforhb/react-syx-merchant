import * as keyManageService from '../services/keyManage'
import xStorage from '../utils/xStorage'
import { notification } from 'antd'

export default {
  namespace: 'keyManage',

  state: {
    loading: false,
    publicKey: '',
    signType: ''
  },

  reducers: {
    save(state, { payload: { publicKey, signType } }) {
      return { ...state, publicKey, signType }
    },
    loading(state, { payload: { show } }) {
      return { ...state, loading: show }
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const { publicKey, signType } = yield call(keyManageService.fetch, payload)
        yield put({
          type: 'save',
          payload: { publicKey, signType }
        })
        yield put({ type: 'loading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    },
    *update({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const res = yield call(keyManageService.update, payload)
        if(res) {
          notification.success({ message: '商户公钥修改成功' }) 
          yield put({ type: 'fetch', payload: { mercCd: xStorage.get('mercCd') } })
        }else {
          notification.success({ message: '商户公钥修改失败，请稍后重试' }) 
        }
        yield put({ type: 'loading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    },
    *add({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const res = yield call(keyManageService.add, payload)
        if(res) {
          notification.success({ message: '商户公钥添加成功' }) 
          yield put({ type: 'fetch', payload: { mercCd: xStorage.get('mercCd') } })
        }else {
          notification.success({ message: '商户公钥添加失败，请稍后重试' }) 
        }
        yield put({ type: 'loading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    }
  }
}
