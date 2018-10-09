import request from '../utils/request'

export function fetch(data) {
  return request('/api/paymentList/page', { data })
}
export function detailFetch(data) {
  return request('/api/paymentList/detail', { data })
}