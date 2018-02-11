var env='test';
var hostObj={
  test:{
    host:'http://192.168.31.224:8081',
    // host:'http://47.93.160.65',
    // host:'http://192.168.31.224:8082',
    staticHost:'http://zndytest.oss-cn-beijing.aliyuncs.com'
  },
  prod:{
    host:'http://cw.bisu.edu.cn',
    staticHost:'http://zndyweb.oss-cn-beijing.aliyuncs.com'
  }
}[env];

const state = {
  host:hostObj.host,
  staticHost:hostObj.staticHost,
  showLoading:false,
  showDropped:false,
  footerList:sessionStorage.getItem('footerList')?JSON.parse(sessionStorage.getItem('footerList')):[],
  firstCome:sessionStorage.getItem('firstCome')?sessionStorage.getItem('firstCome'):1
}
export default state
