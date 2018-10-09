import * as Service from '../services/dashboard'

export default {
  namespace: 'dashboard',

  state: {
    list: [],
    total: 0,
    statistics: {},
    loading: false
  },

  reducers: {
    save(state, { payload: { list, total, statistics } }) {
      return { ...state, list, total, statistics }
    },
    loading(state, { payload: { show } }) {
      return { ...state, loading: show }
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const { dataList, dataStatistics, totalRecord } = yield call(Service.fetch, payload)
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
    }
  }
}
