import request from '@/utils/request'

/**
 * 获取组织架构的数据
 * 这个请求的API的method是get。由于默认的method是get，所以这里可以不用写method。
 */
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

/**
 * 删除组织架构的部门
 */
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete' // 接口满足Restful接口规范
    // 同样的地址，不同的方法，执行不同的业务
    // delete 删除业务
    // get 获取业务
    // post 新增业务
    // put 修改业务
  })
}
/**
 * 新增部门
 */
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data: data // axios的body参数是data
  })
}
