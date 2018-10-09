import request from '../utils/request'

export function fetch(data) {
  return request('/api/chargeList/page', { data })
}
export function detailFetch(data) {
  return request('/api/chargeList/detail', { data })
}