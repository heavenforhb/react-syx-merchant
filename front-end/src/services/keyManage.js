import request from '../utils/request'

export function fetch(data) {
    return request('/api/keyManage/info', { data })
}
  
export function update(data) {
    return request('/api/keyManage/update', { data, method: 'PUT' })
}

export function add(data) {
    return request('/api/keyManage/add', { data, method: 'POST' })
}