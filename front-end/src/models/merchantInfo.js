import * as merchantInfoService from '../services/merchantInfo'
import xStorage from '../utils/xStorage'

import moment from 'moment'
import { notification } from 'antd'

export default {
  namespace: 'merchantInfo',

  state: {
    list: [],
    total: 0,
    busiInfo: {},
    stateInfo: {},
    feePageLoading: false,
    stateInfoLoading: false,
    busiInfoLoading: false,
    contactInfoModal: false,
    stateInfoModal: false,
    mercInfoUpdating: false,
    stateInfoUpdating: false
  },

  reducers: {
    feePageLoading(state, { payload: { show } }) {
      return { ...state, feePageLoading: show }
    },
    stateInfoLoading(state, { payload: { show } }) {
      return { ...state, stateInfoLoading: show }
    },
    busiInfoLoading(state, { payload: { show } }) {
      return { ...state, busiInfoLoading: show }
    },
    feePageInfo(state, { payload: { list, total } }) {
      return { ...state, list, total }
    },
    mercBusiInfo(state, { payload: { busiInfo } }) {
      return { ...state, busiInfo }
    },
    mercStateInfo(state, { payload: { stateInfo } }) {
      return { ...state, stateInfo }
    },
    contactInfoModal(state, { payload: { show } }) {
      return { ...state, contactInfoModal: show }
    },
    mercInfoUpdating(state, { payload: { show } }) {
      return { ...state, mercInfoUpdating: show }
    },
    stateInfoModal(state, { payload: { show } }) {
      return { ...state, stateInfoModal: show }
    },
    stateInfoUpdating(state, { payload: { show } }) {
      return { ...state, stateInfoUpdating: show }
    }
  },

  effects: {
    *mercFeePage({ payload }, { call, put }) {
      try {
        yield put({ type: 'feePageLoading', payload: { show: true }})
        const { dataList, totalRecord } = yield call(merchantInfoService.mercFeePage, payload)
        yield put({ 
            type: 'feePageInfo',
            payload: { list: dataList, total: totalRecord } 
        })
        yield put({ type: 'feePageLoading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'feePageLoading', payload: { show: false } })
        throw error
      }
    },
    *queryMercBusiInfo({ payload }, { call, put }) {
        try {
          yield put({ type: 'busiInfoLoading', payload: { show: true }})
          const res = yield call(merchantInfoService.mercBusiInfo, payload)
          yield put({ 
              type: 'mercBusiInfo', 
              payload: { busiInfo: res } 
            })
          yield put({ type: 'busiInfoLoading', payload: { show: false } })
        } catch(error) {
          yield put({ type: 'busiInfoLoading', payload: { show: false } })
          throw error
        }
    },
    *queryMerStateInfo({ payload }, { call, put }) {
        try {
          yield put({ type: 'stateInfoLoading', payload: { show: true }})
          const res = yield call(merchantInfoService.mercStateInfo, payload)
          yield put({ 
              type: 'mercStateInfo', 
              payload: { stateInfo: res } 
            })
          yield put({ type: 'stateInfoLoading', payload: { show: false } })
        } catch(error) {
          yield put({ type: 'stateInfoLoading', payload: { show: false } })
          throw error
        }
    },
    *mercInfoUpdate({ payload }, { call, put }) {
      try {
        yield put({ type: 'mercInfoUpdating', payload: { show: true } })
        let res = yield call(merchantInfoService.mercInfoUpdate, payload)
        if(res) {
          notification.success({ message: '信息修改成功' })
          yield put({ type: 'user/merchantBaseInfo', payload: { mercCd: xStorage.get('mercCd'), caVisible: 'Y' } })
          yield put({ type: 'contactInfoModal', payload: { show: false } })
          yield put({ type: 'mercInfoUpdating', payload: { show: false } })
        }
      } catch(error) {
        yield put({ type: 'mercInfoUpdating', payload: { show: false } })
        throw error
      }
    },
    *mercStateInfoUpdate({ payload }, { call, put }) {
      try {
        yield put({ type: 'stateInfoUpdating', payload: { show: true } })
        let res = yield call(merchantInfoService.mercStateInfoUpdate, payload)
        if(res) {
          notification.success({ message: '信息修改成功' })
          yield put({ type: 'queryMerStateInfo', payload: { mercCd: xStorage.get('mercCd') } })
          yield put({ type: 'stateInfoModal', payload: { show: false } })
          yield put({ type: 'stateInfoUpdating', payload: { show: false } })
        }
      } catch(error) {
        yield put({ type: 'stateInfoUpdating', payload: { show: false } })
        throw error
      }
    }
  }
}
