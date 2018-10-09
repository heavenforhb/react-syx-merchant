import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function accountPage(ctx) {
  try {
    const { 
      page = 1, size = 10, beginDate, endDate, orderNo,  payOrder, capType, dcFlg,
       tranType, busType, mercCd
    } = ctx.request.query

    if (!mercCd) {
      return error(ctx)('缺少必要参数')
    }

    const list = await MicroService.request(ctx, provider.accountPage, {
      pageNumber: page, pageSize: size, beginDate, endDate, orderNo, payOrder, capType, dcFlg,
      tranType, busType, mercCd
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function accountAmt(ctx) {
  try {
    const { mercCd, capType } = ctx.request.query

    if (!mercCd || !capType) {
      return error(ctx)('缺少必要参数')
    }

    const info = await MicroService.request(ctx, provider.accountAmt, { mercCd, capType })
    success(ctx)(info)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function sales(ctx) {
  try {
    const { mercCd, beginDate, endDate } = ctx.request.query

    if (!mercCd || !beginDate || !endDate) {
      return error(ctx)('缺少必要参数')
    }

    const info = await MicroService.request(ctx, provider.sales, { mercCd, beginDate, endDate })
    success(ctx)(info)
  } catch(e) {
    error(ctx)(e)
  }
}