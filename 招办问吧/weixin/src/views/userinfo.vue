<template>
  <div class="userinfo" id="userinfo" :class="{notLogined: !isLogined,weixin: isWeixinLogin,qq: isQQLogin,notseater: !isTopicAdmin}">
    <path-nav :current="'个人信息'">
    <a href="javascript:void(0);" @click="$router.push('/')">首页</a>
      &gt;  
    </path-nav>
    <div class="main">
      <a v-for="list in lists" class="list clear" :class="list.name" @click="gotoDetail(list.url, list.name)" v-if="!(!isLogined && list.name == 'updatepwd')">
        <div class="iconimg fl">
          <img class="icon" :src="list.icon"></i>
        </div>
        <div class="text fl">
          {{list.title}}
          <span class="dot" v-if="list.hasNew"></span>
        </div>
        <img :src="arrow" class="arrow fr">
        <div class="avatar fl" v-if="list.hasImg">
          <img :src="list.imgSrc" >
          <span class="admin" v-if="list.isSeater">V</span>
        </div>
        <div class="info fl" v-if="isLogined && list.name === 'username'">
          <p class="name">{{nickName}}</p>
          <p class="desc" v-if="isSeater">{{userSource}}</p>
          <p class="desc" v-else>{{provinceName}}</p>
        </div>
        <div class="login" v-if="!isLogined && list.hasImg" @click.stop="$router.push('/login')">登录</div>
      </a>
    </div>
    <!-- 按钮 -->
    <a href="javascript:void(0);" v-if="isLogined" class="regBtn exit" @click="exit" @touchstart="hover($event, true)" @touchend="hover($event, false)">退出登录</a>
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
        isLogined: false,
        isWeixinLogin: false,
        isQQLogin:false,
        arrow: require('../img/arrow-right.png'),
        lists: [
          {
            title: '用户昵称',
            name: 'username',
            icon: require('../img/user.png'),
            url: 'userdetail',
            hasImg: true,
            imgSrc: ''
          },
          {
            title: '我的消息',
            name: 'msg',
            icon: require('../img/message.png'),
            url: 'userNews',
            hasNew: false
          },
          {
            title: '已订阅话题',
            name: 'subscribe',
            icon: require('../img/book.png'),
            url: 'userSubscribe'
          },
          {
            title: '我的问答记录',
            name: 'asklist',
            icon: require('../img/record.png'),
            url: 'userCommentsList'
          },
          {
            title: '我的坐席',
            name: 'seat',
            icon: require('../img/seat.png'),
            url: 'userTopicList'
          },
          {
            title: '我的好友',
            name: 'friend',
            icon: require('../img/friend.png'),
            url: 'friend'
          },
          {
            title: '关于',
            name: 'about',
            icon: require('../img/about.png'),
            url: 'userAbout'
          },
          {
            title: '修改密码',
            name: 'updatepwd',
            icon: require('../img/lock.png'),
            url: 'updatepwd'
          }
        ]
      }
    },
    methods: {
      hover(ele, flag){
        var className = 'regBtn exit'
        if (flag) {
          ele.target.className = className + ' hover'
        } else {
          ele.target.className = className
        }
      },
      gotoDetail(url, name) {
        if(this.isLogined) {
          document.getElementById("userinfo").style.display = 'none'
          this.$router.push(url)
        } else if (name === 'about'){
          this.$router.push(url)
        } else {
          MessageBox.confirm('请登录您的账户后查看详细信息').then(res => {
            this.$store.commit('SET_LOGINNEXTROUTER', '/userinfo')
            this.$router.push('/login')
          }).catch(e => {
            console.log("err:"+e)
          })
        }
      },
      exit() {
        MessageBox.confirm('是否确认退出').then(res => {
          this.$store.commit('SET_USERID', '')
          this.$store.commit('SET_USERNAME', '')
          this.$store.commit('SET_ISLOGIN', false)
          this.$store.commit('SET_USERINFO', '')

          this.isLogined = false
          window.localStorage.clear()
          window.sessionStorage.clear()
          this.lists[0].imgSrc = this.$store.state.defaultPhoto
          // this.$router.push('/login')
        }).catch(e => {
          console.log("err:"+e)
        })
      }
    },
    created() {
      let state = this.$store.state
      let photo = state.userInfo.userPhoto
      this.$store.commit('SET_LOGINNEXTROUTER', '/')
      console.log(state.userInfo)
      // 是否有未读消息
      if(state.hasNews) {
        this.lists[1].hasNew = true
      }
      
      this.isLogined = state.isLogin
      this.nickName = state.userInfo.nickName
      this.userSource = state.userInfo.userSource
      this.isSeater = state.userInfo.isSeater
      this.isTopicAdmin = state.userInfo.isTopicAdmin
      this.provinceName = state.userInfo.provinceName

      if (state.userInfo.wxOpenId || state.userInfo.qqUid) {
        this.isWeixinLogin = true
        this.isQQLogin = true
      }
      this.lists[0].imgSrc = photo?this.$getRealImg(photo,this.$store.state.hostImg):this.$store.state.defaultPhoto
    }
  }
</script>

<style scoped lang="scss" src="../css/userinfo.scss"></style>
<style scoped lang="scss">
@import '../css/color.scss';
@import '../css/mixins.scss';
.weixin .updatepwd {
  display: none !important;
}
.qq .updatepwd {
  display: none !important;
}
.notseater .seat {
  display: none !important;
}
.userinfo .main {
  padding: 0;
  padding-top: .7rem;
  background-color: #EFEFEF;
  .list {
    padding-right: .3rem;
    background-color: #FFF;
    &.msg,&.about,&.updatepwd {
      border-top: 1px solid #dcdcdc;
    }
    .text {
      margin-left: 0.8rem;
    }
    .login {
      @include btn(.94rem,.4rem,.26rem,4px)
      color: $theme-color;
      margin-top: .66rem;
    }
    &.username {
      padding-right: .3rem;
      height: 1.8rem !important;
      .text, .iconimg {
        display: none;
      }
      .info {
        margin-top: .52rem;
        margin-left: .1rem;
        line-height: 0;
        .name {
          font-size: .27rem;
          line-height: 1.2;
          height: .324rem;
          margin-bottom: .1rem;
          width: 2.7rem;
          overflow: hidden;
        }
        .desc {
          font-size: .24rem;
          color: #999;
          line-height: 1;
        }
      }
      .arrow {
        margin-top: .72rem !important;
      }
      .avatar {
        position: relative;
        float: left;
        margin-top: .17rem !important;
        margin-left: .2rem;
        width: 1.4rem;
        height: 1.4rem;
      }
    }
    &.username,&.friend,&.about {
      margin-bottom: .08rem;
    }
  }
}
  
</style>
