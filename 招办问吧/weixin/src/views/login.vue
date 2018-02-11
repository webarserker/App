<template>
  <div class="login">
    <path-nav :current="'登录'">
      <a href="javascript:void(0);" @click="$router.push('/')">首页</a>
      &gt;  
      <a href="javascript:void(0);" @click="$router.push('/userinfo')">个人信息</a>
      &gt;
    </path-nav>
    <div class="logo">
      <img :src="logoSrc" class="logo">
    </div>
    <div class="form">
      <div id="input">
        <div class="user clear list">
          <input type="text" placeholder="请输入您的账号、手机号或邮箱号" v-model="username"  autocomplete="off" class="fl" @click="changeHeight($event)">
          <div v-show="isSubmit" class="warn fr">
            <span class="correct" v-if="nameCorrect">账号输入正确</span>
            <span class="error" v-else>账号输入有误</span>
          </div>
          <img :src="emptySrc" class="empty" @click="empty('username')" v-if="username.length>0">
        </div>
        <div class="password clear list">
          <input type="password" placeholder="请输入您的账号密码" v-model="password" autocomplete="off" class="fl" @click="changeHeight($event)">
          <div v-show="isSubmit" class="warn fr">
            <span class="correct" v-if="passCorrect">密码输入正确</span>
            <span class="error" v-else>密码输入有误</span>
          </div>
          <img :src="emptySrc" class="empty" @click="empty('password')" v-if="password.length>0">
        </div>
      </div>
      <div class="otherOpt clear">
        <a href="javascript:void(0);" class="register fl" @click="$router.push('/register')">注册账号</a>
        <a href="javascript:void(0);" class="forgetPwd fr" @click="$router.push('/forgetpwd')">忘记密码？</a>
      </div>
      <!-- 登录按钮 -->
      <a href="javascript:void(0);" class="loginBtn" id="loginBtn" @click="login" @touchstart="hover($event, true)" @touchend="hover($event, false)">登&nbsp;&nbsp;录</a>

      <div class="otherLogin" @click="openOther" id="otherLogin">
        <img :src="iconArrow" class="arrow-up">
        <div class="text">其他账号登录</div>
      </div>
    </div>
    <!-- 其他登录 -->
    <div class="otherWrap" v-show="isShowOther">
      <div class="otherBg" @click="closeMain"></div>
      <transition name="slide">
        <div class="otherContent" v-show="isShowMain">
          <i class="comicon-28" @click="closeMain"></i>
          <div class="text">其他账号登录</div>
          <div class="main clear">
            <div class="weixin fl">
              <img :src="iconWeixin" class="icon-weixin" @click="loginWeixin">
              <p>微信</p>
            </div>
            <div class="qq fr">
              <img :src="iconQQ" class="icon-qq" @click="loginQQ">
              <p>QQ</p>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <v-loading :isRequest="isRequest"></v-loading>
  </div>
</template>

<script type="text/javascript">
import pathNav from '../components/path.vue'
import {Indicator, Toast} from 'mint-ui'
var Base64 = require('js-base64').Base64;

export default {
  components: {
    pathNav,
   "v-loading": require('../components/loading.vue')
  },
  data() {
    return {
      logoSrc: require('../img/logo.png'),
      iconArrow: require('../img/arrow-up.png'),
      iconWeixin: require('../img/weixin.png'),
      iconQQ: require('../img/qq.png'),
      emptySrc: require('../img/empty.png'),
      username: '',
      password: '',
      isSubmit: false,
      nameCorrect: true,
      passCorrect: true,
      isShowOther: false,
      isShowMain: false,
      btnClass:'',
      isRequest: false
    }
  },
  mounted(){
    var other = document.getElementById('otherLogin')
    var loginBtn = document.getElementById('loginBtn')
    if (this.isElementInViewport(other)) {
      console.log('visible')
    } else {
      loginBtn.className = 'loginBtn invisible'
    }
    this.btnClass = loginBtn.className 
    this.$store.commit('SET_USERID', '')
  },
  methods: {
    hover(ele, flag){
      var className = this.btnClass
      if (flag) {
        ele.target.className = className + ' hover'
      } else {
        ele.target.className = className
      }
    },
    changeHeight(e) {
      var ele = document.getElementById('input')
      setTimeout(()=> { ele.scrollIntoViewIfNeeded(); }, 500)
    },
    empty(attr) {
      this[attr] = ''
    },
    openOther() {
      this.isShowOther = true
      this.isShowMain = true
    },
    closeMain() {
      this.isShowMain = false
      // 外层延迟一点关闭，否则看不到leave动画
      setTimeout(this.closeOther, 200)
    },
    closeOther() {
      this.isShowOther = false
    },
    // 判断其元素是否在浏览器可见区域
    isElementInViewport(el) {
      var rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 && rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      );
    },
    login() {
      let state = this.$store.state
      // 前端判断用户名密码
      if (this.username === '') {
        this.error = '账号不能为空'
        this.nameCorrect = false
        this.isSubmit = true
      } else {
        this.nameCorrect = true
        this.isSubmit = false
      }
      if (this.password === '') {
        this.error = '密码不能为空'
        this.passCorrect = false
        this.isSubmit = true
      } else {
        this.passCorrect = true
        this.isSubmit = false
      }
      if (this.isSubmit === true) {
        return
      }

      let that = this
      that.isRequest = true
      let url = state.host + state.baseUrl + '/user/login'
      let password = Base64.encode(that.password)

      var formData = new FormData()
      formData.append('account', that.username)
      formData.append('password', password)

      this.$http.post(url, formData, true).then(res => {
        that.isRequest = false
        let data = res.data
        if (data.code === '000000') {
          this.$store.commit('SET_ISLOGIN', true)
          this.$store.commit('SET_USERID', data.data.id)
          this.$store.commit('SET_USERNAME', data.data.nickName)
          this.getUserInfo(data.data.id)
        } else {
          Toast({message:data.message, duration: 2000})
        }
      }, err => {
        that.isRequest = false
        Toast({message:'系统异常', duration: 2000})
      }).catch((e)=>{
        that.isRequest = false
        console.log(e)
      })
    },
    getUserInfo(id) {
      let state = this.$store.state
      let url = state.host + state.baseUrl + '/user/getUserInfoById?userId=' + id
      console.log(url)

      this.$http.get(url).then((res) => {
        let data = res.data
        console.log(data)
        this.$store.commit('SET_USERINFO', data.data)
        this.$router.replace(this.$store.state.loginNextRouter)
      })
      //获取未读消息
      window.sessionStorage.removeItem('hasNews')
      this.$http.get(state.host + state.baseUrl + '/message/isNewMessage?userId=' + state.userId).then(res => {
          this.$store.commit('SET_HASNEWS', res.data.data.flag)
      })
    },
    loginWeixin() {
      // 微信授权
      location.href = this.$store.state.hostWx
    },
    loginQQ() {
      // qq授权
      location.href = this.$store.state.hostQq
    }
  }
}
</script>

<style src="../css/login.scss" lang="scss" scoped></style>

