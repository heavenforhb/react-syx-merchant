import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function list(ctx) {
  try {
    const { 
      page = 1, size = 10, beginDate, endDate, mercCd, wkShtSts
    } = ctx.request.query

    if (!beginDate || !endDate || !mercCd) {
      return error(ctx)('缺少必要参数')
    }

    const list = await MicroService.request(ctx, provider.workSheetPage, {
      pageNumber: page, pageSize: size, beginDate, endDate,  mercCd, wkShtSts
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function workSheetAdd (ctx) {

  try {
    let {
      mercCd, mercName, wkShtTitle, content, wkShtType, orderNo, imgsPath, filePath
    } = ctx.request.body;
    if (!mercCd || !mercName || !wkShtTitle || !content || !wkShtType) {
      return error(ctx)('缺少必要参数')
    }

    let res = await MicroService.request(ctx, provider.workSheetAdd , {

      mercCd, mercName, wkShtTitle, content, wkShtType, orderNo, imgsPath, filePath

    })
    
    success(ctx)(res)
  } catch (e) {
    
    error(ctx)(e)
  }
}