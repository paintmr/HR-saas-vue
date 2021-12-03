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
