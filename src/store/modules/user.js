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
    const result = await login(data)
    if (result.data.success) {
      context.commit('setToken', result.data.data)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

