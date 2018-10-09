/** Eureka Config Below */
const { EUREKA_CENTER_HOSTS, EUREKA_SERVICE_PATH, ZIMG_HOST } = process.env

let hostsArr = [], serviceUrls = []
if (!EUREKA_CENTER_HOSTS) {
  throw Error('No EUREKA_CENTER_HOSTS! Please config the environment.')
} else {
  hostsArr = EUREKA_CENTER_HOSTS.split(',')
  let servicePath = EUREKA_SERVICE_PATH || '/eureka/apps/'
  serviceUrls = hostsArr.map(host => {
    return `http://${host}${servicePath}`
  })
}

import { getLocalIp } from './utils/utils'

let ipAddress = getLocalIp()

export const eureka = {
  app: 'MERCHANT-ADMIN',
  hostName: ipAddress,
  ip: ipAddress,
  statusPage: `http://${ipAddress}/eureka-info`,
  port: {
    '$': 8080,
    '@enabled': true,
  },
  vipAddress: 'jq.test.something.com',
  dataCenter: {
    '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
    name: 'MyOwn',
  },
  serviceCenter: {
    serviceUrls: {
      default: serviceUrls
    }
  }
}
/** Eureka Config End */