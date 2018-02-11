<template>
  <div class="userlist">
    <path-nav :current="text" :name="'userinfo'">
    <a href="javascript:void(0);" @click="$router.push('/')">首页</a>
      &gt;  
    </path-nav>
    <div class="main">
      <div class="nav clear box" id="nav">
        <a @click="gotoDetail('/userlist/usertab1', 0)" class="box-f1"><span>用户列表</span></a>
        <a @click="gotoDetail('/userlist/usertab2', 1)" class="box-f1"><span>我的好友</span></a>
        <a @click="gotoDetail('/userlist/usertab3', 2)" class="box-f1"><span>好友动态</span></a>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import pathNav from '../components/path.vue'
  import { MessageBox } from 'mint-ui'

  export default {
    components: {
      pathNav,
      MessageBox
    },
    data() {
      return {
        text: '用户列表',
        active: 0
      }
    },
    methods: {
      gotoDetail(url, index) {
        let isLogined = this.$store.state.isLogin
        
        this.active = index
        if(isLogined) {
          if(index === 0) {
            this.text = '用户列表'
          }
          if(index === 1) {
            this.text = '我的好友'
          }
          if(index === 2) {
            this.text = '好友动态'
          }
          window.localStorage.setItem('activeIndex', index)
          this.$router.push(url)
        } else if(index === 0){
          this.$router.push(url)
        } else {
          MessageBox.confirm('请登录您的账户后查看详细信息').then(res => {
            this.$store.commit('SET_LOGINNEXTROUTER', '/userlist')
            this.$router.push('/login')
          }).catch(e => {
            console.log("err:"+e)
          })
        }
      },
      toggleActive(index) {
        let nav = document.getElementById('nav')
        if (!nav) {
          return
        }
        let link = nav.getElementsByTagName('a')
        for (var i = link.length - 1; i >= 0; i--) {
          link[i].className = "box-f1"
        };
        if (index != undefined) {
          link[index].className = "box-f1 router-link-active"
          return
        }
        link[this.active].className = "router-link-active"
      }
    },
    mounted() {
      let nav = document.getElementById('nav')
      let link = nav.getElementsByTagName('a')
      let activeIndex = window.localStorage.getItem('activeIndex')

      this.active = activeIndex?activeIndex:0
      link[this.active].className = "box-f1 router-link-active"
    },
    updated() {
      var path = this.$route.path
      var o = path.split('');
      var index = parseInt(o[o.length-1])-1
      if(!isNaN(index)) {
        this.toggleActive(index)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../css/color.scss";
  @import "../css/mixins.scss";

  .userlist {
    font-family: PingFangSC-Regular,Hiragino Sans GB,Microsoft Yahei,sans-serif;
    height: 100%;
    .main {
        height: 100%;
        padding-top: 1.3rem;
      // padding-top: .7rem;
      .mint-tab-container {
        padding-top: 1.3rem;
      }
      .nav {
        position: absolute;
        top: .7rem;
        width: 100%;
        line-height: .66rem;
        height: .64rem;
        border-bottom: 1px solid #e0e0e0;
        background-color: #fff;
        z-index: 999;
        overflow: hidden;
        // padding-top: .10rem;
        a {
          float: left;
          // width: 33.2%;
          // padding: 0 .15rem;
          box-sizing:border-box;
          text-align: center;
          color: #555;
          margin: 0 .5rem;
          span {
            font-size: 0.36rem;
          }
          &.router-link-active{
            color: $theme-color;
            border-bottom: 1px solid $theme-color;
          }
        }
      }
    }
  }
</style>

