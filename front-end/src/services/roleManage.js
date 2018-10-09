import request from '../utils/request'

export function fetch(data) {
  return request('/api/roleManage/rolePage', { data })
}

export function menuInfo(data) {
  return request('/api/roleManage/menuInfo', { data })
}