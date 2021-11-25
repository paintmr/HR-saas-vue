import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

const state = {
  token: getToken(),
  userInfo: {} // 定义一个空对象，而非null，因为全局的getters中会用到userInfo.name
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    setToken(token) // 同步给缓存
    setTimeStamp()
  },
  removeToken(state) {
    state.token = null // 将数据设置给vuex
    removeToken() // 同步给缓存
  },
  setUserInfo(state, userInfo) { // 设置用户信息
    state.userInfo = { ...userInfo } // 用浅拷贝的方式赋值，这样才会触发组件更新
    // 下面这种写法不是响应式
    // state.userInfo['username'] = userInfo
  },
  removeUserInfo(state) { // 删除用户信息
    state.userInfo = {}
  }

}
const actions = {
  async login(context, data) {
    // 这里得写上await。因为login(data)是个异步函数。如果不写await，就会先执行下面的context代码。写了await，就会等login(data)是个异步action执行完了以后才去执行context代码。
    const token = await login(data)
    context.commit('setToken', token)
  },
  async getUserInfo(context) {
    const userInfoFst = await getUserInfo() // 获取用户资料
    const userInfoForAvatar = await getUserDetailById(userInfoFst.userId)
    // 合并两次的请求结果
    const userInfo = { ...userInfoFst, ...userInfoForAvatar }
    context.commit('setUserInfo', userInfo) // 更新vuex的用户数据
    return userInfo
  },
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的，还删除缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

