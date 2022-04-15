const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username, // 获取用户名
  userId: state => state.user.userInfo.userId, // 建立用户id的映射
  avatar: state => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId,
  routes: state => state.permission.routes // 建立权限模块下的快捷访问
}
export default getters
