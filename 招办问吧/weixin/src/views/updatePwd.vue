<template>
  <div class="register update" id="wrap">
    <path-nav :current="'修改密码'">
      <a href="javascript:void(0);" @click="$router.push('/')">首页</a>
      &gt;  
      <a href="javascript:void(0);" @click="$router.push('/userinfo')">个人信息</a>
      &gt;
    </path-nav>
    <div class="form">
      <div class="list">
        <input type="password" placeholder="请输入旧密码" v-model="oldPassword">
      </div>
      <div class="list">
        <input type="password" placeholder="请输入新密码" v-model="password">
      </div>
      <div class="list">
        <input type="password" placeholder="请再次输入新密码" v-model="password2">
      </div>
      <div class="error" v-show="isSubmit">{{error}}</div>
      <!-- 修改密码 -->
      <a href="javascript:void(0);" class="regBtn update" @click="update" @touchstart="hover($event, true)" @touchend="hover($event, false)">确&nbsp;&nbsp;定</a>
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
      oldPassword: '',
      password: '',
      password2: '',
      isSubmit: false,
      error: '错误提示',
      id: this.$store.state.userId,
      isRequest: false
    }
  },
  mounted(){
    if (!this.$store.state.isLogin) {
      this.$router.replace('/')
      return
    }
  },
  methods: {
    hover(ele, flag){
      var className = 'regBtn update'
      if (flag) {
        ele.target.className = className + ' hover'
      } else {
        ele.target.className = className
      }
    },
    update() {
      let state = this.$store.state
      let pass = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,15}')
      // 前端判断用户名密码
      if (this.password === '' || this.password2 === '' || this.oldPassword === '') {
        this.error = '密码不能为空'
        this.isSubmit = true
      } else if (this.password != this.password2) {
        this.error = '两次密码不一致'
        this.isSubmit = true
      } else if (this.oldPassword === this.password2) {
        this.error = '新密码不能和旧密码相同'
        this.isSubmit = true
      } else if(!pass.test(this.password)) {
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
      let url = state.host + state.baseUrl + '/user/updatePassword?id=' + that.id + '&password=' + that.password + '&oldPassword=' + that.oldPassword
      
      this.$http.get(url, '', true).then(res => {
        that.isRequest = false
        let data = res.data
        if (data.code === '000000') {
          this.$router.push('/login')
          Toast({message:'修改成功', duration: 2000})
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
  },
  destroyed(){
    // document.getElementById("wrap").style.display = 'none'
  }
}
</script>

<style src="../css/register.scss" lang="scss" scoped></style>
<style scoped lang="scss">
  .update {
    .form {
      padding-top: .7rem;
      .box:first-child {
        border-top: none;
      }
      a.update {
        top: 4.86rem;
      }
    }
  }
  .list:first-child {
    border-top:none !important;
  }
</style>
