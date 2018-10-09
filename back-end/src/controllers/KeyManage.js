import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function info(ctx) {
  try {
    const { 
      mercCd
    } = ctx.request.query
    if (!mercCd) {
      return error(ctx)('缺少必要参数')
    }
    const list = await MicroService.request(ctx, provider.keyManageInfo, {
     mercCd
    })
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function update (ctx) {
  try {
    let {
        mercCd, signType, publicKey, md5Key, smsCode
    } = ctx.request.body;
    if (!mercCd || !signType || !smsCode) {
      return error(ctx)('缺少必要参数')
    }
    if (!publicKey && !md5Key) {
        return error(ctx)('缺少必要参数')
      }
    let res = await MicroService.request(ctx, provider.keyManageUpdate , {
        mercCd, signType, publicKey, md5Key, smsCode
    })
    success(ctx)(res)
  } catch (e) {
    error(ctx)(e)
  }
}

export async function add (ctx) {
    try {
      let {
        mercCd, signType, publicKey, md5Key, smsCode
      } = ctx.request.body;
      if (!mercCd || !signType || !smsCode) {
        return error(ctx)('缺少必要参数')
      }
      if (!publicKey && !md5Key) {
          return error(ctx)('缺少必要参数')
        }
      let res = await MicroService.request(ctx, provider.keyManageInput , {
        mercCd, signType, publicKey, md5Key, smsCode
      })
      success(ctx)(res)
    } catch (e) {
      error(ctx)(e)
    }
  }