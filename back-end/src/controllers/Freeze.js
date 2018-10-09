import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function page(ctx) {
  try {
    const { 
      page = 1, size = 10, mercCd, beginDate, endDate, capType
    } = ctx.request.query

    if (!beginDate || !endDate || !mercCd) {
      return error(ctx)('缺少必要参数')
    }
    const list = await MicroService.request(ctx, provider.freezePage, {
      pageNumber: page, pageSize: size, beginDate, endDate, mercCd, capType
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}