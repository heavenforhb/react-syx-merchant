import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function menuInfo(ctx) {
  try {
    const info = await MicroService.request(ctx, provider.menuInfo)
    success(ctx)(info)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function rolePage(ctx) {
  try {
    const { 
      page = 1, size = 10, mercCd, roleName
    } = ctx.request.query
    if(!mercCd) {
        return error(ctx)('缺少必要参数')
    }
    const list = await MicroService.request(ctx, provider.rolePage, {
      pageNumber: page, pageSize: size, mercCd, roleName
    })
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function roleSave(ctx) {
    try {
      const { 
        mercCd, roleCd, roleName, menuInfo, menuInfo1, menuInfo2, menuInfo3, rmk
      } = ctx.request.body
      if(!mercCd || !roleCd || !roleName) {
          return error(ctx)('缺少必要参数')
      }
      const list = await MicroService.request(ctx, provider.roleSave, {
        mercCd, roleCd, roleName, menuInfo, menuInfo1, menuInfo2, menuInfo3, rmk
      })
      success(ctx)(list)
    } catch(e) {
      error(ctx)(e)
    }
  }

  export async function roleUpdate(ctx) {
    try {
        const { 
          mercCd, roleCd, roleName, menuInfo, menuInfo1, menuInfo2, menuInfo3, rmk
        } = ctx.request.body
        if(!mercCd || !roleCd || !roleName) {
            return error(ctx)('缺少必要参数')
        }
        const list = await MicroService.request(ctx, provider.roleUpdate, {
          mercCd, roleCd, roleName, menuInfo, menuInfo1, menuInfo2, menuInfo3, rmk
        })
        success(ctx)(list)
      } catch(e) {
        error(ctx)(e)
      }
  }

  export async function roleDelete(ctx) {
    try {
      const { 
        mercCd, roleCd
      } = ctx.request.body
      if(!mercCd || !roleCd) {
          return error(ctx)('缺少必要参数')
      }
      const list = await MicroService.request(ctx, provider.roleDelete, {
        mercCd, roleCd
      })
      success(ctx)(list)
    } catch(e) {
      error(ctx)(e)
    }
  }