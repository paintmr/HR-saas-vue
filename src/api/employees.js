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
/**
 * 删除员工
 */
export function deleteEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
/**
 * 新增员工
 */
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
/**
 * 导入员工
 */
export function importEmployees(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
/**
 * 保存修改后的员工信息
 */
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
