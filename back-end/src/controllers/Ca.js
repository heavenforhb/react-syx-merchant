import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function caInit (ctx, next) {
    try {
      const res = await MicroService.request(ctx, provider.caInit)
      success(ctx)(res)
    } catch(e) {
      error(ctx)(e)
    }
  }
  
  export async function caDetail (ctx, next) {
    try {
      const { certSerialNumber } = ctx.request.query
      if(!certSerialNumber) {
        return error(ctx)('缺少必要参数')
      }
      const res = await MicroService.request(ctx, provider.caDetail, { certSerialNumber })
      success(ctx)(res)
    } catch(e) {
      error(ctx)(e)
    }
  }
  
  export async function caInstall (ctx, next) {
    try {
      const {
        mercCd, csr, usePlace, usePlaceDesc, linkSys, caType, smsCode
      } = ctx.request.body
      if (!csr || !usePlace) {
        return error(ctx)('缺少必要参数')
      }
      const res = await MicroService.request(ctx, provider.caInstall, {
        csr, usePlace, usePlaceDesc, linkSys, caType, smsCode
      })
      success(ctx)(res)
    } catch(e) {
      error(ctx)(e)
    }
  }
  
  export async function caPage (ctx, next) {
    try {
      const {
        pageNumber,pageSize,certStatus,certSerialNumber,beginDate,endDate
        } = ctx.request.query
      const res = await MicroService.request(ctx, provider.caPage, {
        pageNumber, pageSize, certStatus, certSerialNumber, beginDate, endDate
      })
      success(ctx)(res)
    } catch(e) {
      error(ctx)(e)
    }
  }
  
  export async function caRevokeOne (ctx, next) {
    try {
      const {
          certSerialNumber, revokeReason, linkSys, caType
      } = ctx.request.body
      
      if (!certSerialNumber) {
        return ctx.body = base.error('和证书序列号不能为空')
      }
      const res = await MicroService.request(ctx, provider.caRevokeOne, {
        certSerialNumber, revokeReason, linkSys, caType
      })
      success(ctx)(res)
    } catch(e) {
      error(ctx)(e)
    }
  }