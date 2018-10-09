import * as profitSettleService from '../services/profitSettle'
import xStorage from '../utils/xStorage'

export default {
  namespace: 'profitSettle',

  state: {
    list: [],
    total: {},
    applyable: null,
    loading: false,
    visible: false,
    beginDate: null,
    endDate: null,
    dateList: '',
    orderAmt: '',
    orderNo: '',
    step: 0,
    uuid: '',

    stepOneLoading: false,
    stepTneLoading: false
  },

  reducers: {
    save(state, { payload: { list, total, statistics } }) {
      return { ...state, list, total, statistics }
    },
    loading(state, { payload: { show } }) {
      return { ...state, loading: show }
    },
    openApplyInfo(state, { payload: { dateList, orderAmt, orderNo, step, uuid } }) {
      return { ...state, dateList, orderAmt, orderNo, step, uuid }
    },
    openApplyLoading(state, { payload: { show } }) {
      return { ...state, openApplyLoading: show }
    },
    bindApply(state, { payload: { orderAmt } }) {
      return { ...state, orderAmt }
    },
    visible(state, { payload: { show, beginDate, endDate } }) {
      return { ...state, visible: show, beginDate, endDate }
    },
    stepOneInfo(state, { payload: { orderAmt, dateList, step } }) {
      return { ...state, orderAmt, dateList, step }
    },
    stepOneLoading(state, { payload: { show } }) {
      return { ...state, stepOneLoading: show }
    },
    stepTwoInfo(state, { payload: { step } }) {
      return { ...state, step }
    },
    stepTwoLoading(state, { payload: { show } }) {
      return { ...state, stepTwoLoading: show }
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const { data, collect, applyable } = yield call(profitSettleService.fetch, payload)
        yield put({
          type: 'save',
          payload: {
            list: data,
            applyable: applyable,
            total: collect
          }
        })
        yield put({ type: 'loading', payload: { show: false } })
      } catch (error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    },
    *openApply({ payload }, { call, put }) {
      yield put({ type: 'openApplyLoading', payload: { show: true } })
      try {
        const { dateList, orderAmt, orderNo, step, uuid } = yield call(profitSettleService.openApply, payload)
        yield put({
          type: 'openApplyInfo',
          payload: {
            dateList,
            orderAmt,
            orderNo,
            step,
            uuid
          }
        })
        const { beginDate, endDate } = payload
        yield put({ type: 'visible', payload: { show: true, beginDate, endDate } })
        yield put({ type: 'openApplyLoading', payload: { show: false } })
      } catch (error) {
        yield put({ type: 'openApplyLoading', payload: { show: false } })
        throw error
      }
    },
    *stepOne({ payload }, { call, put }) {
      yield put({ type: 'stepOneLoading', payload: { show: true } })
      try {
        const { orderAmt, profitDateList } = yield call(profitSettleService.lockDate, payload)
        yield put({
          type: 'stepOneInfo',
          payload: {
            dateList: profitDateList,
            orderAmt,
            step: 1
          }
        })
        yield put({ type: 'stepOneLoading', payload: { show: false } })
      } catch (error) {
        yield put({ type: 'stepOneLoading', payload: { show: false } })
        throw error
      }
    },
    *apply({ payload }, { call, put }) {
      yield put({ type: 'stepTwoLoading', payload: { show: true } })
      try {
        const req = yield call(profitSettleService.saveApply, payload)
        yield put({
          type: 'stepTwoInfo',
          payload: {
            step: 2
          }
        })
        yield put({ type: 'stepTwoLoading', payload: { show: false } })
      } catch (error) {
        yield put({ type: 'stepTwoLoading', payload: { show: false } })
        throw error
      }
    }
  }
}
