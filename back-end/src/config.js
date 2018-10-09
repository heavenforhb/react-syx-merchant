
const { env } = process
const { EUREKA_CENTER_HOSTS, EUREKA_SERVICE_PATH, ZIMG_HOST } = env

let hostsArr = [], serviceUrls = []
if (!EUREKA_CENTER_HOSTS) {
  throw Error('Please set EUREKA_CENTER_HOSTS.')
} else {
  hostsArr = EUREKA_CENTER_HOSTS.split(',')
  let servicePath = EUREKA_SERVICE_PATH || '/eureka/apps/'
  serviceUrls = hostsArr.map(host => {
    return `http://${host}${servicePath}`
  })
}

// Eureka 配置
export const Eureka = {
  app: 'MERCHANT-ADMIN',
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

// 系统配置
export const System = {
  serverPort: '3001',
  tokenUnlessPath: [
    /^\/api\/common/, 
    /^\/api\/user\/login/
  ],
  uploadFileExt: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
}
