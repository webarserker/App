<template>
  <div id="login" class="login" @click="canselSlide($event)">
    <div class="info">
      <router-link to="/about" class="aboutUs">关于我们</router-link>
      <br>
      <a class="try-login" @click="tryLogin">试用登录</a>
    </div>
    <div class="atBottom">
      <img src="../common/image/logo@2x.png" alt="" class="logo">
      <div v-if="isUserNameLogin" class="form-group">
        <div>
          <i class="icon-username"></i>
          <div class="username-group">
            <span class="icon-bottom" @click="usernameSlide=!usernameSlide"></span>
            <input type="text" placeholder="请输入正确账号" v-model="username" class="username">
            <span class="down-list" v-show="usernameSlide&&usernameList.length>0">
              <li v-for="item in usernameList" @click="chooseHistoryUser(item)">
                {{item}}
              </li>
            </span>
          </div>
        </div>
        <div>
          <i class="icon-password"></i>
          <input type="password" placeholder="请输入正确密码" v-model="userpassword" class="password">
        </div>
      </div>
      <div v-if="!isUserNameLogin" class="form-group">
        <div>
          <i class="icon-phone"></i>
          <div class="phone-group">
            <span class="icon-bottom" @click="phoneSlide=!phoneSlide"></span>
            <input type="text" placeholder="请输入正确手机号" v-model="tel" class="tel">
            <span class="down-list" v-show="phoneSlide&&phoneList.length>0">
              <li v-for="item in phoneList" @click="chooseHistoryPhone(item)">
                {{item}}
              </li>
            </span>
          </div>
        </div>
        <div>
          <i class="icon-password"></i>
          <input type="text" placeholder="请输入正确验证码" v-model="code" class="code">
          <button @click="getCode">
            <span v-show="!codeSending">获取验证码</span>
            <span v-show="codeSending" style="font-size:.14rem">
              <span style="font-size:.14rem;" v-text="codeAliveTime"></span> s
            </span>
          </button>
        </div>
      </div>

      <div class="other-way">
        <p class="line"></p>
        <p class="center">使用其他方式登录</p>
        <p class="line"></p>
      </div>
      <div class="login-entry">
        <i class="icon-weixinlogin" @click="wxEntry"></i>
        <i :class="[{'icon-phonelogin':this.isUserNameLogin,'icon-usernamelogin':!this.isUserNameLogin}]"
           @click="otherLoginWay"></i>
      </div>
      <button class="submit-btn" @click="login">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</button>
      <div style="height:.48rem;">
        <p :class="['loginExplain',{'warning':look.length>32}]" v-html="look">

        </p>
      </div>
    </div>

    <Loading v-show="$store.state.showLoading"></Loading>
    <Toast :toastWords="valiWords" v-show="showToast"></Toast>
  </div>

</template>
<script>
  import Loading from '../components/loading'
  import Toast from '../components/toast'
  import {wxShare} from '../common/js/mixin'


  var Base64 = require('js-base64').Base64;
  export default {
    mixins: [wxShare],
    components: {Loading, Toast},
    beforeDestroy() {
      this.toastTimer = null;
      this.codeAliveTimer = null;
//      this.$store.commit('SET_LOGIN_CODE', '注意：需招办管理员在智能答疑PC版后台分配账户哦')

    },
//    computed: {
//      loginExplain() {
//        return this.$store.state.loginCode
//      }
//    },
    created() {
      if (localStorage.zb_userToken == '') {
        this.$store.commit('SET_LOADING_STATU', false);
      }
      if (this.$store.state.entryStatus
        && (localStorage.zb_userToken)
        && (localStorage.zb_userName != '')
        && (localStorage.zb_password != '')) {
//        this.$router.push({
//          'path': '/home'
//        })

        this.username = localStorage.zb_userName;
        this.password = localStorage.zb_password;
        this.$store.commit('SET_LOADING_STATU', true);
        this.$http.post(this.$store.state.host + '/sysUser/login',
          {
            account: localStorage.zb_userName,
            password: Base64.encode(localStorage.zb_password),
            platformType: 2,
            appType: 3
          })
          .then((res) => {
            res = res.body;
            console.log(res);
            if (res.code != '000000') {
              this.$store.commit('SET_LOADING_STATU', false);
              this.vali(res.message);
            } else {
              //将登陆名纳入本地存储，作为下拉菜单展示
              var usernameList = localStorage.getItem('zb_usernameList') ? JSON.parse(localStorage.getItem('zb_usernameList')) : [];

              var num = 0;
              var _this = this;
              usernameList.forEach(function (v, i) {
                if (v == _this.username) {
                  usernameList.splice(i, 1);
                  usernameList.unshift(_this.username)
                  num++;
                  return;
                }
              })
              if (num == 0) {
                usernameList.unshift(this.username);
              }
              localStorage.setItem('zb_usernameList', JSON.stringify(usernameList));
              /*************************************************************************************************************/
              localStorage.setItem('zb_schoolName', res.data.schoolName)
              localStorage.setItem('zb_userToken', res.data.userToken);
              localStorage.setItem('zb_loginName', res.data.loginName);
              localStorage.setItem('zb_realName', res.data.realName);
              localStorage.setItem('zb_sCode', res.data.sCode);
              localStorage.setItem('zb_schoolLogo', this.$store.state.staticHost + res.data.schoolLogo);

//                this.$store.commit('SET_USERTOKEN',res.data.userToken);
              this.$store.commit('SET_LOGINNAME', res.data.loginName);
              this.$store.commit('SET_REALNAME', res.data.realName);
              this.$store.commit('SET_SCODE', res.data.sCode);
              this.$store.commit('SET_SCHOOL_LOGO', res.data.schoolLogo);


              this.$store.commit('SET_LOADING_STATU', false);
              this.$router.push({
                'path': '/home'
              })
            }
          })
      }
    },
    data() {
      return {
        entryStatus: sessionStorage.getItem('zb_entryStatus'),
        usernameList: localStorage.zb_usernameList ? JSON.parse(localStorage.zb_usernameList) : [],
        phoneList: localStorage.zb_phoneList ? JSON.parse(localStorage.zb_phoneList) : [],
        isUserNameLogin: true,
        username: '',
        userpassword: '',
        tel: '',
        code: '',
        usernameSlide: false,
        phoneSlide: false,
        valiWords: '',
        showToast: false,
        toastTimer: null,
        codeSending: false,
        codeAliveTime: 120,
        codeAliveTimer: null,
        fixedHeight: '',
        look:sessionStorage.zb_wxLoginFaild?sessionStorage.zb_wxLoginFaild:'注意：需招办管理员在智能答疑PC版后台分配账户'
      }
    },
    mounted() {
      this.fixedHeight = window.innerHeight;
      document.getElementById('login').style.height = this.fixedHeight + 'px';
      var _this = this;
      window.onresize = function () {
        document.getElementById('login').style.height = _this.fixedHeight + 'px';
      }
    },
    methods: {
      tryLogin() {
        this.$store.commit('SET_LOADING_STATU', true);
        this.$http.post(this.$store.state.host + '/sysUser/login',
          {
            account: 'ceshi001',
            password: Base64.encode('admin@test001'),
            platformType: 2,
            appType: 3
          })
          .then((res) => {
            res = res.body;
            console.log(res);
            if (res.code != '000000') {
              this.$store.commit('SET_LOADING_STATU', false);
              this.vali(res.message);
            } else {

              /*************************************************************************************************************/
              localStorage.setItem('zb_schoolName', res.data.schoolName)
              localStorage.setItem('zb_userToken', res.data.userToken);
              localStorage.setItem('zb_loginName', res.data.loginName);
              localStorage.setItem('zb_realName', res.data.realName);
              localStorage.setItem('zb_sCode', res.data.sCode);
              localStorage.setItem('zb_schoolLogo', this.$store.state.staticHost + res.data.schoolLogo);

//                this.$store.commit('SET_USERTOKEN',res.data.userToken);
              this.$store.commit('SET_LOGINNAME', res.data.loginName);
              this.$store.commit('SET_REALNAME', res.data.realName);
              this.$store.commit('SET_SCODE', res.data.sCode);
              this.$store.commit('SET_SCHOOL_LOGO', res.data.schoolLogo);


              this.$store.commit('SET_LOADING_STATU', false);
              this.$router.push({
                'path': '/home'
              })
            }
          })
      },
      wxEntry() {
        window.location.href = 'http://weixin.zhinengdayi.com/weixin/index?from=admin';
      },
      canselSlide(e) {
        if (e.target.className !== 'form-group' && e.target.nodeName !== 'SPAN') {
          this.usernameSlide = false;
          this.phoneSlide = false;
        }
      },
      chooseHistoryPhone(item) {
        this.tel = item;
        this.phoneSlide = false;
      },
      chooseHistoryUser(item) {
        this.username = item;
        this.usernameSlide = false;
      },
      getCode() {
        if (!this.codeSending) {
          var reg = /^1[34578]\d{9}$/;
          if (reg.test(this.tel)) {
            this.$http.get(this.$store.state.host + '/common/sendMobileValidCode' + '?mobile=' + this.tel + '&codeType=201')
              .then((res) => {

                this.codeSending = true;
                var _this = this;
                this.codeAliveTimer = setInterval(function () {
                  if (_this.codeAliveTime <= 0) {
                    _this.codeSending = false;
                    _this.codeAliveTime = 120;
                    clearInterval(_this.codeAliveTimer)
                  } else {
                    _this.codeAliveTime--;
                  }
                }, 1000)
              })
          } else {
            this.vali('请输入正确的手机号');
          }
        }
      },
      vali(words) {
        this.valiWords = words;
        this.showToast = true;
        var _this = this;
        this.toastTimer = setTimeout(function () {
          _this.showToast = false
        }, 2000)
      },
      login() {
        if (this.isUserNameLogin) {
          this.$store.commit('SET_LOADING_STATU', true);
          this.$http.post(this.$store.state.host + '/sysUser/login',
            {
              account: this.username,
              password: Base64.encode(this.userpassword),
              platformType: 2,
              appType: 3
            })
            .then((res) => {
              res = res.body;
              console.log(res);
              if (res.code != '000000') {
                this.$store.commit('SET_LOADING_STATU', false);
                this.vali(res.message);
              } else {
                //将登陆名纳入本地存储，作为下拉菜单展示
                var usernameList = localStorage.getItem('zb_usernameList') ? JSON.parse(localStorage.getItem('zb_usernameList')) : [];

                var num = 0;
                var _this = this;
                usernameList.forEach(function (v, i) {
                  if (v == _this.username) {
                    usernameList.splice(i, 1);
                    usernameList.unshift(_this.username)
                    num++;
                    return;
                  }
                })
                if (num == 0) {
                  usernameList.unshift(this.username);
                }
                localStorage.setItem('zb_usernameList', JSON.stringify(usernameList));
                /*************************************************************************************************************/
                localStorage.setItem('zb_userName', this.username);//记录本次登陆的用户名
                localStorage.setItem('zb_password', this.userpassword);
                localStorage.setItem('zb_schoolName', res.data.schoolName)
                localStorage.setItem('zb_userToken', res.data.userToken);
                localStorage.setItem('zb_loginName', res.data.loginName);
                localStorage.setItem('zb_realName', res.data.realName);
                localStorage.setItem('zb_sCode', res.data.sCode);
                localStorage.setItem('zb_schoolLogo', this.$store.state.staticHost + res.data.schoolLogo);

//                this.$store.commit('SET_USERTOKEN',res.data.userToken);
                this.$store.commit('SET_LOGINNAME', res.data.loginName);
                this.$store.commit('SET_REALNAME', res.data.realName);
                this.$store.commit('SET_SCODE', res.data.sCode);
                this.$store.commit('SET_SCHOOL_LOGO', res.data.schoolLogo);


                this.$store.commit('SET_LOADING_STATU', false);
                this.$router.push({
                  'path': '/home'
                })
              }
            })
        } else {
          this.$store.commit('SET_LOADING_STATU', true);
          this.$http.post(this.$store.state.host + '/sysUser/loginByMobile',
            {
              mobile: this.tel,
              validCode: this.code,
              platformType: 2,
              appType: 3
            })
            .then((res) => {
              res = res.body;
              if ((res.code != '000000') && (res.code != '100008')) {
                this.$store.commit('SET_LOADING_STATU', false);
                this.vali(res.message);
              } else if (res.code == '100008') {
                this.$store.commit('SET_LOADING_STATU', false);
                this.vali('请联系系统管理员')
              } else if (res.code == '000000') {
                //将登陆手机号纳入本地存储，作为下拉菜单展示
                var phoneList = localStorage.getItem('zb_phoneList') ? JSON.parse(localStorage.getItem('zb_phoneList')) : [];

                var num = 0;
                var _this = this;
                phoneList.forEach(function (v, i) {
                  if (v == _this.tel) {
                    num++;
                    return;
                  }
                })
                if (num == 0) {
                  phoneList.unshift(this.tel);
                }
                localStorage.setItem('zb_phoneList', JSON.stringify(phoneList));
                /*************************************************************************************************************/


                localStorage.setItem('zb_schoolName', res.data.schoolName)
                localStorage.setItem('zb_userToken', res.data.userToken);
                localStorage.setItem('zb_loginName', res.data.loginName);
                localStorage.setItem('zb_realName', res.data.realName);
                localStorage.setItem('zb_sCode', res.data.sCode);
                this.$store.commit('SET_LOADING_STATU', false);
                this.$router.push({
                  'path': '/home'
                })
              }
            })
        }
      },
      otherLoginWay() {
        this.isUserNameLogin = !this.isUserNameLogin;
        if (this.isUserNameLogin) {
          this.look='注意：需招办管理员在智能答疑PC版后台分配账户';
        } else {
          this.look='请先在PC后台“系统管理>>个人资料”页面将手机号与账号进行绑定';
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../common/css/variable";
  @import "../common/css/mixin";

  .login {
    width: 100%;
    background: #fff;
    display: flex;
    align-items: center;
    position: relative;
    display: flex;
    align-items: center;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    padding-top: .38rem;
    .info {
      position: absolute;
      right: .15rem;
      top: .1rem;
      a {
        color: @theme;
        line-height: 1.7;
        font-size: .13rem;
      }
    }

    p.loginExplain {
      color: #aaa;
      padding: 5px 10px;
      line-height: 1.6;
      font-size: 12px;
      margin-left: .1rem;
      margin-right: .1rem;
      margin-top: .2rem;
      &.warning {
        color: #E15B53;
      }
    }
    .no-wifi {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      z-index: 1000;
      font-size: .16rem;
    }
    .atBottom {
      width: 100%;
      img.logo {
        max-width: 70%;
        display: block;
        margin: 0 auto .3rem;
      }
      .login-entry {
        width: .86rem;
        margin: .2rem auto .2rem;
        font-size: 0;
        i {
          width: .3rem;
          height: .3rem;
          border-radius: 50%;
          color: #37B0E8;
          display: inline-block;
          font-size: .3rem;
          &:first-child {
            color: #7BBE45;
            margin-right: .26rem;
          }
        }
      }
      .form-group {
        & > div {
          width: 100%;
          margin: .15rem 0;
          text-align: center;
          font-size: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          .username-group {
            input {
              position: relative;
              z-index: 5;
            }
          }
          .phone-group {
            input {
              position: relative;
              z-index: 5;
            }
          }
          .username-group, .phone-group {
            position: relative;
            width: 2.3rem;
            span {
              position: absolute;
              right: .06rem;
              z-index: 6;
              line-height: .26rem;
              font-size: .13rem;
              width: .26rem;
              height: .26rem;
              color: #999;
            }
            .down-list {
              position: absolute;
              top: .14rem;
              z-index: 2;
              left: 0;
              width: 100%;
              background: #fff;
              border: 1px solid #ddd;
              border-top: none;
              height: auto;
              max-height: 2rem;
              overflow-y: scroll;
              -webkit-overflow-scrolling: touch;
              padding: 0 .1rem;
              padding-top: .14rem;
              li {
                width: 100%;
                height: .4rem;
                line-height: .4rem;
                text-align: left;
                color: #666;
                &:not(:last-child) {
                  border-bottom: 1px dashed #ddd;
                }
              }
            }
          }
          i {
            color: @theme;
            font-size: .23rem;
            margin-right: .07rem;
          }

          input.username, input.password, input.tel {
            width: 2.3rem;
            border: 1px solid #DFDFDF;
            border-radius: .14rem;
            height: .28rem;
            line-height: .26rem;
            padding: 0 .1rem;
            outline: none;
            background: #f9f9f9;
            font-size: .13rem;
          }
          input.username, input.tel {
            padding-right: .32rem;
          }
          input.code {
            width: 1.35rem;
            border: 1px solid #DFDFDF;
            border-radius: .14rem;
            height: .28rem;
            line-height: .26rem;
            padding: 0 .1rem;
            outline: none;
            background: #f9f9f9;
            font-size: .13rem;
            margin-right: .1rem;
          }
          button {
            width: .85rem;
            font-size: .12rem;
            border: none;
            outline: none;
            height: .26rem;
            line-height: .26rem;
            border-radius: .13rem;
            background: #047cb1;
            color: #fff;
          }
        }
      }
      button.submit-btn {
        background: @theme;
        width: 2.4rem;
        height: .3rem;
        border: none;
        line-height: .3rem;
        border-radius: .15rem;
        color: #fff;
        font-size: .14rem;
        display: block;
        margin: .23rem auto 0;
        outline: none;

      }
      .other-way {
        display: flex;
        align-items: center;
        margin-top: .25rem;
        p {
          &.line {
            height: 1px;
            background: #eaeaea;
            flex: 1;
          }
          &.center {
            padding: 0 .12rem;
            color: #333;
            font-size: .13rem;
          }
        }
      }
    }
  }
</style>
