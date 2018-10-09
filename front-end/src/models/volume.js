import * as homeService from '../services/home'
import xStorage from '../utils/xStorage'

export default {
  namespace: 'volume',

  state: {
    saslesInfo: [],
    saslesLoading: false
  },

  reducers: {
    salesInfo(state, { payload: { saslesInfo } }) {
      return { ...state, saslesInfo }
    },
    saslesLoading(state, { payload: { show } }) {
      return { ...state, saslesLoading: show }
    },
  },

  effects: {
    *sales({ payload }, { call, put }) {
      yield put({ type: 'saslesLoading', payload: { show: true } })
      try {
        const data = yield call(homeService.sales, payload)
          yield put({
            type: 'salesInfo',
            payload: { saslesInfo: data }
          })
        yield put({ type: 'saslesLoading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'saslesLoading', payload: { show: false } })
        throw error
      }
    },
  }
}
