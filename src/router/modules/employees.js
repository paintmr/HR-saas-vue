import Layout from '@/layout'

// 每个子模块组件位于layout的二级路由里
export default {
  path: '/employees',
  // name: 'employees',
  component: Layout,
  children: [{
    path: '', // 如果子路由的path什么都不写，则当前路由为子路由的默认路由
    name: 'employees',
    component: () => import('@/views/employees'),
    meta: {
      title: '员工管理',
      icon: 'people'
    }
  },
  {
    path: 'detail/:id', // query传参 动态路由传参
    component: () => import('@/views/employees/detail'),
    hidden: true, // 隐藏在左侧菜单中
    meta: {
      title: '员工详情' // 标记当前路由规则的中文名称，后续在做左侧菜单时使用
    }
  },
  {
    path: 'print/:id',
    component: () => import('@/views/employees/print'),
    hidden: true,
    meta: {
      title: '打印员工信息'
    }
  }
  ]
}
