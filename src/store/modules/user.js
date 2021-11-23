import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken()
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    setToken(token) // 同步给缓存
  },
  removeToken(state) {
    state.token = null // 将数据设置给vuex
    removeToken() // 同步给缓存
  }
}
const actions = {
  async login(context, data) {
    // 这里得写上await。因为login(data)是个异步函数。如果不写await，就会先执行下面的context代码。写了await，就会等login(data)是个异步action执行完了以后才去执行context代码。
    const token = await login(data)
    context.commit('setToken', token)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

