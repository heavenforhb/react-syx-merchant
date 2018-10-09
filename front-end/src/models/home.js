import * as homeService from '../services/home'
import xStorage from '../utils/xStorage'

export default {
  namespace: 'home',

  state: {
    accountPageInfo: {
      list: [],
      total: 0,
      statistics: {},
    },
    accountPageLoading: false,
    accountAmtInfo: {
      stateAccountAmt: {},
      baseAccountAmt: {}
    },
    accountAmtLoading: false,
    saslesInfo: [],
    saslesLoading: false,
    noticeInfo: [],
    noticeLoading: false
  },

  reducers: {
    save(state, { payload: { accountPageInfo } }) {
      return { ...state, accountPageInfo }
    },
    accountPageLoading(state, { payload: { show } }) {
      return { ...state, accountPageLoading: show }
    },
    accountAmtInfo(state, { payload: { accountAmtInfo } }) {
      return { ...state, accountAmtInfo }
    },
    accountAmtLoading(state, { payload: { show } }) {
      return { ...state, accountAmtLoading: show }
    },
    salesInfo(state, { payload: { saslesInfo } }) {
      return { ...state, saslesInfo }
    },
    saslesLoading(state, { payload: { show } }) {
      return { ...state, saslesLoading: show }
    },
    noticeInfo(state, { payload: { noticeInfo } }) {
      return { ...state, noticeInfo }
    },
    noticeLoading(state, { payload: { show } }) {
      return { ...state, noticeLoading: show }
    },
  },

  effects: {
    *accountPage({ payload }, { call, put }) {
      yield put({ type: 'accountPageLoading', payload: { show: true } })
      try {
        const { dataList, dataStatistics, totalRecord } = yield call(homeService.accountPage, payload)
        yield put({
          type: 'save',
          payload: { accountPageInfo: { list: dataList, statistics: dataStatistics, total: totalRecord } }
        })
        yield put({ type: 'accountPageLoading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'accountPageLoading', payload: { show: false } })
        throw error
      }
    },
    *accountAmt({ payload }, { call, put }) {
      yield put({ type: 'accountAmtLoading', payload: { show: true } })
      try {
        const baseAccountAmt = yield call(homeService.accountAmt, Object.assign({}, payload, { capType: '000' }))
        const stateAccountAmt = yield call(homeService.accountAmt, Object.assign({}, payload, { capType: '001' }))
        if(baseAccountAmt.resultCode != 'SUCCESS' || stateAccountAmt.resultCode != 'SUCCESS') {
          const error = new Error('获取账户金额出错')
          throw error
        } else {
          yield put({
            type: 'accountAmtInfo',
            payload: { accountAmtInfo: { baseAccountAmt, stateAccountAmt } }
          })
        }
        yield put({ type: 'accountAmtLoading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'accountAmtLoading', payload: { show: false } })
        throw error
      }
    },
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
    *notice({ payload }, { call, put }) {
      yield put({ type: 'noticeLoading', payload: { show: true } })
      try {
        const { dataList } = yield call(homeService.noticeFetch, payload)
          yield put({
            type: 'noticeInfo',
            payload: { noticeInfo: dataList }
          })
        yield put({ type: 'noticeLoading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'noticeLoading', payload: { show: false } })
        throw error
      }
    },
  }
}
