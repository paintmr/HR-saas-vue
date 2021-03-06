import Layout from '@/layout'

// 每个子模块组件位于layout的二级路由里
export default {
  path: '/social_securitys',
  // name: 'social_securitys',
  component: Layout,
  children: [{
    path: '', // 如果子路由的path什么都不写，则当前路由为子路由的默认路由
    name: 'social_securitys',
    component: () => import('@/views/social_securitys'),
    meta: {
      title: '社保',
      icon: 'documentation'
    }
  }]
}
