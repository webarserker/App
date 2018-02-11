// import { CHANGE_SHOWFOOTER} from "./mutation-types"
export const actions = {
	// 改变是否登录状态
  CHANGE_ISLOGIN ({commit}, flag) {
    commit('SET_ISLOGIN', flag);
  },
  // 改变是否正在加载状态
	CHANGE_ISLOADING ({commit}, flag) {
		commit('SET_ISLOADING', flag);
	},
	CHANGE_SEARCHWORD ({commit}, word) {
		commit('SET_SEARCHWORD', word);
  },
}