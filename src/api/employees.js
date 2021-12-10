import request from '@/utils/request'
/**
 * 获取员工列表
 */
export function getEmployeeList() {
  return request({
    url: '/sys/user/simple'
  })
}
