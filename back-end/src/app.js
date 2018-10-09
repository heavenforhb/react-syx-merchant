import Koa from 'koa'

import views from 'koa-views'
import json from 'koa-json'
// import onerror from 'koa-onerror'
import bodyparser from 'koa-bodyparser'
import KoaBody from 'koa-body'


import logger from 'koa-logger'
import jwt from 'koa-jwt'

import MainRoutes from './routes/main-routes'
import ApiRoutes from './routes/api-routes'
import ErrorRoutesCatch from './middleware/ErrorRoutesCatch'

import MicroService from './utils/MicroService'

import { getClientIp } from './utils/utils'


import { 
  System as SystemConfig
} from './config'

const app = new Koa()
const path = require('path')
const fs = require('fs')

const publicKey = fs.readFileSync(path.join(__dirname, './publicKey.pub'))

// error handler
// onerror(app)

// middlewares
app.use((ctx, next) => {
    let hostArr = ctx.request.header.host.split(':')
    if (hostArr[0] === 'localhost' || hostArr[0] === '127.0.0.1') {
      ctx.set('Access-Control-Allow-Origin', '*')
    }
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Credentials', true) // 允许带上 cookie
    return next()
  })
  .use((ctx, next) => {
    return next()
  })
  .use(ErrorRoutesCatch())
  .use(
    jwt({ 
      secret: publicKey, 
      cookie: 'token'
    }).unless({ 
      custom: (ctx) => {
        const { url } = ctx
        if (/^\/api/.test(url)) {
          return SystemConfig.tokenUnlessPath.some(reg => reg.test(url))
        } else {
          return true
        }
      }
    })
  )
  // .use(bodyparser({
  //   enableTypes:['json', 'form', 'text','multipart'],
  //   formLimit:"10mb",

  // }))
  .use(KoaBody({
    multipart: true,
    strict: false,
    formidable: {
      uploadDir: path.join(__dirname, '../assets/uploads/tmp')
    },
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb'
  }))
  .use(async (ctx,next)=>{
    return next()
  })
  .use(views(__dirname + '/views', {
    extension: 'pug'
  }))
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(MainRoutes.routes())
  .use(MainRoutes.allowedMethods())

app.use(ApiRoutes.routes())
  .use(ApiRoutes.allowedMethods())

console.log('Now start API server on port ' + SystemConfig.serverPort + '...')
app.listen(SystemConfig.serverPort)

MicroService.start()

export default app