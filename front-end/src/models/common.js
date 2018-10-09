import * as commonService from '../services/common'
import xStorage from '../utils/xStorage'

export default {
  namespace: 'common',

  state: {
    cityList: [],
    bankList: [],
    lbankList: [],
    provinceList: [],
    menuInfo: []
  },

  reducers: {
    bankList(state, { payload: { bankList } }) {
      return { ...state, bankList }
    },
    lbankList(state, { payload: { lbankList } }) {
      return { ...state, lbankList }
    },
    cityList(state, { payload: { cityList } }) {
      return { ...state, cityList }
    },
    provinceList(state, { payload: { provinceList } }) {
      return { ...state, provinceList }
    },
    menuInfo(state, { payload: { menuInfo } }) {
      return { ...state, menuInfo }
    }
  },

  effects: {
    *bank({ payload }, { call, put }) {
      try {
        const bankList = yield call(commonService.bankList, payload)
        yield put({
          type: 'bankList',
          payload: { bankList }
        })
      } catch (error) {
        throw error
      }
    },
    *lbank({ payload }, { call, put }) {
      try {
        const lbankList = yield call(commonService.lbankList, payload)
        yield put({
          type: 'lbankList',
          payload: { lbankList }
        })
      } catch (error) {
        throw error
      }
    },
    *city({ payload }, { call, put }) {
      try {
        const cityList = yield call(commonService.cityList, payload)
        yield put({
          type: 'cityList',
          payload: { cityList }
        })
      } catch (error) {
        throw error
      }
    },
    *province({ payload }, { call, put }) {
      try {
        const provinceList = yield call(commonService.cityList, payload)
        yield put({
          type: 'provinceList',
          payload: { provinceList }
        })
      } catch (error) {
        throw error
      }
    },
    *menuAll({ payload }, { call, put }) {
      try {
        const menuInfo = yield call(commonService.menuAll, payload)
        yield put({
          type: 'menuInfo',
          payload: { menuInfo }
        })
      } catch (error) {
        throw error
      }
    }
  }
}
