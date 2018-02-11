<template>
    <div class="box box-ver" style="height:100%;">
        <nav-path :current="'好友资料'">
          <a href="javascript:void(0);" @click="$router.push('/')">首页</a>
          &gt;  
        </nav-path>
      <div class="main" ref="scrollContent">
        <div class="list-large">
          <div class="info clear">
            <div class="avatar fl">
              <img :src="userPhoto" alt="">
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
        <div class="count">共{{questionNum}}个提问，<span class="answer">{{answerNum}}</span>个回复</div>
        <div v-if="comments.length > 0" class="box box-ver box-f1 comments-list">
            <div v-for="(item,index) in comments" class="comments-item box box-ver">
                <div class="box box-ver item">
                    <div class="box box-ac">
                        <div :style="{'background-image':'url('+$store.state.hostImg + item.questionUserPhoto+')'}" class="icon-user box" >
                            <div v-if="item.isTopicCreator == 1" class="vip box box-ac box-pc">V</div>
                        </div>
                        <div class="box box-ver box-f1">
                            <div class="nickname box">
                                <div class="ellipsis">{{item.questionUserName}}</div>
                                <div v-if="item.isTopicCreator == 1" class="tag">题主</div>
                            </div>
                            <div class="time">{{item.questionTime | formatTime(nowTime)}}</div>
                        </div>
                        <div class="box box-ac">
                            <div class="icon-comment"></div>
                            <div class="num">{{item.questionReplyNum}}</div>
                        </div>
                    </div>
                    <div class="txt ell-3">{{item.question}}</div>
                </div>
                <div v-if="item.answer" class="box box-ver item">
                    <div class="box box-ac">
                        <div :style="{'background-image':'url('+$store.state.hostImg + item.answerUserPhoto+')'}" class="icon-user box">
                            <div v-if="item.isTopicCreator == 1" class="vip box box-ac box-pc">V</div>
                        </div>
                        <div class="box box-ver box-f1">
                            <div class="nickname box">
                                <div>{{item.answerUserName}}</div>
                                <div v-if="item.isTopicCreator == 0" class="tag">题主</div>
                                <div class="tag tag-new">news</div>
                            </div>
                            <div class="time">{{item.questionTime | formatTime(nowTime)}}</div>
                        </div>
                        <div @click="savePraiseData(2, item.answerId)" class="box box-ac">
                            <div class="icon-zan"></div>
                            <div class="num">{{item.answerPraiseNum}}</div>
                        </div>
                    </div>
                    <div class="txt">{{item.answer}}</div>
                </div>
                <div  @click="goDetail(item)"  class="icon-arrow-bot"></div>
            </div>
        </div>
        <v-loading :isRequest="isRequest" :showEnd="showEnd" :msg="'没有更多消息了'"></v-loading>
      </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui'
import { scrollController } from '../utils/common'
export default {
  components: {
    'nav-path': require('../components/path.vue'),
    "v-loading": require('../components/loading.vue')
  },
  data () {
    return {
      answerSort: 0,
      comments: [],
      curPage: 1,
      nowTime: new Date().getTime(),
      list: {},
      lastScrollTop: 0,
      isRequest: false,
      showEnd:false,
      userSource:'',
      questionNum:0,
      answerNum: 0
    }
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
    this.getComments()
  },
  computed: {
    targetUserId() {
      return parseInt(window.localStorage.getItem('targetUserId'))
    },
    userPhoto() {
      return this.list.userPhoto?this.$getRealImg(this.list.userPhoto,this.$store.state.hostImg):this.$store.state.defaultPhoto
    }
  },
  methods: {
    loadMore () {
      if (this.showEnd) return
      if (!this.isRequest) {
        this.curPage++
        this.getComments()
      }
    },
    goDetail (item) {
      window.sessionStorage.setItem('myReply',JSON.stringify(item))
      this.$router.push('/userTopicDetail?topicId=' + item.topicId)
    },
    getComments () {
      var self = this
      var state = self.$store.state
      var url = state.host + state.baseUrl + '/questionAnswer/findQuestionAnswerList?userId=' + self.targetUserId + '&answerSort=' + self.answerSort +'&curPage=' + self.curPage + '&pageSize=10'
      console.log(url)
      self.isRequest = true
      self.$http.get(url, '', true)
        .then(res => {
          var data = res.data.data.data
          self.isRequest = false
          if (!data || data.length === 0) {
            if (self.curPage === 1) {
              Toast({message: '暂无提问记录', duration: 1000})
              return false
            } else {
              self.showEnd = true
            }
            self.curPage--
          } else {
            if (self.curPage === 1) self.comments = []
            self.comments = self.comments.concat(data)
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
    let url2 = state.host + state.baseUrl + '/user/getUserQAcount?userId=' + self.targetUserId
    self.isRequest = true

    this.$http.get(url).then((res) => {
      let data = res.data
      this.list = data.data
      console.log(data)

      var userSource = window.localStorage.getItem('userSource')
      if (!userSource || userSource =='null'|| userSource =='') {
        userSource = '此用户很懒，没留下所在地区'
      }
      this.userSource = userSource
    })
    // 获取提问回复数量
    console.log(url2)
    this.$http.get(url2).then((res) => {
      let data = res.data
      this.questionNum = data.data.questionNum
      this.answerNum = data.data.answerNum
    })
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../css/color.scss';
    @import '../css/mixins.scss';

    .main {
      font-family: PingFangSC-Regular,Hiragino Sans GB,Microsoft Yahei,sans-serif;
      padding-top: .7rem;
      height: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .count {
        margin-top: .25rem;
        font-size: .26rem;
        padding: 0 .27rem;
        color: #666;
        .answer {
          color: $theme-color;
        }
      }
    }
    .ell-3{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .comments-list{
      // margin-top:.7rem;
      // overflow-y: scroll;
      // -webkit-overflow-scrolling: touch;
        .desc-total{
            font-size:.28rem;
            margin-top:.2rem;
        }
    }

    .comments-item{
        background-color:#f9f9f9;
        color:#666;
        margin-top:.1rem;
        margin-left:.2rem;
        margin-right:.2rem;
    }
    
    .icon-arrow-bot{
        margin: .1rem auto;
        width: .30rem;
        height: .16rem;
        @include bg-image('../img/icon-arrow-bot');
    }
    .item{
        padding:.2rem;
        border-bottom:.01rem dashed $border-color;
        &:last-child{
          border:0;
        }
        .icon-user{
            @include bg-size(cover);
            width:.72rem;
            height:.72rem;
            background-color:#ddd;
            border-radius:50%;
            margin-right:.2rem;
            .vip{
                position:absolute;
                bottom:0;
                right:0;
                font-size:.14rem;
                background-color:$theme-color;
                width:.2rem;
                height:.2rem;
                border-radius:50%;
                border:.02rem solid #FFF;
                color:#FFF;
            }
        }
        .nickname{
            font-size:.26rem;
            div {
              max-width: 94%;
            }
            .tag{
                font-size:.22rem;
                padding-left:.1rem;
                padding-right:.1rem;
                border:.02rem solid #ff0000;
                background-color:#ff0000;
                color:#FFF;
                margin-left:.2rem;
            }
            .tag-new{
                background-color:#FFF;
                color:#ff0000;
            }
        }
        .time{
            color:#999;
            font-size:.22rem;
        }
        .txt{
            padding-top:.2rem;
            font-size:.24rem;
        }
        .icon-comment,.icon-zan{
            margin-left:.15rem;
            margin-right:.1rem;
            width:.34rem;
            height:.34rem;
            @include bg-size(cover);
        }
        .icon-comment{
            @include bg-image('../img/icon-comment');
        }
    }
    .question{
      border:none;
      border-bottom:.01rem solid $border-color;
      padding-left:.4rem;
      padding-right:.4rem;
      padding-top:0;
      margin:0;
    }
    .order{
        color:#666;
        height:.70rem;
        padding-right:.4rem;
    }
    .icon-order{
        width:.48rem;
        height:.48rem;
        margin-right:.2rem;
        @include bg-size(cover);
        @include bg-image('../img/icon-order');
    }
    .icon-arrow-bot,.icon-share,.icon-ask,.icon-zan{
        @include bg-size(cover);
        width:.44rem;
        height:.44rem;
    }
    .icon-hot,.icon-hot-act,.icon-new,.icon-new-act{
        width:.58rem;
        height:.38rem;
        @include bg-size(cover);
    }
    
    .icon-arrow-bot{
        margin: .1rem auto;
        width: .30rem;
        height: .16rem;
        @include bg-image('../img/icon-arrow-bot');
    }
    .icon-zan{
        @include bg-image('../img/icon-zan');
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
        img {
          width: .7rem;
          height: .7rem;
          border-radius: 50%;
          overflow: hidden;
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
          color: $txt-color3;
          font-size: .2rem;
          line-height: 1.2;
        }
      }
    }
</style>
