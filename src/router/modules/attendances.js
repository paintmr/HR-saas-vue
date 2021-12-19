import Layout from '@/layout'

// 每个子模块组件位于layout的二级路由里
export default {
  path: '/attendances',
  // name: 'attendances',
  component: Layout,
  children: [{
    path: '', // 如果子路由的path什么都不写，则当前路由为子路由的默认路由
    name: 'attendances',
    component: () => import('@/views/attendances'),
    meta: {
      title: '考勤',
      icon: 'chart'
    }
  }]
}
