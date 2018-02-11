<template>
  <div class="voice">
    <p class="title">请长按语音按钮进行说话</p>
    <textarea id="voice-content" placeholder="回复内容：" v-model="inpVal"></textarea>
    <div class="control">

      <p id="tip">{{tip}}</p>

      <div class="control-main">
        <span class="cancel" @click="saying=false;inpVal='';$emit('voiceCancel')">取消</span>
        <div class="left_ani">
          <b v-for="(item,index) in new Array(9)" :class="{'active':saying}"></b>
        </div>
        <div :class="['toSay',{'active':saying}]" @touchstart.stop.prevent="sayingStart"
             @touchend.stop.prevent="sayingEnd">
          <i class="icon-voice"></i>
        </div>
        <div class="right_ani">
          <b v-for="(item,index) in new Array(9)" :class="{'active':saying}"></b>
        </div>
        <span class="ensure" @click="saying=false;$emit('voicePost',inpVal)">确认</span>
      </div>


    </div>

  </div>
</template>
<script>
  export default{
    created(){
      this.$http.get(this.$store.state.host + '/getJsSign' + '?url=' + window.location.href).then(res => {
        res = res.body;
        console.log(res);

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
            'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
      })
    },
    data(){
      return {
        saying: false,
        inpVal: '',
        session: null,
        tip: ''
      }
    },
    methods: {
      sayingStart(){
        this.saying = true
        console.log(wx);

        wx.startRecord();


      },
      sayingEnd(){
        this.saying = false
        var _this = this;

        wx.stopRecord({
          success: function (res) {
            var localId = res.localId;
            wx.translateVoice({
              localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: function (res) {
//                alert(res.translateResult); // 语音识别的结果
                var result = res.translateResult;
                if (!result) {
                  _this.tip = '抱歉，没有识别出您的语音';
                  result = '';
                } else {
                  _this.tip = '';
                }

                _this.inpVal += result;
                document.getElementById('voice-content').focus();

              }
            });

          },
          fail: function () {
            alert('录音失败')
          }
        });
      }
    },
    mounted(){

    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/variable";

  .voice {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 700;
    padding: .12rem .12rem;
    p.title {
      color: @theme;
      font-size: .14rem;
    }
    #voice-content {
      resize: none;
      width: 100%;
      height: 1.7rem;
      box-sizing: border-box;
      padding: .06rem;
      background: #fcfcfc;
      border: 1px solid #ddd;
      margin-top: .08rem;
      font-size: .14rem;
      outline: none;
    }

    .control {
      position: absolute;
      width: 100%;
      height: 1.2rem;
      left: 0;
      bottom: .1rem;

      .control-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 .12rem;
        box-sizing: border-box;
        user-select: none;
        background-color: #fff;
        height: .6rem;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
      }
      #tip {
        position: absolute;
        top: 0;
        width: 100%;
        height: .3rem;
        line-height: .3rem;
        font-size: .15rem;
        color: #C32F29;
        text-align: center;
      }
      span {
        font-size: .15rem;
        padding: 0 .1rem;
        &.cancel {
          color: #999;
        }
        &.ensure {
          color: #4da622;
        }
      }
      .toSay {
        width: .5rem;
        height: .5rem;
        text-align: center;
        border-radius: 50%;
        color: @theme;
        border: 1px solid @theme;
        &.active {
          color: #fff;
          background: @theme;
          border: none;
          line-height: .5rem;
        }
        i {
          font-size: .3rem;
          line-height: .48rem;
        }
      }
      .left_ani,
      .right_ani {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: .45rem;
        b {
          width: 2px;
          background: @theme;
          &.active {
            animation: ani .9s infinite;
          }
        }
      }
      .left_ani {
        padding-right: 8px;
        b:nth-of-type(1) {
          animation-delay: .9s !important;
        }
        b:nth-of-type(2) {
          animation-delay: .8s !important;
        }
        b:nth-of-type(3) {
          animation-delay: .7s !important;
        }
        b:nth-of-type(4) {
          animation-delay: .6s !important;
        }
        b:nth-of-type(5) {
          animation-delay: .5s !important;
        }
        b:nth-of-type(6) {
          animation-delay: .4s !important;
        }
        b:nth-of-type(7) {
          animation-delay: .3s !important;
        }
        b:nth-of-type(8) {
          animation-delay: .2s !important;
        }
        b:nth-of-type(9) {
          animation-delay: .1s !important;
        }
      }
      .right_ani {
        padding-left: 8px;
        b:nth-of-type(1) {
          animation-delay: .1s !important;
        }
        b:nth-of-type(2) {
          animation-delay: .2s !important;
        }
        b:nth-of-type(3) {
          animation-delay: .3s !important;
        }
        b:nth-of-type(4) {
          animation-delay: .4s !important;
        }
        b:nth-of-type(5) {
          animation-delay: .5s !important;
        }
        b:nth-of-type(6) {
          animation-delay: .6s !important;
        }
        b:nth-of-type(7) {
          animation-delay: .7s !important;
        }
        b:nth-of-type(8) {
          animation-delay: .8s !important;
        }
        b:nth-of-type(9) {
          animation-delay: .9s !important;
        }
      }
    }

  }

  @keyframes ani {
    0% {
      height: 0;
      opacity: 0;
    }
    20% {
      height: .15rem;
      opacity: .5;
    }
    50% {
      height: .3rem;
      opacity: 1;
    }
    80% {
      height: .15rem;
      opacity: .5;
    }
    100% {
      height: 0%;
      opacity: 0;
    }
  }


</style>
