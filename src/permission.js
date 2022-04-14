// 权限拦截，导航守卫，路由守卫 router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例。这个store实例和组件中的this.$store是一回事。
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whileList = ['/login', '/404'] // 定义白名单：所有不需要token也可以访问的页面
// 路由的前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开启进度条
  // 判断有无token
  if (store.getters.token) {
    // 如果有token，继续判断是否去登录页面
    if (!store.getters.userId) {
      const userInfo = await store.dispatch('user/getUserInfo')
      // 筛选用户的可用路由
      const routes = await store.dispatch('permission/filterRoutes', userInfo.roles.menus)
      // 把动态路由添加到路由表中。默认的路由表只有静态路由，没有动态路由
      router.addRoutes(routes)
      next(to.path)
    }
    if (to.path === '/login') {
      // 有token+去登录页面，跳转到主页
      next('/')
    } else {
      next() // 放行
    }
  } else {
    // 没有token，但在白名单里，放行
    if (whileList.indexOf(to.path) > -1) {
      next()
    } else {
      // 没token，没在白名单里，跳转到登录页面
      next('/login')
    }
  }
  // 关闭进度条效果，以解决手动切换地址时，进度条效果不关闭的问题。手动切换地址时，会进入next('/')next('/login')等带参数的next()，这时候，当前的导航被中断，不会进入后置守卫router.afterEach()中
  NProgress.done()
})

// 后置守卫
router.afterEach(() => {
  NProgress.done() // 关闭进度条
})
