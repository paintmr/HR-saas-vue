// 处理权限路由的模块

import { constantRoutes } from '@/router'

const state = {
  routes: constantRoutes // 路由表，表示当前用户所拥有的所有路由的数组
}
const mutations = {
  // 定义修改routes的mutations
  // 根据当前用户的角色添加新路由newRoutes
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
