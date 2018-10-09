import request from '../utils/request'

export function fetch(data) {
  return request('/api/merchantList/page', { data })
}

export function getUrl(data) {
  return request('/api/merchantList/getUrl', { data })
}