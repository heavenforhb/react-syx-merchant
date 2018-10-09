import * as merchantListService from '../services/merchantList'
import xStorage from '../utils/xStorage'

export default {
  namespace: 'merchantList',

  state: {
    list: [],
    total: 0,
    statistics: {},
    loading: false,
    detail: {},
    detailModal: false,
    url: ''
  },

  reducers: {
    save(state, { payload: { list, total, statistics } }) {
      return { ...state, list, total, statistics }
    },
    url(state, { payload: { url } }) {
      return { ...state, url }
    },
    loading(state, { payload: { show } }) {
      return { ...state, loading: show }
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const { dataList, dataStatistics, totalRecord } = yield call(merchantListService.fetch, payload)
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
    *getUrl({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const url = yield call(merchantListService.getUrl, payload)
        yield put({
          type: 'url',
          payload: {
            url
          }
        })
        yield put({ type: 'loading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    }
  }
}
