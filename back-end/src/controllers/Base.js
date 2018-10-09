import returnCode from '../constants/returnCode'

export function success (ctx) {
  return function(res) {
    ctx.body = {
      status: returnCode.SUCCESS,
      result: res
    }
  }
}

export function error (ctx) {
  return function(err) {
    let code = returnCode.FAILURE, msg = ''
    if (typeof err == 'object' && err.code) {
      if (err.code) {
        code = err.code
        msg = err.errInfo
      }
    } else {
      msg = err.toString()
    }
    ctx.body = {
      status: code,
      msg
    }
  }
}