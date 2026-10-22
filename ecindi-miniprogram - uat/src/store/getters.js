const getters = {
  hasLogin: (state) => state.root.user && state.root.user.id,
  user: (state) => state.root.user,
  isRegistered: (state) => state.root.user && state.root.user.isRegistered, //是否注册
  isFirstLogin: (state) => state.root.user && state.root.user.isFirstLogin, //是否第一次登录
  appTitle: (state) => state.root.appTitle,
  genderList: (state) => state.root.genderList,
  mariageList: (state) => state.root.mariageList,
  initDone: (state) => state.root.initDone,
  initWelcome: (state) => state.root.initWelcome
}
export default getters
