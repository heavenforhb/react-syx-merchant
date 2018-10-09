import returnCode from '../constants/returnCode'

export default function () {
  return function (ctx, next) {
    return next().catch(err => {
      switch (err.status) {
        case returnCode.UNAUTHORIZED:
          ctx.status = 200
          ctx.body = {
            status: returnCode.UNAUTHORIZED,
            result: {
              errInfo: 'Token认证失败，请重新登录'
            }
          }
          break
        default:
          throw err
      }
    })
  }
}