import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function list(ctx) {
  try {
    const { 
      page = 1, size = 10, agentCd, beginDate, endDate, proOrderSts
    } = ctx.request.query
    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }
    if(!agentCd) {
        return error(ctx)('缺少必要参数')
    }
    const list = await MicroService.request(ctx, provider.profitDataList, {
      pageNumber: page, pageSize: size, beginDate, endDate, agentCd, proOrderSts
    })
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function initProfitData(ctx) {
  try {
    const { agentCd, beginDate, endDate } = ctx.request.query
    if(!agentCd || !beginDate || !endDate) {
       return error(ctx)('缺少必要参数')
    }
    const list = await MicroService.request(ctx, provider.initProfitData, {
      agentCd, beginDate, endDate
    })
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function openApply(ctx) {
  try {
    const { agentCd, agentName, beginDate, endDate } = ctx.request.body
    if(!agentCd || !agentName || !beginDate || !endDate) {
       return error(ctx)('缺少必要参数')
    }
    const req = await MicroService.request(ctx, provider.openApply, {
      agentCd, agentName, beginDate, endDate
    })
    success(ctx)(req)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function bindApply(ctx) {
  try {
    const { uuid, applyUuid, isBind } = ctx.request.body  
    if(!uuid || !applyUuid || !isBind) {
       return error(ctx)('缺少必要参数')
    }
    const req = await MicroService.request(ctx, provider.bindApply, {
      applyUuid, uuid, isBind
    })
    success(ctx)(req)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function lockDate(ctx) {
  try {
    const { applyUuid } = ctx.request.body  
    if(!applyUuid) {
       return error(ctx)('缺少必要参数')
    }
    const req = await MicroService.request(ctx, provider.lockDate, {
      applyUuid
    })
    success(ctx)(req)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function saveApply(ctx) {
  try {
    const { applyUuid, invoice, imageAddress, signedData } = ctx.request.body
    if (!applyUuid || !imageAddress || !invoice || !signedData) {
      return error(ctx)('缺少必要参数')
    }
    let req = await MicroService.request(ctx, provider.saveApply, {
      applyUuid, imageAddress, invoice, signedData
    })
    success(ctx)(req)
  } catch (e) {
    error(ctx)(e)
  }
}
