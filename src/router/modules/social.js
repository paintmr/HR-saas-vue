import Layout from '@/layout'

// 每个子模块组件位于layout的二级路由里
export default {
  path: '/social',
  // name: 'social',
  component: Layout,
  children: [{
    path: '', // 如果子路由的path什么都不写，则当前路由为子路由的默认路由
    name: 'social',
    component: () => import('@/views/social'),
    meta: {
      title: '社保',
      icon: 'documentation'
    }
  }]
}
