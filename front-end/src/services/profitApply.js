import request from '../utils/request'

export function fetch(data) {
  return request('/api/profitApply/page', { data })
}
