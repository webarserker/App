<template>
    <div class="box box-ver h-p100" id="wrap">
        <nav-path>
            <a href="javascript:;" @click="$router.push('/')">首页</a>
            &gt;
            <a href="javascript:;" @click="$router.push('/userinfo')">个人信息</a>
            &gt;&nbsp;
            <div class="ellipsis box-f1">我的消息</div>
        </nav-path>
        <div ref="scrollContent" class="box box-ver box-f1 news-list">
            <div v-for="item in news" class="box news-item box-ver" >
                <div>消息类型:<span class="content">{{item.messageType}}</span></div>
                <div>消息标题:<span class="content">{{item.messageTitle}}</span></div>
                <div>接收时间:<span class="content">{{item.createTime | formatTime(nowTime,'yyyy-MM-dd hh:mm')}}</span></div>
                <div>消息详情:<span class="content">{{item.messageContent}}</span></div>
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
    this.$store.commit('SET_HASNEWS', false)
    window.sessionStorage.setItem('hasNews', false)
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
    this.getMessageList()
  },
  data () {
    return {
      news: [],
      curPage: 1,
      lastScrollTop: 0,
      nowTime:new Date().getTime(),
      isRequest:false,
      showEnd:false
    }
  },
  methods: {
    loadMore () {
      if (this.showEnd) return
      if (!this.isRequest) {
        this.curPage++
        this.getMessageList()
      }
    },
    getMessageList () {
      var self = this
      var state = self.$store.state
      self.isRequest = true
      var url = state.host + state.baseUrl + '/message/getMessageList?targetUserId=' + state.userId + '&curPage=' + self.curPage + '&pageSize=10'
      this.$http.get(url).then(res => {
        setTimeout(() => {
          self.isRequest = false
        },1000*Math.random())
        var data = res.data.data.data
        if (!data || data.length === 0) {
          if (self.curPage === 1) {
            Toast({message: '暂无消息', duration: 1000})
            self.news = []
          } else {
            self.showEnd = true
          }
          self.curPage--
        } else {
          if (self.curPage === 1) self.news = []
          self.news = self.news.concat(data)
        }
      }, err => {
        self.isRequest = false
        self.curPage--
      })
    }
  },
  destroyed(){
    // document.getElementById("wrap").style.display = 'none'
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../css/color.scss';
    @import '../css/mixins.scss';
    .news-list{
      margin-top:.71rem;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .news-item{
      padding:.2rem;
      padding-left:.4rem;
      padding-right:.4rem;
      font-size:.32rem;
      line-height:.52rem;
      border-bottom:.01rem solid $border-color;
      color:#333;
      .content{
        font-size:.3rem;
        color:#666
      }
    }
</style>
