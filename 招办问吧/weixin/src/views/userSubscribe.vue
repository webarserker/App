<template>
    <div class="box box-ver h-p100" id="wrap">
        <nav-path>
            <a href="javascript:;" @click="$router.push('./')">首页</a>
            &gt;
            <a href="javascript:;" @click="$router.push('./userinfo')">个人信息</a>
            &gt;&nbsp;
            <div class="ellipsis box-f1">已订阅的话题</div>
        </nav-path>
        <div ref="scrollContent" class="box box-ver box-f1 topic-list">
            <div v-for="item in topicList" @click="goTopicDetail(item)" :style="{'background-image':'url('+$store.state.hostImg + item.imgUrl+')'}"  class="box topic-item box-ver" >
                <!--<div class="create-user box box-ac">
                    <div :style="{'background-image':'url('+$store.state.hostImg + item.userPhoto+')'}" class="icon icon-head"></div>
                    <div class="name ellipsis box-f1">{{item.userName | cutString(0, 8)}}</div>
                </div>-->
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
                        <div :style="{'background-image':'url('+$store.state.hostSchoolLogo + item.schoolLogo+')'}" class="icon icon-head" ></div>
                        <div class="name ellipsis box-f1">{{item.belongName}}</div>
                    </div>
                    <!--<div v-text="showStatus(item.status)" class="box box-ac box-pc box-f1 box-fh status">
                    </div>-->
                    <div class="box box-ac collect">
                        <div class="box-f1"></div>
                        <div  class="icon icon-collect-act"></div>
                        <div class="num">{{item.subscribeNum}}</div>
                    </div>
                </div>
            </div>
            <v-loading :isRequest="isRequest" :showEnd="showEnd" :msg="'没有更多话题了'"></v-loading>
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
      isRequest:false,
      showEnd:false
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
      self.checkLogin('/topicDetail?topicId=' + item.id)
    },
    showStatus (status) {
      return this.ArrStatus[status]
    },
    getTopicList () {
      var self = this
      self.isRequest = true
      var state = self.$store.state
      var url = state.host + state.baseUrl + '/topic/findSubscribeTopicList?userId=' + state.userId + '&curPage=' + self.curPage + '&pageSize=5'
      this.$http.get(url).then(res => {
        var data = res.data.data.data
        self.isRequest = false
        console.log('findTopicList>>>>', res)
        if (!data || data.length === 0) {
          if (self.curPage === 1) {
            Toast({message: '您还未订阅话题', duration: 1000})
            self.topicList = []
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
    @import '../css/topicList.scss';
    .topic-list{
      margin-top:.7rem;
    }
</style>
