import * as statementService from '../services/statement'
import xStorage from '../utils/xStorage'

export default {
  namespace: 'statement',

  state: {
    list: [],
    total: 0,
    loading: false
  },

  reducers: {
    save(state, { payload: { list, total } }) {
      return { ...state, list, total }
    },
    loading(state, { payload: { show } }) {
      return { ...state, loading: show }
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const { dataList, totalRecord } = yield call(statementService.fetch, payload)
        yield put({
          type: 'save',
          payload: {
            list: dataList,
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
