import request from '../utils/request'

export function accountPage(data) {
  return request('/api/home/accountPage', { data })
}
