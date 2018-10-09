import request from '../utils/request'

export function fetch(data) {
  return request('/api/withdrawList/page', { data })
}
export function detailFetch(data) {
  return request('/api/withdrawList/detail', { data })
}