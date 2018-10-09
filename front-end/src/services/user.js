import request from '../utils/request'

export function fetch({ mercCd, oprCd }) {
  return request('/api/user/oprInfo', {
    data: { mercCd, oprCd }
  })
}
export function merchantBaseInfo(data) {
  return request('/api/user/mercInfo', { data })
}