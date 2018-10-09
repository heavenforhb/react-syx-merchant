import * as oprInfoService from '../services/oprInfo'
import xStorage from '../utils/xStorage'

import moment from 'moment'
import { notification } from 'antd'

export default {
  namespace: 'oprInfo',

  state: {
    baseInfoModal: false,
    reseInfoModal: false,
    updateOprLoading: false,
    setReseInfoLoading: false
  },

  reducers: {
    baseInfoModal(state, { payload: { show } }) {
      return { ...state, baseInfoModal: show }
    },
    reseInfoModal(state, { payload: { show } }) {
        return { ...state, reseInfoModal: show }
    },
    updateOprLoading(state, { payload: { show } }) {
      return { ...state, updateOprLoading: show }
    },
    setReseInfoLoading(state, { payload: { show } }) {
      return { ...state, setReseInfoLoading: show }
    }
  },

  effects: {
    *baseModal({ payload }, { call, put }) {
      yield put({ type: 'baseInfoModal', payload })
    },
    *reseModal({ payload }, { call, put }) {
        yield put({ type: 'reseInfoModal', payload })
    },
    *oprInfoNormalUpdate({ payload }, { call, put }) {
      try {
        yield put({ type: 'updateOprLoading', payload: { show: true }})
        const data = yield call(oprInfoService.oprInfoNormalUpdate, payload)
        notification.success({ message: '信息修改成功' })
        yield put({ type: 'baseModal', payload: { show: false } })
        yield put({ type: 'user/fetch', payload: { mercCd: xStorage.get('mercCd'), oprCd: xStorage.get('oprCd') } })
        yield put({ type: 'updateOprLoading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'updateOprLoading', payload: { show: false } })
        throw error
      }
    },
    *setReseInfolUpdate({ payload }, { call, put }) {
      try {
        yield put({ type: 'setReseInfoLoading', payload: { show: true } })
        const data = yield call(oprInfoService.setReseInfo, payload)
        notification.success({ message: '预留信息设置成功' })
        yield put({ type: 'user/merchantBaseInfo', payload: { mercCd: xStorage.get('mercCd'), caVisible: 'Y' } })
        yield put({ type: 'reseModal', payload: { show: false } })
        yield put({ type: 'setReseInfoLoading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'setReseInfoLoading',payload: { show: false } })
        throw error
      }
    }
  }
}
