<template>
    <div class="box box-ver h-p100" id="wrap">
        <nav-path>
            <a href="javascript:;" @click="$router.push('./')">首页</a>
            &gt;
            <a href="javascript:;" @click="$router.push('./userinfo')">个人信息</a>
            &gt;&nbsp;
            <div class="ellipsis box-f1">我的问答记录</div>
        </nav-path>
        <div ref="scrollContent" v-if="comments.length > 0" class="box box-ver box-f1 comments-list">
            <div  @click="goDetail(item)"  v-for="(item,index) in comments" class="comments-item box box-ver">
                <div class="box box-ver item">
                    <div class="box box-ac">
                        <div :style="{'background-image':'url('+ (item.questionUserPhoto?$getRealImg(item.questionUserPhoto,$store.state.hostImg):$store.state.defaultPhoto) +')'}" class="icon-user box" >
                            <div v-if="item.isTopicCreatorByQsn >= 1" :class="item.isTopicCreatorByQsn == 1?'creator':''" class="vip box box-ac box-pc">V</div>
                        </div>
                        <div class="box box-ver box-f1">
                            <div class="nickname box">
                                <div>{{item.questionUserName | cutString(0, 10)}}</div>
                                <div v-if="item.isTopicCreatorByQsn == 1" class="tag">题主</div>
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
                        <div :style="{'background-image':'url('+ (item.answerUserPhoto?$getRealImg(item.answerUserPhoto,$store.state.hostImg):$store.state.defaultPhoto) +')'}" class="icon-user box">
                            <div  v-if="item.isTopicCreator >= 1" :class="item.isTopicCreator == 1?'creator':''" class="vip box box-ac box-pc">V</div>
                        </div>
                        <div class="box box-ver box-f1">
                            <div class="nickname box">
                                <div>{{item.answerUserName | cutString(0, 10)}}</div>
                                <div v-if="item.isTopicCreator == 1" class="tag">题主</div>
                                <div class="tag tag-new">news</div>
                            </div>
                            <div class="time">{{item.questionTime | formatTime(nowTime)}}</div>
                        </div>
                        <div class="box box-ac">
                            <div class="icon-zan"></div>
                            <div class="num">{{item.answerPraiseNum}}</div>
                        </div>
                    </div>
                    <div class="txt">{{item.answer}}</div>
                </div>
                <div  class="icon-arrow-bot"></div>
            </div>
            <v-loading :isRequest="isRequest" :showEnd="showEnd" :msg="'没有更多提问记录了'"></v-loading>
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
      lastScrollTop:0,
      isRequest:false,
      showEnd:false
    }
  },
  mounted () {
    if (!this.$store.state.isLogin) {
      this.$router.replace('/')
      return
    }
    this.getComments()
  },
  updated() {
    var self = this
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
      self.isRequest = true
      var url = state.host + state.baseUrl + '/questionAnswer/findQuestionAnswerList?userId=' + state.userId + '&answerSort=' + self.answerSort +'&curPage=' + self.curPage + '&pageSize=10'
      self.$http.get(url)
        .then(res => {
          setTimeout(() => {
            self.isRequest = false
          },1000*Math.random())
          var data = res.data.data.data
          if (!data || data.length === 0) {
            if (self.curPage === 1) {
                Toast({message: '暂无提问记录', duration: 1000})
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
        })
    }
  },
  watch: {
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
    .ell-3{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .comments-list{
      margin-top:.7rem;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
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
                &.creator{
                    background-color:$error-red
                }
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
            line-height: 1.2;
            margin-bottom: .09rem;
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
            font-size:.24rem;
            line-height: 1;
        }
        .txt{
            padding-top:.16rem;
            font-size:.24rem;
        }
        .icon-comment,.icon-zan{
            margin-left:.15rem;
            margin-right:.1rem;
            width:.34rem;
            height:.34rem;
            @include bg-size(cover);
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
    .icon-arrow-bot{
        margin: .1rem auto;
        width: .30rem;
        height: .16rem;
    }
    .icon-hot,.icon-hot-act,.icon-new,.icon-new-act{
        width:.58rem;
        height:.38rem;
        @include bg-size(cover);
    }
</style>
