import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function page(ctx) {
  try {
    const { 
      page = 1, size = 10, beginDate, endDate, orderDt, mercCd, tranType, busType, agentCd
    } = ctx.request.query

    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }

    if(!agentCd) {
        return error(ctx)('缺少必要参数')
    }

    const list = await MicroService.request(ctx, provider.profitPage, {
      pageNumber: page, pageSize: size, beginDate, endDate, orderDt, mercCd, agentCd, tranType, busType
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function detail (ctx) {
  try {
    let { orderNo, agentCd} = ctx.request.query;
    if(!orderNo || !agentCd) {
      return error(ctx)('缺少必要参数')
    }
    let detail = await MicroService.request(ctx, provider.profitDetail, {
      orderNo, agentCd
    })
    success(ctx)(detail)
  } catch (e) {
    error(ctx)(e)
  }
}