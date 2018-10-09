import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function list(ctx) {
  try {
    const { 
      page = 1, size = 10, beginDate, endDate, orderNo, outOrderNo, 
      orderSts, tranType, busType, agentCd, mercCd, mercName
    } = ctx.request.query

    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }

    if(agentCd && !mercCd && !mercName) {
      return error(ctx)('请输入要查询的商户')
    }

    const list = await MicroService.request(ctx, provider.orderList, {
      pageNumber: page, pageSize: size, beginDate, endDate, orderNo, outOrderNo,
      orderSts, tranType, busType, agentCd, mercCd, mercName
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function tranDetail (ctx) {
  try {
    let { orderNo, mercCd } = ctx.request.query;
    if(!orderNo || !mercCd) {
      return error(ctx)('缺少必要参数')
    }
    let detail = await MicroService.request(ctx, provider.tranDetail, {
      orderNo, mercCd
    })
    success(ctx)(detail)
  } catch (e) {
    error(ctx)(e)
  }
}

export async function notifyReissue (ctx) {
  try {
    let { orderNo, mercCd, tranType } = ctx.request.query;
    if(!orderNo || !mercCd || !tranType) {
      return error(ctx)('缺少必要参数')
    }
    let detail = await MicroService.request(ctx, provider.notifyReissue, {
      orderNo, mercCd, tranType
    })
    success(ctx)(detail)
  } catch (e) {
    error(ctx)(e)
  }
}

export async function refundApply (ctx) {
  try {
    const { oriOrderNo, orderAmt, mercCd, refundReason } = ctx.request.body;
    if(!oriOrderNo || !orderAmt || !mercCd) {
      return error(ctx)('缺少必要参数')
    }
    let res = await MicroService.request(ctx, provider.refundApply, {
      oriOrderNo, orderAmt, mercCd, refundReason
    })
    success(ctx)(res)
  } catch (e) {
    error(ctx)(e)
  }
}