const CryptoJS = require('crypto-js')

import fetchJsonp from 'fetch-jsonp'

const pgeUrl = 'https://windows10.microdone.cn', pgePort = 5596

export function getData(data, success, error) {
  if (!data) return false
  fetchJsonp(`${pgeUrl}:${pgePort}/?str=${encodeURIComponent(JSON.stringify(data))}`, {
      jsonpCallback: 'jsoncallback'
    })
    .then(response => response.json())
    .then(data => {
      if (success) {
        success(data)
      }
    })
    .catch(err => {
      if (error) {
        error(err)
      }
    })
}

export function getEnStr (sKey, jsonStr) {
  const neiKey = [ 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x1A, 0x2A, 0x2B,
    0x2C, 0x2D, 0x2E, 0x2F, 0x3A, 0x3B, 0x11, 0x22, 0x33, 0x44, 0x55,
    0x66, 0x77, 0x1A, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 0x3A, 0x3B ]
  
  let fkey = ''
  let lx = ''
  for (let i = 0, len = sKey.length; i < len; i++) {
    lx = String.fromCharCode(sKey[i].charCodeAt(0) ^ neiKey[i])
    fkey += lx
  }
  let hexKey = CryptoJS.enc.Utf8.parse(fkey)
  let enStr = CryptoJS.AES.encrypt(JSON.stringify(jsonStr), hexKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return enStr.toString()
}