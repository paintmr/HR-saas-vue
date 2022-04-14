// 处理权限路由的模块

import { constantRoutes, asyncRoutes } from '@/router'

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
const actions = { // 筛选权限路由
  // 第二个参数为当前用户所拥有的菜单权限 menus: ["settings", "permissions"]
  // asyncRoutes是所有的动态路由 [{path:'/setting', name: 'setting'},{path:'/departments', name: 'departments'}]
  filterRoutes(context, menus) {
    const routes = [] // routes是当前用户有权限访问的routes
    menus.forEach(key => {
      // 在asyncRoutes中找对象中path属性等于key的。如果找到，说明有访问权限，如果找不到，说明没有访问权限。
      routes.push(...asyncRoutes.filter(item => item.path === '/' + key))
    })
    context.commit('setRoutes', routes) // 这里的state数据是用来显示左侧菜单用的
    return routes // 返回给调用filterRoutes(context, menus)的方法
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
