import * as oprManageService from '../services/oprManage'
import xStorage from '../utils/xStorage'

import moment from 'moment'
import { notification } from 'antd'

export default {
  namespace: 'oprManage',

  state: {
    loading: false,
    list: [],
    total: '',
    addOprModal: false,
    statusList: [],
    statusTotal: '',
    statusLoading: false
  },

  reducers: {
    loading(state, { payload: { show } }) {
      return { ...state, loading: show }
    },
    save(state, { payload: { list, total } }) {
      return { ...state, list, total }
    },
    status(state, { payload: { statusList, statusTotal } }) {
      return { ...state, statusList, statusTotal }
    },
    statusLoading(state, { payload: { show } }) {
      return { ...state, statusLoading: show }
    },
    addOprModal(state, { payload: { show } }) {
      return { ...state, addOprModal: show }
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try {
        yield put({ type: 'loading', payload: { show: true } })
        const { dataList, totalRecord } = yield call(oprManageService.fetch, payload)
        yield put({
          type: 'save',
          payload: { list: dataList, total: totalRecord }
        })
        yield put({ type: 'loading', payload: { show: false } })
      } catch (error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    },
    *statusPage({ payload }, { call, put }) {
      try {
        yield put({ type: 'statusLoading', payload: { show: true } })
        const { dataList, totalRecord } = yield call(oprManageService.statusPage, payload)
        yield put({
          type: 'status',
          payload: { statusList: dataList, statusTotal: totalRecord }
        })
        yield put({ type: 'statusLoading', payload: { show: false } })
      } catch (error) {
        yield put({ type: 'statusLoading', payload: { show: false } })
        throw error
      }
    }
  }  
}
