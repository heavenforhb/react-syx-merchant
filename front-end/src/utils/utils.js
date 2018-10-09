const os = require('os')

export function getPlainNode(nodeList, parentPath = '') {
  const arr = []
  nodeList.forEach((node) => {
    const item = node
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/')
    item.exact = true
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path))
    } else {
      if (item.children && item.component) {
        item.exact = false
      }
      arr.push(item)
    }
  })
  return arr
}

export function formatTime (date, time) {
  if (!date) return ''
  date = date.toString()
  time = time ? time.toString() : ''
  let str = `${date.substr(0, 4)}-${date.substr(4, 2)}-${date.substr(6, 2)}`
  if (date.length == 14) {
    str += ` ${date.substr(8, 2)}:${date.substr(10, 2)}:${date.substr(12, 2)}`
  } else if (date.length == 6) {
    str = `${date.substr(0, 2)}:${date.substr(2, 2)}:${date.substr(4, 2)}`
  } else if (time) {
    str += ` ${time.substr(0, 2)}:${time.substr(2, 2)}:${time.substr(4, 2)}`
  }
  return str
}

export function equal(old, target) {
  let r = true
  for (const prop in old) {
    if (typeof old[prop] === 'function' && typeof target[prop] === 'function') {
      if (old[prop].toString() != target[prop].toString()) {
        r = false
      }
    } else if (old[prop] != target[prop]) {
      r = false
    }
  }
  return r
}

export function fMoney(m, n) {
  let s = parseFloat(m)
  if (isNaN(s)) return ''
  n = n > 0 && n <= 20 ? n : 2
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
  let l = s.split('.')[0].split('').reverse()
  let r = s.split('.')[1]
  let t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '')
  }
  return t.split('').reverse().join('') + '.' + r
}

export function sum(arr) {
  if (!arr) return ''
  var s = 0
  for (var i = arr.length - 1; i >= 0; i--) {
    if (isNaN(arr[i])) return false
    s += parseFloat(arr[i])
  }
  return s
}

export function getBrowser() {
  const { platform, userAgent } = window.navigator
  const browser = {
    name: '',
    code: 1,
    platform
  }
  if (platform == 'Win32' || platform == 'Windows') {
    if (/MSIE|Trident/i.test(userAgent)) {
      browser.code = /ARM/i.test(userAgent) ? 9 : 1
      browser.name = 'IE'
    } else if (/Edge/i.test(userAgent)) {
      browser.code = 10
      browser.name = 'Edge'
    } else if (/Chrome/i.test(userAgent)) {
      let chromeVersion = userAgent.match(/chrome\/[\d.]+/gi).toString()
      chromeVersion = parseInt(chromeVersion.replace(/[^0-9.]/gi, ''))
      browser.code = chromeVersion >= 42 ? 10 : 2
      browser.name = 'Chrome'
    } else if (/Firefox/i.test(userAgent)) {
      let firefoxVersion = userAgent.match(/firefox\/[\d.]+/gi).toString()
      firefoxVersion = parseInt(firefoxVersion.replace(/[^0-9.]/gi, ''))
      browser.code = firefoxVersion >= 51 ? 10 : 2
      browser.name = 'Firefox'
    }
  } else if (platform == 'Win64') {
    if (/Windows NT 6.2/i.test(userAgent) && !/Firefox/i.test(userAgent)) {
      browser.code = 1
      browser.name = 'IE'
    } else if (/MSIE|Trident/i.test(userAgent)) {
      browser.code = 3
      browser.name = 'IE'
    } else if (/Edge/i.test(userAgent)) {
      browser.code = 10
      browser.name = 'Edge'
    } else if (/Firefox/i.test(userAgent)) {
      browser.code = 10
      browser.name = 'Firefox'
    } else if (/Chrome/i.test(userAgent)) {
      let chromeVersion = userAgent.match(/chrome\/[\d.]+/gi).toString()
      chromeVersion = parseInt(chromeVersion.replace(/[^0-9.]/gi, ''))
      browser.code = chromeVersion >= 42 ? 10 : 2
      browser.name = 'Chrome'
    } else if (/Android/i.test(userAgent)) {
      browser.code = 7
      browser.name = 'Android'
    } else {
      browser.code = 2
      browser.name = 'Unknown'
    }
  } else if (/Macintosh/i.test(userAgent)) {
    browser.platform = 'MacOS'
    if (/Safari/i.test(userAgent) &&
      (
        /Version\/5.1/i.test(userAgent) &&
        /Version\/5.2/i.test(userAgent) &&
        /Version\/6/i.test(userAgent)
      )
    ) {
      browser.code = 8
      browser.name = 'Safari'
    } else if (/Firefox/i.test(userAgent)) {
      browser.name = 'Firefox'
      let firefoxVersion = userAgent.match(/firefox\/[\d.]+/gi).toString()
      firefoxVersion = parseInt(firefoxVersion.replace(/[^0-9.]/gi, ''))
      browser.code = firefoxVersion >= 50 ? 11 : 6
    } else if (/Chrome/i.test(userAgent)) {
      browser.name = 'Chrome'
      let chromeVersion = userAgent.match(/chrome\/[\d.]+/gi).toString()
      chromeVersion = parseInt(chromeVersion.replace(/[^0-9.]/gi, ''))
      browser.code = chromeVersion >= 42 ? 11 : 6
    } else if (/Opera/i.test(userAgent)) {
      browser.name = 'Opera'
      browser.code = 6
    } else if (/Safari/i.test(userAgent)) {
      browser.code = 6
      browser.name = 'Safari'
    } else {
      browser.code = 0
    }
  }

  return browser
}

export function getSeconds(time) {
  let date = new Date(`${time.substr(0, 4)}/${time.substr(4, 2)}/${time.substr(6, 2)} ${time.substr(8, 2)}:${time.substr(10, 2)}:${time.substr(12, 2)}`)
  return date ? date.getTime() / 1000 : 0
}

export function unique(arr) {
  if(!arr) return false
  var res = [arr[0]]
  for (var i = 1; i < arr.length; i++) {
    var repeat = false
    for (var j = 0; j < res.length; j++) {
      if (arr[i] == res[j]) {
        repeat = true
        break
      }
    }
    if (!repeat) {
      res.push(arr[i])
    }
  }
  return res
}