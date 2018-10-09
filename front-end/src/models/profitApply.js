import * as profitApplyService from '../services/profitApply'
import xStorage from '../utils/xStorage'

export default {
  namespace: 'profitApply',

  state: {
    list: [],
    total: '',
    dataStatistics: {},
    loading: false,
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
        const { dataList, totalRecord, dataStatistics } = yield call(profitApplyService.fetch, payload)
        yield put({
          type: 'save',
          payload: {
            list: dataList,
            dataStatistics: dataStatistics,
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
