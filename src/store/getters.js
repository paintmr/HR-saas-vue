const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username, // 获取用户名
  userId: state => state.user.userInfo.userId, // 建立用户id的映射
  avatar: state => state.user.userInfo.staffPhoto
}
export default getters
