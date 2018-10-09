import request from '../utils/request'

export function bankList(data) {
  return request('/api/common/bankList', { data })
}
export function lbankList(data) {
  return request('/api/common/lbankList', { data })
}
export function cityList(data) {
  return request('/api/common/cityList', { data })
}
export function menuAll(data) {
  return request('/api/common/menuAll', { data })
}