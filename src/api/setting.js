import request from '@/utils/request'

/**
 * 获取角色列表
 * params是接口文档中的Query：page，pagesize
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
/**
 * 获取公司信息
 */
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
/**
 * 删除角色
 */
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
/**
 * 获取角色详情
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
/**
 * 修改角色
 */
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
