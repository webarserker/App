export const mutations = {
	// 设置是否登录
  SET_ISLOGIN (state, flag) {
    window.localStorage.setItem('isLogin', flag)
    state.isLogin = flag;
  },
  // 设置用户ID
  SET_USERID (state, flag) {
    window.localStorage.setItem('userId', flag)
    state.userId = flag;
  },
  // 设置用户名
  SET_USERNAME (state, flag) {
    window.localStorage.setItem('userName', flag)
    state.userName = flag;
  },
  // 设置用户信息
  SET_USERINFO (state, info) {
    window.localStorage.setItem('userinfo', JSON.stringify(info))
    state.userInfo = info;
  },
  // 设置搜索历史
  SET_SEARCHHISTORY (state, info) {
    window.localStorage.setItem('searchHistory', JSON.stringify(info))
    state.searchHistory = info;
  },
  // 设置未读消息
  SET_HASNEWS (state, flag) {
    state.hasNews = flag;
  },
  // 设置是否在加载
  SET_ISLOADING (state, flag) {
    state.isLoading = flag;
  },
	// 设置登陆后跳转的路由
  SET_LOGINNEXTROUTER (state, router) {
    state.loginNextRouter = router;
  },
  // 设置学校code
  SET_SCODE (state, sCode) {
    state.sCode = sCode;
  },
  // 设置院系ID
  SET_DEPARTMENTID (state, departmentId) {
    state.departmentId = departmentId;
  },
  // 设置专业ID
  SET_MAJORID (state, majorId) {
    state.majorId = majorId;
  },
}
