<template>
    <div class="box box-ver h-p100">
        <nav-path :current="'好友资料'">
          <a href="javascript:void(0);" @click="$router.push('/')">首页</a>
          &gt;  
        </nav-path>
        <div ref="scrollContent" class="box box-ver box-f1 topic-list">
          <div class="list-large">
          <div class="info clear">
            <div class="avatar fl">
              <!-- <img :src="userPhoto" alt=""> -->
              <div :style="{'background-image':'url('+userPhoto+')', 'background-position':'center', 'background-size':'cover'}" class="img"></div>
              <span class="admin">V</span>
            </div>
            <div class="text fl">
              <p class="name">{{list.nickName}}</p>
              <p class="desc">{{userSource}}</p>
            </div>
          </div>
          <div class="content">
            个性签名:<br />{{list.signature}}
          </div>
        </div>
            <div v-for="item in topicList" @click="goTopicDetail(item)" :style="{'background-image':'url('+$store.state.hostSchoolLogo + item.imgUrl+')'}"  class="box topic-item box-ver" >
                <div class="create-user box box-ac">
                    <div v-text="showStatus(item.status)" class="box">
                    </div>
                    <div class="box box-f1"></div>
                    <a class="link" >{{item.schoolName}}</a>
                </div>
                <div class="box-f1"></div>
                <div class="box-pc box title tx-c">
                    {{item.title}}
                </div>
                <div class="box box-ac">
                    <div class="create-college box box-ac box-f1 box-fh">
                        <div :style="{'background-image':'url('+$$store.state.hostSchoolLogo + item.schoolLogo+')'}" class="icon-head" ></div>
                        <div class="name ellipsis box-f1">{{item.belongName}}</div>
                    </div>
                    <div class="box box-ac box-f1 box-fh collect">
                        <div class="box-f1"></div>
                        <div class="icon-collect-act"></div>
                        <div class="num">{{item.subscribeNum}}</div>
                    </div>
                </div>
            </div>
            <v-loading :isRequest="isRequest" :showEnd="showEnd" :msg="'没有更多消息了'"></v-loading>
        </div>
    </div>
</template>

<script>
// import {mapGetters} from 'vuex'
import { Toast } from 'mint-ui'
import { scrollController } from '../utils/common'
export default {
  components: {
    'nav-path': require('../components/path.vue'),
    "v-loading": require('../components/loading.vue')
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
    this.getTopicList()
  },
  data () {
    return {
      topicList: [],
      curPage: 1,
      ArrStatus: ['待审核', '进行中...', '此话题已关闭'],
      lastScrollTop: 0,
      list: {},
      isRequest: false,
      showEnd:false
    }
  },
  computed: {
    targetUserId() {
      return parseInt(window.localStorage.getItem('targetUserId'))
    },
    userPhoto() {
      return this.list.userPhoto?this.$getRealImg(this.list.userPhoto,this.$store.state.hostImg):this.$store.state.defaultPhoto
    },
    userSource() {
      return window.localStorage.getItem('userSource')
    }
  },
  methods: {
    loadMore () {
      if (this.showEnd) return
      if (!this.isRequest) {
        this.curPage++
        this.getTopicList()
      }
    },
    checkLogin(router) {
      var self = this
      var state = self.$store.state
      if (!state.isLogin) {
        self.$router.push('/login')
      } else {
        self.$router.push(router)
      }
    },
    goTopicDetail (item) {
      var self = this
      self.checkLogin('/topicDetail1?topicId=' + item.id)
    },
    showStatus (status) {
      return this.ArrStatus[status]
    },
    getTopicList () {
      var self = this
      var state = self.$store.state
      var url = state.host + state.baseUrl + '/topic/findTopicList?userId=' + self.targetUserId + '&curPage=' + self.curPage + '&pageSize=5'
      self.isRequest = true
      this.$http.get(url, '', true).then(res => {
        var data = res.data.data.data
        self.isRequest = false
        console.log('findTopicList>>>>', res)
        if (!data || data.length === 0) {
          if (self.curPage === 1) {
            Toast({message: '暂无该分类下的话题', duration: 1000})
            return false
          } else {
            self.showEnd = true
          }
          self.curPage--
        } else {
          if (self.curPage === 1) self.topicList = []
          self.topicList = self.topicList.concat(data)
        }
      }, err => {
        self.isRequest = false
        self.curPage--
        console.log(err)
      }).catch((e)=>{
        that.isRequest = false
        console.log(e)
      })
    }
  },
  created() {
    let self = this
    let state = this.$store.state
    let url = state.host + state.baseUrl + '/user/getUserInfoById?userId=' + self.targetUserId
    console.log(url)
    self.isRequest = true

    this.$http.get(url).then((res) => {
      let data = res.data
      this.list = data.data
      console.log(this.list)
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../css/color.scss';
    @import '../css/mixins.scss';
    @import '../css/topicList.scss';
    .h-p100 {
      font-family: PingFangSC-Regular,Hiragino Sans GB,Microsoft Yahei,sans-serif;
    }
    .list-large {
      margin: 0 .3rem;
      padding: .3rem 0;
      border-bottom: 1px solid $border-color;
      .content {
        color: #888;
        word-wrap: break-word;
        font-size: .26rem;
        margin-top: .1rem;
      }
      .avatar {
        position: relative;
        width: .7rem;
        height: .7rem;
        margin-right: .24rem;
        // background-color: $txt-color3;
        .img {
          width: .7rem;
          height: .7rem;
          border-radius: 50%;
          overflow: hidden;
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
        .name {
          color: $txt-color2;
          font-size: .3rem;
          line-height: 1.2;
          margin-bottom: .09rem;
        }
        .desc {
          color: $theme-color;
          font-size: .2rem;
          line-height: 1.2;
        }
      }
      .follow {
        @include btn(1.3rem, .4rem, .24rem, .4rem);
        color: #fff;
        &.followed {
          background-color: #80C269;
          border-color: #80C269;
        }
        &.notfollow {
          background-color: #FF8D8D;
          border-color: #FF8D8D;
        }
      }
    }
    .icon-collect-act {
      background-size: cover !important;
    }
</style>
