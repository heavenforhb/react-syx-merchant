import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

import jwt from 'koa-jwt'
import fs from 'fs'
import jwtToken from 'jsonwebtoken'
import path from 'path'
const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))
let crypto = require('crypto')

export async function page(ctx) {
  try {
    const { 
      page = 1, size = 10, merName, mercCd,  phoneNo, mercSts, mercType, agentCd
    } = ctx.request.query

    if (!agentCd) {
      return error(ctx)('缺少必要参数')
    }

    const list = await MicroService.request(ctx, provider.merchantPage, {
      pageNumber: page, pageSize: size, merName, mercCd,  phoneNo, mercSts, mercType, agentCd
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}

export async function getDesUrl(ctx) {
    try {  
        let token = ctx.cookies.get('token')
        let decode = jwtToken.verify(token, publicKey)
        if (!decode) {
          return error(ctx)('Cookie信息获取失败，请重新登陆')
        }else{
          let { userInfo} = decode
          let {mercCd,mercType,mercName} = userInfo
          let text = `${mercCd}&${mercName}`
          if(mercType == "A1"){
            let cipher = crypto.createCipher('des',publicKey)
            let crypted = cipher.update(text,'utf8','base64')
            crypted += cipher.final('base64')
            success(ctx)(encodeURIComponent(crypted))
          }else{
            error(ctx)('商户非代理商，无法获取推广链接')
          }
        }
    } catch(e) {
        error(ctx)('生成推广链接失败，请重试')
    }
  }
