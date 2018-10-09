import MicroService from '../utils/MicroService'

import provider from '../provider'

import { success, error } from './Base'

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

import { System } from '../config'

export async function imgCode(ctx, next) {
  try {
    const res = await MicroService.request(ctx, provider.imgCode)
    success(ctx)(res)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function passGuardInit(ctx, next) {
  try {
    const res = await MicroService.request(ctx, provider.passGuardInit)
    success(ctx)(res)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function passGuardAes(ctx, next) {
  try {
    const res = await MicroService.request(ctx, provider.passGuardAes)
    success(ctx)(res)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function upload (ctx, next) {
  try {
    const { files } = ctx.request.body

    const { file } = files || {}
    if (!files || !file) {
      return  error(ctx)('请提交文件')
    }
    
    if (System.uploadFileExt.indexOf(file.type) < 0) {
      return error(ctx)('文件格式不支持')
    }
    const { type, size } = file
    let tmpPath = path.normalize(file.path)
    let result = await fetch(provider.fileServer, {
      method: 'POST',
      headers: {
        'Content-Type': type,
        'Content-Length': size
      },
      body: fs.createReadStream(tmpPath)
    }).then(response => response.json()).then(result => {
      if (result.ret) {
        const { info } = result
        success(ctx)(info.md5)
        // 1秒后删除临时文件
        setTimeout(() => fs.unlink(tmpPath), 1000)
      } else {
        error(ctx)(result.error.message)
      }
    })
  } catch (err) {
    error(ctx)(err)
  }
}

export async function get (ctx, next) {
  const { fid } = ctx.params
  let fileUrl = `${provider.fileServer}/${fid}`
  ctx.status = 301
  ctx.redirect(fileUrl)
  ctx.response.header.Location = provider.fileServer
}

export async function lbankList (ctx) {
  try {
    const { bankCd, cityCd } = ctx.request.query;
    if (!bankCd || !cityCd) {
      return error(ctx)('缺少必要参数')
    }
    let res = await MicroService.request(ctx, provider.lbankList,{
       bankCd, cityCd
    })
    success(ctx)(res)
  } catch (err) {
    error(ctx)(err)
  }
}

export async function bankList (ctx) {
  try {
    let res = await MicroService.request(ctx, provider.bankList)
    success(ctx)(res)
  } catch (err) {
    error(ctx)(err)
  }
}

export async function cityList (ctx) {
  try {
    const { acdType, pacdCd } = ctx.request.query;
    if (!acdType) {
      return error(ctx)('缺少必要参数')
    }
    let res = await MicroService.request(ctx, provider.cityList,{
      acdType, pacdCd
    })
    success(ctx)(res)
  } catch (err) {
    error(ctx)(err)
  }
}