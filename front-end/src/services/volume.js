import request from '../utils/request'

export function sales(data) {
    return request('/api/home/sales', { data })
  }