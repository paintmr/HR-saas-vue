import request from '@/utils/request'
/**
 * 获取员工列表
 */
export function getEmployeeList() {
  return request({
    url: '/sys/user/simple'
  })
}
/**
 * 获取员工的综合列表数据
 */
export function getEmployeeDetailList(params) {
  return request({
    url: '/sys/user',
    params
  })
}
