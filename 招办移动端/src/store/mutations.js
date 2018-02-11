import * as types from './mutation-types'
import state from './state'
var staticHost=state.staticHost;


const matutaions = {
  [types.SET_CONTENT_TO_AUDIT_NUM](state, num) {
    state.contentToAuditNum = num
  },

  [types.SET_ANSWER_TO_AUDIT_NUM](state, num) {
    state.answerToAuditNum = num
  },

  [types.SET_QUESTION_TO_DEAL_NUM](state, num) {
    state.questionToDealNum = num
  },

  [types.SET_ENTRY_INDEX](state, index) {
    state.entryIndex = index
  },

  [types.SET_LOADING_STATU](state, bool) {
    state.showLoading = bool
  },

  [types.SET_LOGINNAME](state, loginName) {
    state.loginName = loginName
  },

  [types.SET_REALNAME](state, realName) {
    state.realName = realName
  },

  [types.SET_SCODE](state, sCode) {
    state.sCode = sCode
  },

  [types.SET_SCHOOL_LOGO](state, url) {
    state.schoolLogo = staticHost+url
  },


  [types.SET_CONTENT_NOT_READ_NUM](state,num){
    state.contentNotReadNum=num;
  },

  [types.SET_ANSWER_NOT_READ_NUM](state,num){
    state.answerNotReadNum=num;
  },

  [types.SET_QUESTION_NOT_READ_NUM](state,num){
    state.questionNotReadNum=num;
  },

  [types.SET_WAIT_CLAIM_NOT_READ_NUM](state,num){
    state.waitClaimNotReadNum=num;
  },

  [types.SET_WAIT_REPLY_NOT_READ_NUM](state,num){
    state.waitReplyNotReadNum=num;
  },

  [types.SET_HAS_RESOLVE_NOT_READ_NUM](state,num){
    state.hasResolveNotReadNum=num;
  },

  [types.SET_REJECT_REPLY_NOT_READ_NUM](state,num){
    state.rejectReplyNotReadNum=num;
  },

  [types.SET_ENTRY_STATUS](state,num){
    state.entryStatus=num;
  },
  [types.SET_CURRENT_CLASSIFY](state,str){
    state.currentClassify=str;
  },
  [types.SET_LOGIN_CODE](state,str){
    state.loginCode=str;
  }




}

export default matutaions
