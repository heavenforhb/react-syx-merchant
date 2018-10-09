import request from '../utils/request'

export function fetch(data) {
  return request('/api/profitSettle/list', { data })
}

export function openApply(data) {
  return request('/api/profitSettle/openApply', { method: 'POST', data })
}

export function lockDate(data) {
  return request('/api/profitSettle/lockDate', { method: 'POST', data })
}

export function saveApply(data) {
  return request('/api/profitSettle/saveApply', { method: 'POST', data })
}
