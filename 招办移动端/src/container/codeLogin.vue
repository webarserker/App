<template>

  <div class="codeLogin">
    <Notice></Notice>
    <Tab entryName="请确认登录智能答疑后台"></Tab>
    <div class="main">
      <div>
        <img :src="$store.state.schoolLogo" >
        <h1>请确认登录</h1>
        <h2>&lt;智能答疑后台管理系统&gt;</h2>
        <button class="login-btn" @click="codeLogin">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</button>
      </div>
    </div>
  </div>

</template>
<script>
  import Tab from '../components/tab'
  import Notice from '../components/notice'
  import {wxShare} from '../common/js/mixin'

  export default{
    mixins:[wxShare],
    components:{Notice,Tab},
    methods:{
        codeLogin(){
            this.$http.get(this.$store.state.host+'/sysUser/entryQrcodeLogin'+'?key='+sessionStorage.zb_wxCodeKey+'&token='+localStorage.zb_userToken).then(res=>{
                res=res.body;


              //如果账号被挤下去了的话
              if (res.code == '040004') {
                localStorage.setItem('zb_userToken','');
                this.$router.push({
                  path: '/login'
                })
              }


              if(res.data.status==1){
                  this.$router.push({
                    path: '/home'
                  })
                }else if(res.data.status==2){
                    alert('二维码过期')
                }else if(res.data.status==0){
                    alert('系统异常')
                }
          })
        }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "../common/css/variable";
  .codeLogin{
    padding-top:.6rem;
    .main{
      position:fixed;
      top:.72rem;
      left:0;
      right:0;
      bottom:0;
      display:flex;
      align-items:center;
      &>div{
        height:70%;
        text-align:center;
        width:100%;
        img{
          width:35%;
        }
        h1,h2{
          color:@theme;
          font-size:.16rem;
        }
        h1{
          margin-top:.35rem;
        }
        h2{
          margin-top:.1rem;
        }
      }
      .login-btn{
        background: @theme;
        width: 2.4rem;
        height: .3rem;
        border:none;
        line-height:.3rem;
        border-radius: .15rem;
        color: #fff;
        font-size: .14rem;
        display: block;
        margin: .6rem auto 0;
        outline:none;
      }
    }
  }
</style>
