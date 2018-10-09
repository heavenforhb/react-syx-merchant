import request from '../utils/request'

export function fetch(data) {
  return request('/api/order/page', { data })
}
export function detailFetch(data) {
  return request('/api/order/detail', { data })
}