import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function page(ctx) {
  try {
    const { 
      page = 1, size = 5, mercCd
    } = ctx.request.query

    if(!mercCd) {
      return error(ctx)('缺少必要参数')
    }

    const list = await MicroService.request(ctx, provider.mercFeeInfoPage, {
      pageNumber: page, pageSize: size, mercCd
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function mercBusiInfo(ctx) {
    try {
      const { 
        mercCd
      } = ctx.request.query
  
      if(!mercCd) {
        return error(ctx)('缺少必要参数')
      }
  
      const list = await MicroService.request(ctx, provider.mercBusiInfo, {
        mercCd
      })
      
      success(ctx)(list)
    } catch(e) {
      error(ctx)(e)
    }
  }
  
  export async function mercStateInfo(ctx) {
    try {
      const { 
        mercCd
      } = ctx.request.query
  
      if(!mercCd) {
        return error(ctx)('缺少必要参数')
      }
  
      const list = await MicroService.request(ctx, provider.mercStateInfo, {
        mercCd
      })
      
      success(ctx)(list)
    } catch(e) {
      error(ctx)(e)
    }
  }
  
  export async function mercSuperUpdate(ctx, next) {
    try {
      const { mercCd, oprCd, contactName, phoneNo, email, smsCode } = ctx.request.body
      if (!mercCd || !oprCd || !contactName || !phoneNo || !email || !smsCode) {
        return  error(ctx)('缺少必要参数')
      }
      const res = await MicroService.request(ctx, provider.mercSuperUpdate, { 
        mercCd, oprCd, contactName, phoneNo, email, smsCode })
      success(ctx)(res)
    } catch(e) {
      error(ctx)(e)
    }
  }

  export async function mercStateInfoUpdate(ctx, next) {
    try {
      const { mercCd, oprCd, smsCode, cardNo, bankCd, bankName, provCd, provName, cityCd, cityName, lbankCd, lbankName } = ctx.request.body
      if (!mercCd || !oprCd || !smsCode || !cardNo || !bankCd || !bankName || !provCd || !provName || !cityCd || !cityName || !lbankCd || !lbankName) {
        return  error(ctx)('缺少必要参数')
      }
      const res = await MicroService.request(ctx, provider.mercStateInfoUpdate, { 
        mercCd, oprCd, smsCode, cardNo, bankCd, bankName, provCd, provName, cityCd, cityName, lbankCd, lbankName })
      success(ctx)(res)
    } catch(e) {
      error(ctx)(e)
    }
  }