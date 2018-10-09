import * as chargeListService from '../services/chargeList'
import xStorage from '../utils/xStorage'

export default {
  namespace: 'chargeList',

  state: {
    list: [],
    total: 0,
    statistics: {},
    loading: false,
    detail: {},
    detailModal: false
  },

  reducers: {
    save(state, { payload: { list, total, statistics } }) {
      return { ...state, list, total, statistics }
    },
    detailData(state, { payload: { detail } }) {
      return { ...state, detail }
    },
    detailModalFlag(state, { payload: { show } }) {
      return { ...state, detailModal: show }
    },
    loading(state, { payload: { show } }) {
      return { ...state, loading: show }
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const { dataList, dataStatistics, totalRecord } = yield call(chargeListService.fetch, payload)
        yield put({
          type: 'save',
          payload: {
            list: dataList,
            statistics: dataStatistics,
            total: totalRecord
          }
        })
        yield put({ type: 'loading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    },
    *detail({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const detail = yield call(chargeListService.detailFetch, payload)
        yield put({
          type: 'detailData',
          payload: {
            detail
          }
        })
        yield put({ type: 'loading', payload: { show: false } })
        yield put({ type: 'detailModalFlag', payload: { show: true } })
      } catch(error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    }
  }
}
