import fetchJsonp from 'fetch-jsonp'

const CryptoJS = require('crypto-js')

let logFlag = false

const SignMessenger = function (config) {
  this.sdkversion = '1'
  const { ids, pgeRZRandNum, pgeRZDataB } = config

  this.admin = null
  this.ids = ids
  this.sid = 'sign' + new Date().getTime() + 1
  this.pgeRZDataB = pgeRZDataB
  this.pgeRZRandNum = pgeRZRandNum
	this.urls = 'https://windows10.microdone.cn:5651'

  let  ua = navigator.userAgent.toLowerCase(),
    chr = '',
    regStr_chrome = /chrome\/[\d.]+/gi

	if (ua.indexOf('chrome') > 0){
		var chromeVersion = ua.match(regStr_chrome).toString()
		chromeVersion = parseInt(chromeVersion.replace(/[^0-9.]/gi, ''))
		if (chromeVersion >= 42) {
			chr = 'chromeh'
		} else {
			chr = 'chromel'
		}
	}
  this.env = {
		isWindows: (ua.indexOf('windows') != -1 || ua.indexOf('win32') != -1),
		isWindows64: (ua.indexOf('win64') != -1),
		isMac: (ua.indexOf('macintosh') != -1 || ua.indexOf('mac os x') != -1),
		isLinux: (ua.indexOf('linux') != -1),
		ie: (ua.indexOf('msie') != -1 || ua.indexOf('trident') != -1),
		firefox: ua.indexOf('firefox') != -1,
		chrome: chr.indexOf('chromel') != -1,
		opera: ua.indexOf('opera') != -1,
		//safari : ua.indexOf('version') != -1,
		safari: ua.indexOf('safari') != -1,
		edge: ua.indexOf('edge') != -1||chr.indexOf('chromeh') !=-1
	}
}

SignMessenger.prototype.createTag = function () {
  const { ids } = this
  if (this.env.isWindows64 && this.env.ie) {
    return `<object id='${ids}' classid='CLSID:EC176F0A-69BE-4059-8546-B01EF8C0FB9C' width='0' height='0'></object>`
  } else if (this.env.isWindows && this.env.ie) {
    return `<object id='${ids}' classid='CLSID:EC176F0A-69BE-4059-8546-B01EF8C0FB9C' width='0' height='0'></object>`
  } else if (this.env.isWindows || this.env.isMac) {
    return `<embed id='${ids}' type='application/x-sign-messenger' width='0' height='0'>`
  } else {
    return 'not support now'
  }
}

SignMessenger.prototype.getObj = function (admin) {
  const { ids, env } = this
  let obj = document.getElementById(ids)
  if ((admin != undefined) && env.ie) {
    if (this.admin == null) this.admin = obj.getAdmin(admin)
    return this.admin
  }
  return obj
}

SignMessenger.prototype.getProvider = function (name, type, pcode) {
  const { sid, pgeRZRandNum, pgeRZDataB } = this
  let csr = null, SETJSON = {
    id: sid,
    interfacetype: 0, 
    data: {
      name, type, pcode
    }
  }
  let datac = getEnStr(pgeRZRandNum, SETJSON)
  const RZCIJSON = {
    rankey: pgeRZRandNum,
    datab: pgeRZDataB,
    datac: datac
  }
  return new Promise((resolve, reject) => {
    this.getData(RZCIJSON).then(data => {
      resolve(data.pid)
    }).catch(err => {
      reject(err)
    })
  })
}

SignMessenger.prototype.getCsr = function (pid, pcode, csrinfo) {
  const { sid, pgeRZRandNum, pgeRZDataB } = this
  let SETJSON = {
    id: sid, 
    interfacetype: 0, 
    data: {
      pid, pcode, csrinfo
    }
  }

  let datac = getEnStr(pgeRZRandNum, SETJSON)
  const RZCIJSON = {
    rankey: pgeRZRandNum,
    datab: pgeRZDataB,
    datac: datac
  }

  return new Promise((resolve, reject) => {
    this.getData(RZCIJSON).then(data => {
      resolve(data.csr)
    }).catch(err => {
      reject(err)
    })
  })
}

SignMessenger.prototype.importCert = function (pid, format, data, pcode) {
  const { sid, pgeRZRandNum, pgeRZDataB } = this
  let SETJSON = {
    id: sid, 
    interfacetype: 0, 
    data: {
      pid, format, data, pcode
    }
  }
  let datac = getEnStr(pgeRZRandNum, SETJSON)
  const RZCIJSON = {
    rankey: pgeRZRandNum,
    datab: pgeRZDataB,
    datac: datac
  }
  return new Promise((resolve, reject) => {
    this.getData(RZCIJSON).then(data => {

      if (data.code == 0) {
        resolve(data)
      } else {
        reject(data)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

SignMessenger.prototype.getCertList = function (pid, pcode, query) {
  const { sid, pgeRZRandNum, pgeRZDataB } = this
  let SETJSON = {
    id: sid, 
    interfacetype: 0, 
    data: {
      pid, pcode, query
    }
  }
  let datac = getEnStr(pgeRZRandNum, SETJSON)
  const RZCIJSON = {
    rankey: pgeRZRandNum,
    datab: pgeRZDataB,
    datac: datac
  }

  return new Promise((resolve, reject) => {
    this.getData(RZCIJSON).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

SignMessenger.prototype.selectCert = function (pid , certid , pcode , type) {
  const { sid, pgeRZRandNum, pgeRZDataB } = this
  let SETJSON = {
    id: sid, 
    interfacetype: 0, 
    data: {
      pid, certid, pcode, type
    }
  }
  let datac = getEnStr(pgeRZRandNum, SETJSON)
  const RZCIJSON = {
    rankey: pgeRZRandNum,
    datab: pgeRZDataB,
    datac: datac
  }
  return new Promise((resolve, reject) => {
    this.getData(RZCIJSON).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

SignMessenger.prototype.sign = function (pid, sign, flags, ccode) {
  const { sid, pgeRZRandNum, pgeRZDataB } = this
  let SETJSON = {
    id: sid, 
    interfacetype: 0, 
    data: {
      pid, sign, flags, ccode
    }
  }
  let datac = getEnStr(pgeRZRandNum, SETJSON)
  const RZCIJSON = {
    rankey: pgeRZRandNum,
    datab: pgeRZDataB,
    datac: datac
  }
  return new Promise((resolve, reject) => {
    this.getData(RZCIJSON).then(res => {
      if (res.code == 0) {
        resolve(res.signed)
      } else {
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

SignMessenger.prototype.getCertInfo = function (pid , ccode) {
  const { sid, pgeRZRandNum, pgeRZDataB } = this
  let SETJSON = {
    id: sid, 
    interfacetype: 0, 
    data: {
      pid, ccode
    }
  }
  let datac = getEnStr(pgeRZRandNum, SETJSON)
  const RZCIJSON = {
    rankey: pgeRZRandNum,
    datab: pgeRZDataB,
    datac: datac
  }
  return new Promise((resolve, reject) => {
    this.getData(RZCIJSON).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

SignMessenger.prototype.selectCertAndGetInfo = function (pid , certid , pcode , type, ccode) {
  return new Promise((resolve, reject) => {
    this.selectCert(pid , certid , pcode , type)
      .then(res => this.getCertInfo(pid, ccode))
      .then(certInfo => {
        resolve(certInfo)
      })
      .catch(err => {
        reject(err)
      })
  })
}

SignMessenger.prototype.delCert = function (pid , certid , pcode) {
  const { sid, pgeRZRandNum, pgeRZDataB } = this
  let SETJSON = {
    id: sid, 
    interfacetype: 0, 
    data: {
      pid, certid, pcode
    }
  }
  let datac = getEnStr(pgeRZRandNum, SETJSON)
  const RZCIJSON = {
    rankey: pgeRZRandNum,
    datab: pgeRZDataB,
    datac: datac
  }
  return new Promise((resolve, reject) => {
    this.getData(RZCIJSON).then(data => {
      if (data.code == 0) {
        resolve(data)
      } else {
        reject(data)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

SignMessenger.prototype.getData = function (datas) {
  const { urls } = this
  return new Promise((resolve, reject) => {

    fetchJsonp(`${urls}/?str=${encodeURIComponent(JSON.stringify(datas))}`, {
      timeout: 10000,
      jsonpCallback: 'jsoncallback'
    }).then(response => response.json()).then(x => {    
      resolve(x)      
    }).catch(err => {
      if (logFlag) console.error(err)
      reject(err)
    })
  })
}

function getEnStr(sKey,jsonStr) {
	const neiKey = [ 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x1A, 0x2A, 0x2B,
			0x2C, 0x2D, 0x2E, 0x2F, 0x3A, 0x3B, 0x11, 0x22, 0x33, 0x44, 0x55,
			0x66, 0x77, 0x1A, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 0x3A, 0x3B ]
	let fkey = '', lx = ''
	for (let i = 0; i < sKey.length; i++) {
		lx = String.fromCharCode(sKey[i].charCodeAt(0) ^ neiKey[i])
		fkey += lx
	}
	let hexKey = CryptoJS.enc.Utf8.parse(fkey)
	const enStr = CryptoJS.AES.encrypt(JSON.stringify(jsonStr), hexKey, {
		mode : CryptoJS.mode.ECB,
		padding : CryptoJS.pad.Pkcs7
	})
	return enStr.toString()
}

export default SignMessenger