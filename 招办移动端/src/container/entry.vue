<template>
  <div class="entry">
    <Notice></Notice>
    <div class="wrapper">
      <ul class="entrys">
        <li v-for="(item,index) in entryList">
          <div class="entryItem">
            <div class="blue" @click="entryToIt(index)">
              <i :class="item.icon"></i>
              <span class="red" v-show="Number(entryRedList[index])"></span>
            </div>
            <p>{{item.title}}</p>
          </div>
        </li>
      </ul>
      <div class="scan" @click="sao">
        <i class="icon-saoma"></i>
      </div>
      <h2>扫码登录PC后台</h2>
      <div class="atBottom">
        <p class="realName"><span v-html="realName"></span>，欢迎登录，请注意休息哦！</p>
        <a class="out-login" @click.prevent="logout">退 出 登 录</a>
      </div>

    </div>


    <div class="foot">
      <p>智能答疑管理系统-便捷版 V1.0</p>
      <p>{{schoolName}}</p>
    </div>

    <div class="logout-view" v-show="willLogOut">
      <div class="warning">
        <div class="warning-content">
          <span>!</span>
          <div>
            <p>退出后不会删除任何临时历史数据，</p>
            <p>下次登录依然可以使用本账号。</p>
          </div>
        </div>
      </div>
      <div class="btns">
        <button class="click-out" @click="clickOut">退 出 登 录</button>
        <button class="click-cancel" @click="clickCancel">取 &nbsp;&nbsp;消</button>
      </div>
    </div>
    <Toast :toastWords="toastWords" v-show="showToast"></Toast>
  </div>


</template>
<script>
  import Notice from '../components/notice.vue'
  import Toast from '../components/toast.vue'
  import {wxShare} from '../common/js/mixin'
  export default{
    mixins:[wxShare],
    components: {Notice, Toast},
    mounted(){
      this.$store.commit('SET_ENTRY_STATUS', 0);
    },
    created(){
      var href = window.location.href;
      if (href.indexOf('userToken') != -1) {
        var arr = href.split('?');
        var _href = arr[0];
        var arr2 = arr[1].split('=');
        if (arr2[1]) {
          localStorage.setItem('zb_userToken', arr2[1]);
          this.$http.get(this.$store.state.host + '/sysUser/getSysUserByUserToken' + '?userToken=' + arr2[1]).then(res => {
            res = res.body;
            if (res.code == '040004') {
              this.$router.push({
                path: '/login'
              })

            } else if(res.code=='000000'){
              localStorage.setItem('zb_schoolName', res.data.schoolName)
              localStorage.setItem('zb_userToken', res.data.userToken);
              localStorage.setItem('zb_loginName', res.data.loginName);
              localStorage.setItem('zb_realName', res.data.realName);
              localStorage.setItem('zb_sCode', res.data.sCode);
              window.location.href = _href;
            }else{
                this.vali('系统异常');
            }
          })
        } else {
//          this.$store.commit('SET_LOGIN_CODE','请先在PC后台“系统管理>>个人资料”页面用微信扫码与账号进行绑定')
          sessionStorage.setItem('zb_wxLoginFaild','请先在PC后台“系统管理>>个人资料”页面用微信扫码与账号进行绑定')
          this.$router.push({
            path: '/login'
          })

        }

      } else {
        //防止用户退出登录后回退到首页
        if (localStorage.zb_userToken == '') {
          this.$router.push({
            path: "/login"
          })
        }

        this.$http.get(this.$store.state.host + '/sysUser/getNotReadTaskNum' + '?userToken=' + localStorage.zb_userToken).then(res => {
          res = res.body;
          console.log(res);

          //如果账号被挤下去了的话
          if (res.code == '040004') {
            localStorage.setItem('zb_userToken', '');
            this.$router.push({
              path: '/login'
            })

          } else if (res.code == '999999') {
            this.vali('系统异常');
          } else if (res.code == '000000') {

            this.entryRedList = [res.data.contentNotReadNum, res.data.answerNotReadNum, res.data.questionNotReadNum];
            /*改变全局的未读数量*/
            sessionStorage.setItem('zb_contentNotReadNum', res.data.contentNotReadNum);
            sessionStorage.setItem('zb_answerNotReadNum', res.data.answerNotReadNum);
            sessionStorage.setItem('zb_questionNotReadNum', res.data.questionNotReadNum);

            sessionStorage.setItem('zb_waitClaimNotReadNum', res.data.waitClaimNotReadNum);
            sessionStorage.setItem('zb_waitReplyNotReadNum', res.data.waitReplyNotReadNum);
            sessionStorage.setItem('zb_hasResolveNotReadNum', res.data.hasResolveNotReadNum);
            sessionStorage.setItem('zb_rejectReplyNotReadNum', res.data.rejectReplyNotReadNum);


            this.$store.commit('SET_CONTENT_NOT_READ_NUM', res.data.contentNotReadNum);
            this.$store.commit('SET_ANSWER_NOT_READ_NUM', res.data.answerNotReadNum);
            this.$store.commit('SET_QUESTION_NOT_READ_NUM', res.data.questionNotReadNum);

            this.$store.commit('SET_WAIT_CLAIM_NOT_READ_NUM', res.data.waitClaimNotReadNum);
            this.$store.commit('SET_WAIT_REPLY_NOT_READ_NUM', res.data.waitReplyNotReadNum);
            this.$store.commit('SET_HAS_RESOLVE_NOT_READ_NUM', res.data.hasResolveNotReadNum);
            this.$store.commit('SET_REJECT_REPLY_NOT_READ_NUM', res.data.rejectReplyNotReadNum);
          }else{
              this.vali('系统异常')
          }

        })
      }

    },
    computed: {
//      entryRedList() {
//        return [this.$store.state.contentNotReadNum, this.$store.state.answerNotReadNum, this.$store.state.questionNotReadNum]
//      }
    },
    data(){
      return {
        realName:localStorage.zb_realName,
        toastWords: '',
        showToast: false,
        entryRedList: [],
        entryList: [
          {
            "title": "内容审核",
            "icon": "icon-neirong"
          },
          {
            "title": "答疑审核",
            "icon": "icon-dayi"
          },
          {
            "title": "快捷答疑",
            "icon": "icon-kuaijie"
          },
          {
            "title": "其他",
            "icon": "icon-qita"
          }
        ],
        schoolName: localStorage.getItem('zb_schoolName'),
        willLogOut: false,
        toastTimer: null
      }
    },
    methods: {
      vali(words){
        this.toastWords = words;
        this.showToast = true;
        var _this = this;
        this.toastTimer = setTimeout(function () {
          _this.showToast = false
        }, 2000)
      },
      sao(){
        var _this = this;
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果

//            var arr=result.split('?');
//            sessionStorage.setItem('zb_wxCodeHost',arr[0]);
//            var arr2=arr[1].split('=');
//            localStorage.setItem('zb_wxCodeKey',arr[2]);
//            sessionStorage.setItem('zb_wxCodeKey',res.key);

            if (result != '') {
              _this.$http.get('' + _this.$store.state.host + result).then(res => {
                res = res.body;

                //如果账号被挤下去了的话
                if (res.code == '040004') {
                  localStorage.setItem('zb_userToken', '');
                  this.$router.push({
                    path: '/login'
                  })
                }


                sessionStorage.setItem('zb_wxCodeKey', res.data.key);
                if (res.data.status == 1) {
                  _this.$router.push({
                    path: '/codeLogin'
                  })
                } else if (res.data.status == 2) {
                  alert('二维码过期')
                } else if (res.data.status == 0) {
                  alert('系统异常')
                }
              })
            }
          }
        });

//        this.vali('即将开通，敬请期待')

      },
      logout(){
        this.willLogOut = true;
      },
      clickOut(){
        localStorage.setItem('zb_userToken', '');
        this.$router.push({
          path: '/login'
        })
      },
      clickCancel(){
        this.willLogOut = false;
      },
      entryToIt(index){
        sessionStorage.setItem('zb_entryIndex', index);
        this.$store.commit('SET_ENTRY_INDEX', index);
        this.$router.push({
          'path': `/home/contentList${index + 1}`
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/variable";

  .entry {
    p.realName{
      font-size:.13rem;
      line-height:.3rem;
      color:#777;
    }
    padding-top: .36rem;
    .wrapper {
      position: absolute;
      top: .36rem;
      bottom: .56rem;
      width: 100%;
    }
    .atBottom {
      position: absolute;
      width: 100%;
      bottom: .15rem;
      text-align: center;
    }
    .logout-view {
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .3);
      .warning {
        position: absolute;
        left: 0;
        bottom: .96rem;
        width: 100%;
        display: flex;
        align-items: center;
        height: .5rem;
        background: rgba(0, 0, 0, .5);
        .warning-content {
          width: 82%;
          height: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          color: #fff;
          span {
            width: .28rem;
            height: .28rem;
            border-radius: 50%;
            background: #DC5758;
            display: block;
            line-height: .3rem;
            text-align: center;
            font-size: .2rem;
          }
          div {
            flex: 1;
            text-align: center;
            p {
              line-height: 1.3;
              font-size: .13rem;
            }
          }
        }
      }
      .btns {
        height: .96rem;
        background: #fff;
        text-align: center;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        button {
          margin-top: .12rem;
          &.click-out {
            background: @theme;
            width: 2.4rem;
            height: .3rem;
            border-radius: .15rem;
            color: #fff;
            font-size: .14rem;
            border: none;
            outline: none;
          }
          &.click-cancel {
            background: #bfbfbf;
            color: #333;
            font-size: .14rem;
            width: 2.4rem;
            height: .3rem;
            border-radius: .15rem;
            border: none;
            outline: none;
          }
        }
      }
    }
    .scan {
      width: .6rem;
      height: .6rem;
      border-radius: 50%;
      margin: 0 auto;
      background: #F19149;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: .32rem;
    }
    h2 {
      font-size: .14rem;
      color: #333;
      text-align: center;
      margin-top: .1rem;
    }
    a.out-login {
      color: #047cb1;
      font-size: .14rem;
      text-align: center;
      margin-top: .2rem;
      padding-bottom: 1px;
      border-bottom: 1px solid #047cb1;
    }
    .foot {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: .56rem;
      background: @theme;
      text-align: center;
      p {
        color: #fff;
        line-height: .28rem;
        font-size: .13rem;
      }
    }
    .entrys {
      padding-top: .3rem;
      overflow: hidden;
      padding-left: .1rem;
      padding-right: .1rem;
      li {
        width: 50%;
        padding-bottom: .2rem;
        float: left;
        display: flex;
        justify-content: center;
        .entryItem {
          text-align: center;
          width: .8rem;
          .blue {
            width: .76rem;
            height: .76rem;
            border-radius: .13rem;
            background: @theme;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
              color: #fff;
              font-size: .44rem;
            }
            span.red {
              position: absolute;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #E15B53;
              right: .1rem;
              top: .1rem;
            }
          }
          p {
            margin-top: .09rem;
            font-size: .14rem;
          }
        }
      }
    }
  }
</style>
