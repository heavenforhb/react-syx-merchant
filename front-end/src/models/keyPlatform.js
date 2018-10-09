import * as keyPlatformService from '../services/keyPlatform'

export default {
  namespace: 'keyPlatform',

  state: {
    RSA: '',
    fetching: false
  },

  reducers: {
    save(state, { payload: { RSA } }) {
      return { ...state, RSA }
    },
    loading(state, { payload: { show } }) {
      return { ...state, fetching: show }
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { show: true } })
      try {
        const RSA = yield call(keyPlatformService.fetch, payload)
        yield put({
          type: 'save',
          payload: { RSA }
        })
        yield put({ type: 'loading', payload: { show: false } })
      } catch(error) {
        yield put({ type: 'loading', payload: { show: false } })
        throw error
      }
    }
  }
}
