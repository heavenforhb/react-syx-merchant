import * as roleManageService from '../services/roleManage'
import xStorage from '../utils/xStorage'

import moment from 'moment'
import { notification } from 'antd'

export default {
  namespace: 'roleManage',

  state: {
    loading: false,
    list: [],
    total: '',
    menuInfo: [],
    menuLoading: false
  },

  reducers: {
    loading(state, { payload: { show } }) {
      return { ...state, loading: show }
    },
    save(state, { payload: { list, total } }) {
        return { ...state, list, total }
    },
    menuInfoSave(state, { payload: { menuInfo } }) {
      return { ...state, menuInfo }
    },
    menuLoading(state, { payload: { show } }) {
      return { ...state, menuLoading: show }
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try {
        yield put({ type: 'loading', payload: { show: true }})
        const { dataList, totalRecord } = yield call(roleManageService.fetch, payload)
        yield put({
            type: 'save',
            payload: { list: dataList, total: totalRecord }
        })
        yield put({ type: 'loading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    },
    *menuInfo({ payload }, { call, put }) {
      try {
        yield put({ type: 'menuLoading', payload: { show: true }})
        const res = yield call(roleManageService.menuInfo, payload)
        yield put({
            type: 'menuInfoSave',
            payload: { menuInfo: res }
        })
        yield put({ type: 'menuLoading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'menuLoading', payload: { show: false } })
        throw error
      }
    }
  }
}
