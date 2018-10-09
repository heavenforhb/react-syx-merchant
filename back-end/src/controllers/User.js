import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))

import { getClientIp } from '../utils/utils'

export async function login(ctx) {
  try {
    const { merc, password, verCode, picKey, randKey, loginType } = ctx.request.body

    let { opr } = ctx.request.body

    if (
      !merc || !password || !verCode ||
      !picKey || !randKey
    ) {
      return error(ctx)('缺少必要参数')
    }

    let oprType = 'A'
    if (loginType == '02') {
      oprType = 'O'
      if (!opr) {
        return error(ctx)('请填写操作员编号')
      }
    } else {
      opr = merc
    }
    
    const userInfo = await MicroService.request(ctx, provider.mercLogin, {
      oprCd: opr, loginPwd: password, vcode: verCode, picKey, randKey, mercCd: merc, oprType
    }), clientIp = getClientIp(ctx.req)

    const token = jwt.sign({
      userInfo, ip: clientIp
    }, publicKey, { expiresIn: '60m' })

    // set-cookie
    ctx.cookies.set('token', token, { maxAge: 3600 * 1000 })

    success(ctx)(userInfo)

  } catch(e) {
    error(ctx)(e)
  }
}

export async function oprInfo(ctx) {
  try {
    const { mercCd, oprCd } = ctx.request.query
    if(!mercCd || !oprCd) { return error(ctx)('缺少必要参数') }
    const info = await MicroService.request(ctx, provider.mercOprInfo, {
      mercCd, oprCd
    })
    success(ctx)(info)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function mercInfo(ctx) {
  try {
    const { mercCd, caVisible } = ctx.request.query
    if (!mercCd || !caVisible) { return error(ctx)('缺少必要参数') }
    const info = await MicroService.request(ctx, provider.mercInfo, {
      mercCd, caVisible
    })
    success(ctx)(info)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function smsSend(ctx, next) {
  try {
    const { smsType } = ctx.request.body
    if (!smsType) {
      return  error(ctx)('缺少必要参数')
    }
    const res = await MicroService.request(ctx, provider.smsSend, { smsType })
    success(ctx)(res)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function oprInfoNormalUpdate(ctx, next) {
  try {
    const { mercCd, oprCd, contactName, phoneNo, email, smsCode } = ctx.request.body
    if (!mercCd || !oprCd || !contactName || !phoneNo || !email || !smsCode) {
      return  error(ctx)('缺少必要参数')
    }
    const res = await MicroService.request(ctx, provider.oprInfoNormalUpdate, { mercCd, oprCd, contactName, phoneNo, email, smsCode })
    success(ctx)(res)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function setReseInfo(ctx, next) {
  try {
    const { mercCd, reseInfo ,loginPwd,randKey } = ctx.request.body
    if (!mercCd || !reseInfo || !loginPwd || !randKey) {
      return  error(ctx)('缺少必要参数')
    }
    const res = await MicroService.request(ctx, provider.setReseInfo, { mercCd, reseInfo, loginPwd, randKey })
    success(ctx)(res)
  } catch(e) {
    error(ctx)(e)
  }
}
