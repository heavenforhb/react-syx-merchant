import request from '../utils/request'

export function fetch(data) {
  return request('/api/profit/page', { data })
}
export function detailFetch(data) {
  return request('/api/profit/detail', { data })
}