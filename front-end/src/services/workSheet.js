import request from '../utils/request'

export function fetch(data) {
  return request('/api/workSheet/page', { data })
}

export function add(data) {
  return request('/api/workSheet/add', { method: 'POST', data })
}