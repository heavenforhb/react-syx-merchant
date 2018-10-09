import * as paymentService from '../services/payment'
import xStorage from '../utils/xStorage'

export default {
  namespace: 'payment',

  state: {
    formStep: 'step-form',
    loading: false,
    stepFormData: {}
  },

  reducers: {
    save(state, { payload: { list, total, statistics } }) {
      return { ...state, list, total, statistics }
    },
    loading(state, { payload: { show } }) {
      return { ...state, loading: show }
    },
    step(state, { payload: { formStep } }) {
        return { ...state, formStep }
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const { dataList, dataStatistics, totalRecord } = yield call(paymentService.fetch, payload)
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
