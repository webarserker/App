<template>
  <div class="all-user" ref="scrollContent">
  <ul class="list">
    <li @click="gotoDetail(list.userId, list.isSeater, list.userSource)" v-for="(list, index) in users" :id="'mt-'+ list.nickName" >
      <a class="list-large clear">
        <div class="info clear">
          <div class="avatar fl">
            <div :style="{'background-image':'url('+ (list.userPhoto?$getRealImg(list.userPhoto,$store.state.hostImg):$store.state.defaultPhoto) +') !important'}" class="box img"></div>
            <span class="admin" v-if="list.isSeater">V</span>
          </div>
          <div class="text fl">
            <p class="name ellipsis">{{list.nickName}}</p>
            <p class="desc ellipsis" v-if='list.isSeater'>{{list.userSource}}</p>
            <p class="desc ellipsis" v-else>{{list.userSource?list.userSource:'此用户很懒，没留下所在地区'}}</p>
          </div>
          <i class="btn" @click.stop="follow(list.userId,list.isAttention, list.nickName)">删除</i>
          <span class="follow followed fr" v-show="list.isAttention" @click.stop="deleteItem(list.userId,list.isAttention, list.nickName)" :style="{backgroundImage: 'url('+unfollowImg+')'}">已关注</span>
        </div>
        <div class="content">
          {{list.content?list.content:'此用户很懒，还没有留下任何足迹'}}
        </div>
      </a>
    </li>
  </ul>
  <v-loading :isRequest="isRequest" :showEnd="showEnd" :msg="'没有更多了'"></v-loading>
  </div>
</template>

<script>
// @deleteItem="deleteItem"
  import { MessageBox, Toast, Indicator} from 'mint-ui'
  import { scrollController } from '../utils/common'

  export default {
    components: {
      MessageBox,
      Toast,
      "v-loading": require('../components/loading.vue')
    },
    data() {
      return {
        curPage: 1,
        users: [],
        lastScrollTop: 0,
        isRequest: false,
        showEnd:false,
        scroll: true,
        unfollowImg: require('../img/unfollow.png')
      }
    },
    created() {
      this.loadData()
    },
    mounted () {
      var self = this
      if (!this.$store.state.isLogin) {
        this.$router.replace('/')
        return
      }
      scrollController({
        ele: self.$refs.scrollContent,
        delay: 167,
        endCb () {
          self.loadMore()
        }
      })
    },
    methods: {
      loadMore () {
        if (this.showEnd) return
        if (!this.isRequest) {
          this.curPage++
          this.loadData()
        }
      },
      loadData() {
        let that = this
        let state = this.$store.state
        let userinfo = state.userInfo
        let url = state.host + state.baseUrl + '/user/getFrontUserlist?type=1&userId=' + userinfo.id + '&curPage=' + that.curPage + '&pageSize=10'
        that.isRequest = true

        this.$http.get(url).then(res => {
          var data = res.data.data.data
          that.isRequest = false
          console.log('friends>>>>', res)
          if (!data || data.length === 0) {
            if (that.curPage === 1) {
              Toast({message: '暂无好友', duration: 1000})
              return false
            } else {
              that.showEnd = true
            }
            that.curPage--
          } else {
            if (that.curPage === 1) that.users = []
            that.users = that.users.concat(data)
          }
        }, err => {
          that.isRequest = false
          that.curPage--
          console.log(err)
        })
      },
      deleteItem(targetUserId, isAttention, userNickName) {
        let that = this
        MessageBox.confirm('是否确认取消关注好友' + userNickName + '?').then(res => {
          console.log("confirm:"+res)
          that.showEnd =false
          setTimeout(()=>{
            this.follow(targetUserId, isAttention, userNickName)
          }, 500)
        }).catch(e => {
          console.log("err:"+e)
        })
      },
      follow(targetUserId, isAttention, userNickName) {
        let that = this
        let state = this.$store.state
        let userinfo = state.userInfo
        let url = state.host + state.baseUrl + '/user/toUserAttention?userId=' + userinfo.id + '&userNickName=' + '&targetUserId=' + targetUserId
        that.isRequest = true

        this.$http.get(url, '', true).then(res => {
          that.isRequest = false
          let data = res.data
          if (data.code === '000000') {
            let follow = isAttention
            if (follow === 1) {
              Toast({
                message: '您已取消关注' + userNickName,
                position: 'middle',
                iconClass: 'icon warn',
                className: 'follow',
                duration: 2000
              })
              var id = 'mt-'+ userNickName
              var x = document.getElementById(id)
              var li = document.querySelectorAll('.list-large')
              x.parentNode.removeChild(x)
              console.log(li.length)
              if(li.length<10) {
                this.loadMore()
              }
            }
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
      gotoDetail(userId, isSeater, userSource) {
        window.localStorage.setItem('targetUserId', userId)
        if(!userSource) {
          userSource = ''
        }
        window.localStorage.setItem('userSource', userSource)
        console.log(userId)
        if (isSeater) {
          this.$router.push('/userfriendadmin')
        } else {
          this.$router.push('/userfriend')
        }
      }
    },
    updated() {
      //侧滑显示删除按钮
      var expansion = null; //是否存在展开的list
      var container = document.querySelectorAll('ul li a');
      var btn = document.querySelectorAll('.btn');
      var c;
      for(var i = 0; i < container.length; i++){ 
        var x, y, X, Y, swipeX, swipeY;
        var list = document.defaultView.getComputedStyle(container[i])
        var height = list.height
        btn[i].style.lineHeight = height
        container[i].addEventListener('touchstart', function(event) {
          console.log('touchstart')
          clearTimeout(c)
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
            swipeX = true;
            swipeY = true ;
            if(expansion){   //判断是否展开，如果展开则收起
                expansion.className = "";
            }        
        });
        container[i].addEventListener('touchmove', function(event){
          
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;        
            // 左右滑动
            if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0){
                // 阻止事件冒泡
                clearTimeout(c)
                c=setTimeout(()=>{
                  console.log('.')
                  event.stopPropagation();
                  if(X - x > 10){   //右滑
                      event.preventDefault();
                      this.className = "";    //右滑收起
                  }
                  if(x - X > 10){   //左滑
                      event.preventDefault();
                      this.className = "swipeleft";   //左滑展开
                      expansion = this;
                  }
                  swipeY = false;
                }, 50)
            }
            // 上下滑动
            if(swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                swipeX = false;
            }        
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../css/color.scss";
  @import "../css/mixins.scss";
  .list{overflow:hidden}
  .list li{overflow:hidden;width:122%;}
  .list li a {-webkit-transition:all 0.3s linear;transition:all 0.3s linear;display: block;    overflow: hidden;}
  .list li i{margin-left:.28rem;float:right;width:15%;text-align:center;background:#FF0000;color:#fff;font-style: normal;margin-top: -.3rem;margin-bottom: -.3rem;}
  // .swipeleft{margin-left: -15%;}
  .swipeleft{transform:translateX(-15%);-webkit-transform:translateX(-15%);}

  .all-user {
    height: 100%;
    overflow-y:scroll;
    padding-bottom: .5rem;
    a {
      margin: 0 .3rem;
      padding: .3rem 0 .3rem;
      border-bottom: 1px solid $border-color;
      position: relative;
      i {
        position: absolute;
        right: 0;
      }
      .info {
        width: 80%;
      }
      .content {
        font-size: .26rem;
        color: #888;
        float: left;
        width: 80%;
        margin-top: .16rem;
        line-height: 1.2;
        word-wrap: break-word;
      }
      .avatar {
        position: relative;
        width: .7rem;
        height: .7rem;
        margin-right: .24rem;
        .img {
          width: .7rem;
          height: .7rem;
          border-radius: 50%;
          overflow: hidden;
          background-size: cover;
          background-position: center;
        }
        .admin {
          position: absolute;
          right: 0;
          bottom: 0;
          // display: inline-block;
          width: .24rem;
          height: .24rem;
          line-height: .24rem;
          font-size: .16rem;
          text-align: center;
          border: 2px solid #fff;
          border-radius: .24rem;
          background-color: $theme-color;
          color: #fff;
        }
      }
      .text {
        width: 60%;
        .name {
          width: 100%;
          color: $txt-color2;
          font-size: .3rem;
          line-height: 1.2;
          margin-bottom: .09rem;
        }
        .desc {
          color: $theme-color;
          font-size: .24rem;
          line-height: 1;
        }
      }
      .follow {
        @include btn(1.3rem, .5rem, .26rem, .4rem);
        color: #fff;
        box-sizing:border-box;
        padding-left: .3rem;
        line-height: .5rem;
        &.followed {
          background-color: #80C269;
          border-color: #80C269;
          background-repeat: no-repeat;
          background-size: .36rem; 
          background-position: .05rem .1rem;
        }
        &.notfollow {
          background-color: #FF8D8D;
          border-color: #FF8D8D;
          background-repeat: no-repeat;
          background-size: .28rem; 
          background-position: .12rem .1rem;
        }
      }
    }
  }
</style>
