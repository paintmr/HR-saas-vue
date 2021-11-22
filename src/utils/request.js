import axios from 'axios'

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
service.interceptors.response.use()

export default service
