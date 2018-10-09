import * as workSheetService from '../services/workSheet'
import xStorage from '../utils/xStorage'

import moment from 'moment'
import { notification } from 'antd'

export default {
  namespace: 'workSheet',

  state: {
    list: [],
    total: 0,
    statistics: {},
    fetchLoading: false,
    addLoading: false,
    addWorkSheetModal: false
  },

  reducers: {
    page(state, { payload: { list, total, statistics } }) {
      return { ...state, list, total, statistics }
    },
    detailData(state, { payload: { detail } }) {
      return { ...state, detail }
    },
    detailModalFlag(state, { payload: { show } }) {
      return { ...state, detailModal: show }
    },
    fetchLoading(state, { payload: { show } }) {
      return { ...state, fetchLoading: show }
    },
    addLoading(state, { payload: { show } }) {
      return { ...state, addLoading: show }
    },
    addWorkSheetModal(state, { payload: { show } }) {
      return { ...state, addWorkSheetModal: show }
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'fetchLoading', payload: { show: true } })
      try {
        const { dataList, dataStatistics, totalRecord } = yield call(workSheetService.fetch, payload)
        yield put({
          type: 'page',
          payload: {
            list: dataList,
            statistics: dataStatistics,
            total: totalRecord
          }
        })
        yield put({ type: 'fetchLoading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'fetchLoading', payload: { show: false } })
        throw error
      }
    },
    *add({ payload }, { call, put }) {
      yield put({ type: 'addLoading', payload: { show: true } })
      try {
        const res = yield call(workSheetService.add, payload)
        notification.success({ message: '工单添加成功' })
        yield put({ 
          type: 'fetch', 
          payload: { 
            page: 1,
            size: 10,
            beginDate: moment().subtract(10, 'days'),
            endDate: moment(),
            mercCd: xStorage.get('mercCd') 
          } 
        })
        yield put({ type: 'addLoading', payload: { show: false } })
        yield put({ type: 'addWorkSheetModal', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'addLoading', payload: { show: false } })
        throw error
      }
    },
    *toggle({ payload }, { call, put }) {
      yield put({ type: 'addWorkSheetModal', payload })
    }
  }
}
