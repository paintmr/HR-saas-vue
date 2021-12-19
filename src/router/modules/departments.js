import Layout from '@/layout'

// 每个子模块组件位于layout的二级路由里
export default {
  path: '/departments',
  // name: 'departments',
  component: Layout,
  children: [{
    path: '', // 如果子路由的path什么都不写，则当前路由为子路由的默认路由
    name: 'departments',
    component: () => import('@/views/departments'),
    meta: {
      title: '组织架构',
      icon: 'tree-table'
    }
  }]
}
