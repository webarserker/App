export const wxShare={
  created(){
    var _this=this;
    this.$http.get(this.$store.state.host + '/getJsSign' + '?url=' + window.location.href).then(res => {
      res = res.body;

      //如果账号被挤下去了的话
      if (res.code == '040004') {
        localStorage.setItem('zb_userToken', '');
        this.$router.push({
          path: '/login'
        })
      }


      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonce, // 必填，生成签名的随机串
        signature: res.signature,// 必填，签名，见附录1
        jsApiList: [
          'onMenuShareTimeline', 'onMenuShareAppMessage','scanQRCode','startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice'
//            'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo',
//            'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice',
//            'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage',
//            'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation',
//            'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems',
//            'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay',
//            'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function(){
        wx.onMenuShareAppMessage({
          title: '招办智能答疑管理系统', // 分享标题
          desc:'招办便捷答疑、审批的智能管理系统，为招办实现快速答疑服务及工作审批服务。',
          imgUrl:'http://zndyweb.oss-cn-beijing.aliyuncs.com/imgServer/logo/complogo.png',
          link:_this.$store.state.wxShareHost,
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareTimeline({
          title: '招办智能答疑管理系统', // 分享标题
          imgUrl: 'http://zndyweb.oss-cn-beijing.aliyuncs.com/imgServer/logo/complogo.png', // 分享图标
          link:_this.$store.state.wxShareHost,
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });
      })
    })
  }
}
