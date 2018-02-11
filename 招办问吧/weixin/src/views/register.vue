<template>
  <div class="register">
    <path-nav :current="'注册账号'">
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
        <hr>
        <div class="list">
          <input type="text" placeholder="请输入您的手机号或邮箱号" v-model="username" @click="changeHeight($event)">
          <img :src="emptySrc" class="empty" @click="empty('username')" v-if="username.length>0">
        </div>
        <hr>
        <div class="box list">
          <input type="text" placeholder="请输入您的验证码" v-model="yanzheng" class="box box-f1 yanzheng" @click="changeHeight($event)">
          <img :src="emptySrc" class="empty" @click="empty('yanzheng')" v-if="yanzheng.length>0">
          <span class="yanzhengBtn grey" @click="getCode" v-if="isSend">{{ count + 's' }}</span>
          <span class="yanzhengBtn" @click="getCode" v-else>获取验证码</span>
        </div>
        <hr>
        <div class="list">
          <input type="password" placeholder="请输入您的账号密码" v-model="password" @click="changeHeight($event)">
          <img :src="emptySrc" class="empty" @click="empty('password')" v-if="password.length>0">
        </div>
        <hr>
        <div class="list">
          <input type="password" placeholder="请再次输入您的账号密码" v-model="password2" @click="changeHeight($event)">
          <img :src="emptySrc" class="empty" @click="empty('password2')" v-if="password2.length>0">
        </div>
        <hr>
      <div class="error" v-show="isSubmit">{{error}}</div>
      </div>
      <!-- 注册按钮 -->
      <a href="javascript:void(0);" class="regBtn" @click="register" @touchstart="hover($event, true)" @touchend="hover($event, false)">注&nbsp;&nbsp;册</a>
    </div>
    <v-loading :isRequest="isRequest"></v-loading>
  </div>
</template>

<script>
import pathNav from '../components/path.vue'
import {Indicator, Toast} from 'mint-ui'

export default {
  components: {
    pathNav,
   "v-loading": require('../components/loading.vue')
  },
  data() {
    return {
      logoSrc: require('../img/logo.png'),
      emptySrc: require('../img/empty.png'),
      username: '',
      yanzheng: '',
      password: '',
      password2: '',
      isSend: false,
      count: 120,
      isSubmit: false,
      error: '错误提示',
      isRequest:false
      // nameCorrect: true,
      // passCorrect: true,
    }
  },
  methods: {
    hover(ele, flag){
      var className = 'regBtn'
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
    countdown() {
      let that = this
      this.isSend = true
      let counting = setInterval(function() {
        that.count--
        if (that.count <= 0) {
          that.isSend = false
          clearInterval(counting)
          that.count = 120
        }
      }, 1000)
    },
    getCode() {
      // 加个不可点击
      if (this.isSend === true) {
        return
      }
      if (this.username === '') {
        this.error = '手机号或邮箱不能为空'
        this.isSubmit = true
        return
      }
      let state = this.$store.state
      this.countdown()

      let that = this
      let accountType = 1
      if (this.username.indexOf('@') !== -1) {
        accountType = 2
      }
      console.log(accountType)
      if (accountType === 1) {
        let url = state.host + state.baseUrl + '/common/sendMobileValidCode?mobile=' + that.username + '&codeType=100'
        this.$http.get(url).then((res) => {
          console.log(res.data)
        })
        // this.$http.post(url, {mobile: that.username, codeType: 100}).then((res) => {
        // })
      } else if (accountType === 2) {
        let url = state.host + state.baseUrl + '/common/sendEmailValidCode?email=' + that.username + '&codeType=100'
        this.$http.get(url).then((res) => {
          console.log(res.data)
        })
        // this.$http.post(url, {email: that.username, codeType: 100}).then((res) => {
        // })
      }
    },
    register() {
      let state = this.$store.state
      let pass = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,15}')
      // 前端判断用户名密码
      if (this.username === '') {
        this.error = '账号不能为空'
        this.isSubmit = true
      } else if (this.yanzheng === '') {
        this.error = '验证码不能为空'
        this.isSubmit = true
      } else if (this.password === '' || this.password2 === '') {
        this.error = '密码不能为空'
        this.isSubmit = true
      } else if (this.password !== this.password2) {
        this.error = '两次密码不一致'
        this.isSubmit = true
      } else if (!pass.test(this.password)) {
        console.log(pass.test(this.password))
        this.error = '密码为包含数字字母特殊字符的6-15位长度'
        this.isSubmit = true
      } else {
        this.isSubmit = false
      }
      if (this.isSubmit === true) {
        return
      }
      
      let that = this
      that.isRequest = true
      let accountType = 1
      if (this.username.indexOf('@') !== -1) {
        accountType = 2
      }
      let url = state.host + state.baseUrl + '/user/register?account=' + that.username + '&validCode=' + that.yanzheng + '&password=' + that.password + '&accountType=' + accountType
      
      this.$http.get(url, '', true).then(res => {
        that.isRequest = false
        let data = res.data
        if (data.code === '000000') {
          this.$router.push('/login')
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
      // this.$http.post(url, {account: that.username, validCode: that.yanzheng, password: that.password, accountType: that.accountType}).then((res) => {
      // })
    }
  }
}
</script>

<style src="../css/register.scss" lang="scss" scoped></style>
