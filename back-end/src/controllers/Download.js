import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function orderTranDataExcel(ctx) {
  try {
    const { 
        orderNo, outOrderNo, mercName, mercCd ,orderSts, tranType, busType, beginDate, endDate, agentCd
    } = ctx.request.query

    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }

    if(agentCd && !mercCd && !mercName) {
      return error(ctx)('请输入要下载的商户')
    }

    const list = await MicroService.request(ctx, provider.orderTranDataExcel, {
        orderNo, outOrderNo, mercName, mercCd, orderSts, tranType, busType, beginDate, endDate, agentCd
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function statementDataExcel(ctx) {
  try {
    const { 
      mercCd, orderNo, batNo, pssOrderSts, verifySts, beginDate, endDate
    } = ctx.request.query

    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }

    const list = await MicroService.request(ctx, provider.statementDataExcel, {
      mercCd, orderNo, batNo, pssOrderSts, verifySts, beginDate, endDate
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function refundDataExcel(ctx) {
  try {
    const { 
      orderNo, oriOrderNo, refOrderSts, mercCd, beginDate, endDate
    } = ctx.request.query

    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }

    const list = await MicroService.request(ctx, provider.refundDataExcel, {
      orderNo, oriOrderNo, refOrderSts, mercCd, beginDate, endDate
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function paymentListDataExcel(ctx) {
  try {
    const { 
      mercCd, payOrderSts, outOrderNo, beginDate, endDate, orderNo, busType
    } = ctx.request.query

    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }

    const list = await MicroService.request(ctx, provider.paymentListDataExcel, {
      mercCd, payOrderSts, outOrderNo, beginDate, endDate, orderNo, busType
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function freezeDataExcel(ctx) {
  try {
    const { 
      mercCd, capType, beginDate, endDate
    } = ctx.request.query

    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }

    const list = await MicroService.request(ctx, provider.freezeDataExcel, {
      mercCd, capType, beginDate, endDate
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function chargeListDataExcel(ctx) {
  try {
    const { 
      mercCd, beginDate, endDate, recOrderSts, busType
    } = ctx.request.query

    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }

    const list = await MicroService.request(ctx, provider.chargeListDataExcel, {
      mercCd, beginDate, endDate, recOrderSts, busType
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function withdrawListDataExcel(ctx) {
  try {
    const { 
      mercCd, beginDate, endDate, witOrderSts, busType
    } = ctx.request.query

    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }

    const list = await MicroService.request(ctx, provider.withdrawListDataExcel, {
      mercCd, beginDate, endDate, witOrderSts, busType
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function merchantListDataExcel(ctx) {
  try {
    const { 
      merName, mercCd,  phoneNo, mercSts, mercType, agentCd
    } = ctx.request.query

    if (!agentCd) {
      return error(ctx)('缺少必要参数')
    }

    const list = await MicroService.request(ctx, provider.merchantListDataExcel, {
      merName, mercCd,  phoneNo, mercSts, mercType, agentCd
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function profitDataExcel(ctx) {
  try {
    const { 
      beginDate, endDate, orderDt, mercCd, tranType, busType, agentCd
    } = ctx.request.query

    if (!beginDate || !endDate) {
      return error(ctx)('开始日期或结束日期不能为空')
    }

    const list = await MicroService.request(ctx, provider.merchantListDataExcel, {
      beginDate, endDate, orderDt, mercCd, tranType, busType, agentCd
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function excelQueryStatus_order (ctx) {
  try {
    let { exportKey } = ctx.request.query;
    if(!exportKey) {
        return error(ctx)('缺少必要参数')
    }
    let detail = await MicroService.request(ctx, provider.excelQueryStatus_order, { exportKey })
    success(ctx)(detail)
  } catch (e) {
    error(ctx)(e)
  }
}

export async function excelQueryStatus_posp (ctx) {
    try {
      let { exportKey } = ctx.request.query;
      if(!exportKey) {
          return error(ctx)('缺少必要参数')
      }
      let detail = await MicroService.request(ctx, provider.excelQueryStatus_posp, { exportKey })
      success(ctx)(detail)
    } catch (e) {
      error(ctx)(e)
    }
  }

  export async function excelQueryStatus_merc (ctx) {
    try {
      let { exportKey } = ctx.request.query;
      if(!exportKey) {
          return error(ctx)('缺少必要参数')
      }
      let detail = await MicroService.request(ctx, provider.excelQueryStatus_merc, { exportKey })
      success(ctx)(detail)
    } catch (e) {
      error(ctx)(e)
    }
  }

  export async function excelQueryStatus_acm (ctx) {
    try {
      let { exportKey } = ctx.request.query;
      if(!exportKey) {
          return error(ctx)('缺少必要参数')
      }
      let detail = await MicroService.request(ctx, provider.excelQueryStatus_acm, { exportKey })
      success(ctx)(detail)
    } catch (e) {
      error(ctx)(e)
    }
  }

  export async function excelQueryStatus_pss (ctx) {
    try {
      let { exportKey } = ctx.request.query;
      if(!exportKey) {
          return error(ctx)('缺少必要参数')
      }
      let detail = await MicroService.request(ctx, provider.excelQueryStatus_pss, { exportKey })
      success(ctx)(detail)
    } catch (e) {
      error(ctx)(e)
    }
  }