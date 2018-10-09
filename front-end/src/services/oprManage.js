import request from '../utils/request'

export function fetch(data) {
  return request('/api/oprManage/oprInfoPage', { data })
}

export function statusPage(data) {
  return request('/api/oprManage/oprStsPage', { data })
}


