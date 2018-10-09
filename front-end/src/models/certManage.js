import * as certManageService from '../services/certManage'
import xStorage from '../utils/xStorage'

export default {
  namespace: 'certManage',

  state: {
    list: [],
    total: 0,
    statistics: {},
    serverDate: '',
    loading: false
  },

  reducers: {
    save(state, { payload: { list, total, statistics, serverDate } }) {
      return { ...state, list, total, statistics, serverDate }
    },
    loading(state, { payload: { show } }) {
      return { ...state, loading: show }
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const { dataList, dataStatistics, totalRecord, serverDate } = yield call(certManageService.fetch, payload)
        yield put({
          type: 'save',
          payload: {
            list: dataList,
            statistics: dataStatistics,
            total: totalRecord,
            serverDate
          }
        })
        yield put({ type: 'loading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    },
    *delCA({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const detail = yield call(certManageService.delCA, payload)
        yield put({ type: 'loading', payload: { show: false } })
        yield put({ type: 'detailModalFlag', payload: { show: true } })
      } catch(error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    }
  }
}
