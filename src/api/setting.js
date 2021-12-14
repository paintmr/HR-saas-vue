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
