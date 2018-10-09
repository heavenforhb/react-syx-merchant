import * as accountDetailService from '../services/accountDetail'
import xStorage from '../utils/xStorage'

export default {
  namespace: 'accountDetail',

  state: {
    accountPageInfo: {
      list: [],
      total: 0,
      statistics: {},
    },
    accountPageLoading: true,
  },

  reducers: {
    save(state, { payload: { accountPageInfo } }) {
      return { ...state, accountPageInfo }
    },
    accountPageLoading(state, { payload: { show } }) {
      return { ...state, accountPageLoading: show }
    }
  },

  effects: {
    *accountPage({ payload }, { call, put }) {
      yield put({ type: 'accountPageLoading', payload: { show: true } })
      try {
        const { dataList, dataStatistics, totalRecord } = yield call(accountDetailService.accountPage, payload)
        yield put({
          type: 'save',
          payload: { accountPageInfo: { list: dataList, statistics: dataStatistics, total: totalRecord } }
        })
        yield put({ type: 'accountPageLoading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'accountPageLoading', payload: { show: false } })
        throw error
      }
    }
  }
}
