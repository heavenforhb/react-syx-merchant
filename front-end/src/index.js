import dva from 'dva'
import 'moment/locale/zh-cn'
import './polyfill'
import './index.less'
import './g2'
import models from './models'

import { notification } from 'antd'

// 1. Initialize
const app = dva({
  // history: browserHistory(),
  onError(error, dispatch) {
    notification.error({ message: error.message })
    if (error.number == 401) {
      dispatch({ type: 'user/update', payload: { authenticated: false } })
    }
    error.preventDefault()
  }
})

// 2. Plugins
// app.use({});

// 3. Register global model
models.forEach((m) => {
  app.model(m)
});

// 4. Router
app.router(require('./router'))

// 5. Start
app.start('#root')