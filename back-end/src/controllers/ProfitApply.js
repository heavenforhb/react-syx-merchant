import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function page(ctx) {
  try {
    const { 
      page = 1, size = 10, agentCd, beginDate, endDate, reviewSts, showNotStart
    } = ctx.request.query

    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }

    if(!agentCd) {
        return error(ctx)('缺少必要参数')
    }

    const list = await MicroService.request(ctx, provider.applyPage, {
      pageNumber: page, pageSize: size, beginDate, endDate, agentCd, reviewSts, showNotStart
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function againApply(ctx) {
  try {
    const { applyUuid, agentCd } = ctx.request.body
    if (!applyUuid || !agentCd) {
      return error(ctx)('缺少必要参数')
    }
    let req = await MicroService.request(ctx, provider.againApply, {
      applyUuid, agentCd
    })
    success(ctx)(req)
  } catch (e) {
    error(ctx)(e)
  }
}

export async function cancelApply(ctx) {
  try {
    const { applyUuid, agentCd } = ctx.request.body
    if (!applyUuid || !agentCd) {
      return error(ctx)('缺少必要参数')
    }
    let req = await MicroService.request(ctx, provider.cancelApply, {
      applyUuid, agentCd
    })
    success(ctx)(req)
  } catch (e) {
    error(ctx)(e)
  }
}
