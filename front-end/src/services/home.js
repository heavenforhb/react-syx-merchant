import request from '../utils/request'

export function accountPage(data) {
  return request('/api/home/accountPage', { data })
}

export function accountAmt(data) {
  return request('/api/home/accountAmt', { data })
}

export function sales(data) {
  return request('/api/home/sales', { data })
}

export function noticeFetch(data) {
  return request('/api/notice/page', { data })
}