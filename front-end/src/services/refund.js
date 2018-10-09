import request from '../utils/request'

export function fetch(data) {
  return request('/api/refund/page', { data })
}
export function detailFetch(data) {
  return request('/api/refund/detail', { data })
}