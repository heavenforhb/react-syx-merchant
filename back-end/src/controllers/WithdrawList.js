import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function page(ctx) {
  try {
    const { 
        page = 1, size = 10, mercCd, witOrderSts, beginDate, endDate, busType
    } = ctx.request.query

    if (!beginDate || !endDate || !mercCd) {
      return error(ctx)('缺少必要参数')
    }
    const list = await MicroService.request(ctx, provider.withdrawListPage, {
        pageNumber: page, pageSize: size, beginDate, endDate, mercCd, witOrderSts, busType
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function detail(ctx) {
    try {
      const { 
        orderNo, mercCd
      } = ctx.request.query
  
      if (!orderNo || !mercCd) {
        return error(ctx)('缺少必要参数')
      }
  
      const list = await MicroService.request(ctx, provider.withdrawListDetail, {
        orderNo, mercCd
      })
      
      success(ctx)(list)
    } catch(e) {
      error(ctx)(e)
    }
  }