import * as types from './mutation-types'


const matutaions = {

  [types.SET_LOADING_STATU](state, bool) {
    state.showLoading = bool
  },

  [types.SET_FOOTERLIST](state, obj) {
    state.footerList = obj
  },

  [types.SET_FIRST_COME](state, bool) {
    state.firstCome = bool
  },

  [types.SET_DROPPED](state, bool) {
    state.showDropped = bool
  }

  // [types.SET_FOOTER_TAB_INDEX](state, index) {
  //   state.footerTabIndex = index
  // }


}

export default matutaions
