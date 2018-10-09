import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'


export async function modifyLoginPwd(ctx, next) {
    try {
      const { mercCd, oprCd, oldLoginPwd, newLoginPwd, randKey, loginType = '00' } = ctx.request.body
      if (!mercCd || !oprCd || !newLoginPwd || !oldLoginPwd || !randKey) {
        return  error(ctx)('缺少必要参数')
      }
      const res = await MicroService.request(ctx, provider.modifyLoginPwd, { mercCd, oprCd, oldLoginPwd, newLoginPwd, randKey })
      success(ctx)(res)
    } catch(e) {
      error(ctx)(e)
    }
  }

  export async function modifyPayPwd(ctx, next) {
    try {
      const { mercCd, oldPayPwd, newPayPwd, randKey, loginType = '00' } = ctx.request.body
      if (!mercCd || !oldPayPwd || !newPayPwd || !randKey) {
        return  error(ctx)('缺少必要参数')
      }
      const res = await MicroService.request(ctx, provider.modifyPayPwd, { mercCd, oldPayPwd, newPayPwd, randKey })
      success(ctx)(res)
    } catch(e) {
      error(ctx)(e)
    }
  }

  export async function setPayPwd(ctx, next) {
    try {
      const { mercCd, payPwd, randKey, loginType = '00' } = ctx.request.body
      if (!mercCd || !payPwd || !randKey) {
        return  error(ctx)('缺少必要参数')
      }
      const res = await MicroService.request(ctx, provider.setPayPwd, { mercCd, payPwd, randKey,loginType })
      success(ctx)(res)
    } catch(e) {
      error(ctx)(e)
    }
  }

  export async function resetPayPwd(ctx, next) {
    try {
      const { mercCd, payPwd, smsCode, randKey, loginType = '00' } = ctx.request.body
      if (!mercCd || !payPwd || !randKey || !smsCode) {
        return  error(ctx)('缺少必要参数')
      }
      const res = await MicroService.request(ctx, provider.resetPayPwd, { mercCd, payPwd, smsCode, randKey,loginType })
      success(ctx)(res)
    } catch(e) {
      error(ctx)(e)
    }
  }