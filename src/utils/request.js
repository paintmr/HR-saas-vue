import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from './auth'
import router from '@/router'
const TimeOut = 3600

// create an axios instance
const service = axios.create({
  // 开发环境，执行 npm run dev => .env.development => /api => 触发vue.config.js中的跨域代理
  // 对比生产环境：自行 npm run build => .env.production => /prod-api
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置超时时间。一旦响应时间超过5秒，就会报错。
})

// request interceptor
service.interceptors.request.use(config => {
  // 如果token存在，注入token
  if (store.getters.token) {
    // 有token，才有必要去检查是否超时
    if (checkTimeOut()) {
      // 如果checkTimeOut()为true，则token过期，退出系统，要用户重新登录
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('超时，token无效，请重新登录'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})

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
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当code为10002时，后端告诉我们token超时了
    store.dispatch('user/logout') // 必须先删掉token，才能跳转到login页面
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 把错误对象error传递给Promise.reject()。返回执行错误，下一步就不再进入then()（比如login().then().catch()），而进入catch()。如果是try catch，出现错误，也会进入catch。
})

// 检查是否超时的函数
function checkTimeOut() {
  var currentTime = Date.now()
  var timestamp = getTimeStamp()
  return (currentTime - timestamp) / 1000 > TimeOut // 当前时间和时间戳的差值是毫秒，除以1000为秒，然后与TimeOut（3600秒=60分=1小时）相比。如果大于TimeOut的时间，则为超时。
}

export default service
