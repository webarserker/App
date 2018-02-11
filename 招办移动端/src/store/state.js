var env='test';
var hostObj={
  test:{
    host:'http://test.zhinengdayi.com/weixin/api',
    staticHost:'http://zndytest.oss-cn-beijing.aliyuncs.com',
    wxLoginHost:'http://test.rocklee.com.cn/weixin/index?from=admin',
    wxShareHost:'http://aliyun.rocklee.com.cn/#/login'
  },
  prod:{
    host:'http://www.zhinengdayi.com/weixin/api',
    staticHost:'http://zndyweb.oss-cn-beijing.aliyuncs.com',
    wxLoginHost:'http://weixin.zhinengdayi.com/weixin/index?from=admin',
    wxShareHost:'http://wxadmin.zhinengdayi.com/#/login'
  }
}[env];

const state = {
  host:hostObj.host,
  staticHost:hostObj.staticHost,
  loginName:localStorage.getItem('zb_userName')?localStorage.getItem('zb_userName'):'',
  realName:localStorage.getItem('zb_realName')?localStorage.getItem('zb_realName'):'',
  sCode:localStorage.getItem('zb_sCode')?localStorage.getItem('zb_sCode'):'',
  schoolLogo:localStorage.getItem('zb_schoolLogo')?localStorage.getItem('zb_schoolLogo'):'',
  /*顶部跑马灯的3个未处理的数量*/
  contentToAuditNum:sessionStorage.getItem('zb_contentToAuditNum')?sessionStorage.getItem('zb_contentToAuditNum'):0,
  answerToAuditNum:sessionStorage.getItem('zb_answerToAuditNum')?sessionStorage.getItem('zb_answerToAuditNum'):0,
  questionToDealNum:sessionStorage.getItem('zb_questionToDealNum')?sessionStorage.getItem('zb_questionToDealNum'):0,
  /*首页3个入口模块的各个的未读的数量*/
  contentNotReadNum:sessionStorage.getItem('zb_contentNotReadNum')?sessionStorage.getItem('zb_contentNotReadNum'):0,
  answerNotReadNum:sessionStorage.getItem('zb_answerNotReadNum')?sessionStorage.getItem('zb_answerNotReadNum'):0,
  questionNotReadNum:sessionStorage.getItem('zb_questionNotReadNum')?sessionStorage.getItem('zb_questionNotReadNum'):0,
  /*快捷答疑列表页的4个总模块的各个未读的数量*/
  waitClaimNotReadNum:sessionStorage.getItem('zb_waitClaimNotReadNum')?sessionStorage.getItem('zb_waitClaimNotReadNum'):0,
  waitReplyNotReadNum:sessionStorage.getItem('zb_waitReplyNotReadNum')?sessionStorage.getItem('zb_waitReplyNotReadNum'):0,
  hasResolveNotReadNum:sessionStorage.getItem('zb_hasResolveNotReadNum')?sessionStorage.getItem('zb_hasResolveNotReadNum'):0,
  rejectReplyNotReadNum:sessionStorage.getItem('zb_rejectReplyNotReadNum')?sessionStorage.getItem('zb_rejectReplyNotReadNum'):0,
  entryIndex:sessionStorage.getItem('zb_entryIndex')?sessionStorage.getItem('zb_entryIndex'):0,
  showLoading:false,     //存放页面请求数据前loading效果的状态
  entryStatus:1,
  currentClassify:'',
  loginCode:'注意：需招办管理员在智能答疑PC版后台分配账户。'
}
export default state
