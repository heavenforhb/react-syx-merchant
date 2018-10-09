import request from '../utils/request'

export function oprInfoNormalUpdate(data) {
    return request('/api/user/oprInfonormal/update', { method: 'PUT', data })
  }
  
  export function setReseInfo(data) {
    return request('/api/user/mercInfo/setReseInfo', { method: 'POST', data })
  }