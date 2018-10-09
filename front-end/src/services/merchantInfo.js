import request from '../utils/request'

export function mercFeePage(data) {
  return request('/api/merchantInfo/page', { data })
}

export function mercBusiInfo(data) {
  return request('/api/merchantInfo/mercBusiInfo', { data })
}

export function mercStateInfo(data) {
    return request('/api/merchantInfo/mercStateInfo', { data })
}

export function mercInfoUpdate(data) {
  return request('/api/merchantInfo/mercInfoUpdate', { data, method: 'PUT' })
}

export function mercStateInfoUpdate(data) {
  return request('/api/merchantInfo/mercStateInfoUpdate', { data, method: 'PUT' })
}