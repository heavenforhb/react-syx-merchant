const os = require('os')

export function getHostName() {
  const { hostname } = os
  return hostname() || 'Computer'
}

export function getLocalIp() {
  const interfaces = os.networkInterfaces()
  for (let devName in interfaces) {
    const iface = interfaces[devName]
    for (let i=0; i<iface.length; i++) {
      const alias = iface[i]
      if (
        alias.family === 'IPv4' && 
        alias.address !== '127.0.0.1' && 
        !alias.internal
      ) {
        return alias.address
      }
    }  
  }
}

export function getClientIp(req) {
  console.log(req.headers['x-forwarded-for'])
  let ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  return ip.split(':').pop()
}