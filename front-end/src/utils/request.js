import fetch from 'dva/fetch'
import moment from 'moment'
import { notification } from 'antd'
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  }
  const newOptions = { ...defaultOptions, ...options }
  if (newOptions.data) {
    if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers
      }
      newOptions.body = JSON.stringify(newOptions.data)
    }
    if (!newOptions.method || newOptions.method == 'GET') {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...newOptions.headers
      }
      const { data } = newOptions
      const params = Object.keys(data).filter(key => data[key] != null && data[key] !== '').map(key => {
        let val = data[key]
        if (val instanceof moment) {
          val = val.format('YYYY-MM-DD')
        }
        return `${key}=${encodeURIComponent(val)}`
      })
      url = url + '?' + params.join('&')
    }
  }

  return fetch(url, newOptions)
    .then(response => response.json())
    .then(data => {
      if (data.status == '200') {
        return data.result
      } else if (data.status == '401') {
        // notification.error({ message: data.result.errInfo })
        const error = new Error('登录过期，请重新登录')
        error.number = 401
        throw error
      } else {
        const error = new Error(data.msg)
        error.number = data.status
        throw error
        // notification.error({ message: data.msg })
      }
    })
}
