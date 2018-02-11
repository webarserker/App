import Vue from 'vue'
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Vue.filter('formatTime', function(time,now,fmtModule) {
  if (!time) return '';
  var showTime;
  var cutTime = now - time;
  // console.log(now,time)
  if (fmtModule == 'yyyy-MM-dd hh:mm') {
    return new Date(time).Format(fmtModule)
  }
  if(cutTime < 1000*60) {
    showTime = '刚刚'
  } else if(cutTime >= 1000*60 && cutTime < 1000*60*60){
    showTime = Math.floor(cutTime/(1000*60)) + '分钟前'
  } else if(cutTime >= 1000*60*60 && cutTime < 1000*60*60*24){
    showTime = Math.floor(cutTime/(1000*60*60)) + '小时前'
  } else {
    showTime = new Date(time).Format(fmtModule ? fmtModule : 'yyyy-MM-dd')
  }
  return showTime;
})
Vue.filter('cutString', function(str, start, end) {
  return str ? str.substring(start,end) : ''
})
// 网络图片和本地图片的处理
Vue.filter('getRealImg', function(url, localHost) {
  return  url.substring(0,4).toLowerCase()==='http' ? url  :localHost+url
})