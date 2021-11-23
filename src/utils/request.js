import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  // 开发环境，执行 npm run dev => .env.development => /api => 触发vue.config.js中的跨域代理
  // 对比生产环境：自行 npm run build => .env.production => /prod-api
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置超时时间。一旦响应时间超过5秒，就会报错。
})

// request interceptor
service.interceptors.request.use()

// response interceptor
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    // 出现错误，不进入then()，而进入catch()
    Message.error(message) // 提示错误消息
    // Promise.reject()的参数是错误对象，而message是string，就new一个错误对象new Error(message)传给Promise.reject()
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 把错误对象error传递给Promise.reject()。返回执行错误，下一步就不再进入then()（比如login().then().catch()），而进入catch()。如果是try catch，出现错误，也会进入catch。
})

export default service
