import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function oprInfoPage(ctx) {
  try {
    const { 
      page = 1, size = 10, oprCd, mercCd, oprName
    } = ctx.request.query

    if(!mercCd) {
      return error(ctx)('缺少必要参数')
    }

    const list = await MicroService.request(ctx, provider.oprInfoPage, {
      pageNumber: page, pageSize: size, oprCd, oprName, mercCd
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function oprAdd(ctx) {
  try {
    const { mercCd, oprCd, oprName, roleCd, phoneNo, eMail, loginPwd, randKey, loginType, rmk } = ctx.request.body
    if(!mercCd || !oprCd || !oprName || !roleCd || !phoneNo || !eMail || !loginPwd |randKey || !rmk) {
      return error(ctx)('缺少必要参数')
    }
    const res = await MicroService.request(ctx, provider.oprAdd, {
      mercCd, oprCd, oprName, roleCd, phoneNo, eMail, loginPwd, randKey, loginType, rmk 
    })
    success(ctx)(res)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function modifyOprInfo(ctx) {
  try {
    const { mercCd, oprCd, roleCd, phoneNo, rmk, oprName } = ctx.request.body
    if(!mercCd || !oprCd || !roleCd || !phoneNo || !rmk || !oprName) {
      return error(ctx)('缺少必要参数')
    }
    const res = await MicroService.request(ctx, provider.modifyOprInfo, {
      mercCd, oprCd, roleCd, phoneNo, rmk, oprName
    })
    success(ctx)(res)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function modifyOprStatus(ctx) {
  try {
    const { uuid, oprSts, rmk, mercCd, oprCd } = ctx.request.body
    if(!uuid || !oprSts || !rmk || !mercCd || !oprCd) {
      return error(ctx)('缺少必要参数')
    }
    const res = await MicroService.request(ctx, provider.modifyOprStatus, {
      uuid, oprSts, rmk, mercCd, oprCd
    })
    success(ctx)(res)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function oprStsPage(ctx) {
  try {
    const { mercCd, oprCd, page = 1, size = 5 } = ctx.request.query
    if(!mercCd || !oprCd || !page || !size) {
      return error(ctx)('缺少必要参数')
    }
    const res = await MicroService.request(ctx, provider.oprStsPage, {
      mercCd, oprCd, pageNumber: page, pageSize: size
    })
    success(ctx)(res)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function queryOprisExist(ctx) {
  try {
    const { mercCd, oprCd } = ctx.request.query
    if(!mercCd || !oprCd) {
      return error(ctx)('缺少必要参数')
    }
    const res = await MicroService.request(ctx, provider.queryOprisExist, {
      mercCd, oprCd
    })
    success(ctx)(res)
  } catch(e) {
    error(ctx)(e)
  }
}