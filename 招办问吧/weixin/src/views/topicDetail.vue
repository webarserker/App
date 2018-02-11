<template>
    <div class="box box-ver h-p100">
        <nav-path>
            <a href="javascript:" @click="$router.push('/')">{{topicDetail.schoolName?topicDetail.schoolName:'获取中...'}}</a>
            &gt;&nbsp;
            <div class="ellipsis box-f1">{{topicDetail.title}}</div>
        </nav-path>
        <div ref="scrollContent" class="box box-ver box-f1 content">
            <div class="box box-ver topic-detail">
                <div :style="{'background-image':'url('+$store.state.hostImg + topicDetail.imgUrl+')'}" class="box banner topic-item box-ver">
                    <div class="box box-ac">
                        <div class="create-user box box-ac box-f1">
                            <div :style="{'background-image':'url('+ (topicDetail.userPhoto?$getRealImg(topicDetail.userPhoto,$store.state.hostImg):$store.state.defaultPhoto) +')'}" class="icon-head"></div>
                            <div class="name ellipsis box-f1">{{topicDetail.userName  | cutString(0, 10)}}</div>
                        </div>
                        <a class="link" :href="$store.state.hostZS+'?scode='+ topicDetail.sCode + '#/' + '?uid=' + $store.state.userId">{{topicDetail.schoolName}}·智能咨询</a>
                    </div>
                    <div class="box-f1"></div>
                    <div class="box-pc box title tx-c">
                        {{topicDetail.title}}
                    </div>
                    <div class="box box-ac">
                        <div class="box-f1"></div>
                        <div class="box box-ac collect">
                            <div class="box-f1"></div>
                            <div @click="subscribe()" class="collect-area box box-ac">
                                <div  :class="topicDetail.isSubscribe==1?'icon-collect-act':''" class="icon icon-collect"></div>
                                <div class="num">{{topicDetail.isSubscribe==1?topicDetail.subscribeNum:'订阅'}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content box box-ver">
                    <p :class="showDesc?'ell-3':''" class="topic-desc box">
                        {{topicDetail.content}}
                    </p>
                    <div v-if="topicDetail.content.length>70&&showDesc" @click="showDesc = false"  class="icon-arrow-bot"></div>
                    <div v-if="showDesc === false" @click="showDesc = true"  class="icon-arrow-bot rotate180"></div>
                    <div class="box">
                        <div class="box-f1 date">{{topicDetail.createTime | formatTime(nowTime)}}</div>
                        <div class="box college">
                            <div class="box box-ac category" @click="goHome(topicDetail.sCode,topicDetail.departmentId,topicDetail.majorId)">
                                <div class="icon icon-category"></div>
                                <div class="txt" v-text="getTopicType(topicDetail.sCode,topicDetail.departmentId,topicDetail.majorId)"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="comments box box-ver">
                <div v-if="showNotComment" class="box box-pc box-ac tx-c comments-empty">
                    问题征集中,赶快向{{topicDetail.userName | cutString(0, 10)}}提问吧
                </div>
                <div v-if="comments.length > 0" class="box box-ver comments-list">
                    <div class="tab box box-ac box-pc">
                        <div @click="answerSort = 1" :class="answerSort===1?'act':''" class="tab-item box box-f1 box-fh box-ac box-pc hot">
                            <div class="box-f1"></div>
                            <div class="icon-hot"></div>
                            <div class="txt">热门</div>
                        </div>
                        <div @click="answerSort = 0" :class="answerSort===0?'act':''" class="tab-item box box-f1 box-fh box-ac box-pc">
                            <div class="icon-new"></div>
                            <div class="txt">最新</div>
                            <div class="box-f1"></div>
                        </div>
                    </div>
                    <p class="desc-total">共{{topicDetail.questionNum}}个提问·<span class="tc-main-act">{{topicDetail.answerNum}}</span>个回复</p>
                    <div v-for="(item,index) in comments" class="comments-item">
                        <div class="box box-ver item">
                            <div class="box box-ac">
                                <div :style="{'background-image':'url('+ (item.questionUserPhoto?$getRealImg(item.questionUserPhoto,$store.state.hostImg):$store.state.defaultPhoto) +')'}" class="icon-user box" >
                                    <div v-if="item.isTopicCreatorByQsn>=1" :class="item.isTopicCreatorByQsn == 1?'creator':''" class="vip box box-ac box-pc">V</div>
                                </div>
                                <div class="box box-ver box-f1">
                                    <div class="nickname box">
                                        <div>{{item.questionUserName | cutString(0, 10)}}</div>
                                        <div v-if="item.isTopicCreatorByQsn == 1" class="tag">题主</div>
                                    </div>
                                    <div class="time">{{item.questionTime | formatTime(nowTime)}}</div>
                                </div>
                                <div @click="showReply(item)" class="box box-ac">
                                    <div class="icon-comment"></div>
                                    <div class="num">{{item.questionReplyNum}}</div>
                                </div>
                            </div>
                            <div class="txt">{{item.question}}</div>
                        </div>
                        <div v-if="item.answer" class="box box-ver item">
                            <div class="box box-ac">
                                <div :style="{'background-image':'url('+ (item.answerUserPhoto?$getRealImg(item.answerUserPhoto,$store.state.hostImg):$store.state.defaultPhoto) +')'}" class="icon-user box">
                                    <div v-if="item.isTopicCreator >= 1" :class="item.isTopicCreator == 1?'creator':''" class="vip box box-ac box-pc">V</div>
                                </div>
                                <div class="box box-ver box-f1">
                                    <div class="nickname box box-ac">
                                        <div>{{item.answerUserName | cutString(0, 10)}}</div>
                                        <div v-if="item.isTopicCreator == 1" class="tag">题主</div>
                                        <div class="tag tag-new icon-new-red icon"></div>
                                    </div>
                                    <div class="time">{{item.answerTime | formatTime(nowTime)}}</div>
                                </div>
                                <div  class="box box-ac">
                                    <div @click="savePraiseData(2, item.answerId, index, $event)" :class="item.isAnswerPraise==1?'icon-zan-act':''" class="icon icon-zan"></div>
                                    <div class="num">{{item.answerPraiseNum}}</div>
                                </div>
                            </div>
                            <div class="txt">{{item.answer}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <v-loading :isRequest="isRequest" :showEnd="showEnd" :msg="'没有更多了'"></v-loading>
        </div>
        
        <div @click="showCommentFlag = false" v-if="showCommentFlag" class="comment-input-bg box box-fh box-ver">
            <div class="box-f1"></div>
            <div @click="$event.stopPropagation()" class="comment-area box box-ver">
                <div class="comment-input box box-ver">
                    <textarea v-focus="showCommentFlag" autofocus="autofocus"  ref="commentInput" v-model="commentWord" class="box box-f1" maxlength="140" placeholder="新颖、大胆、专业、有趣的问题，更有机会获得回复 哦!赶快提问吧！"></textarea>
                    <div class="box">
                        <div class="box-f1"></div>
                        <div class="tips"><span v-text="commentWord.length"></span>/140</div>
                    </div>
                </div>
                <div class="box">
                    <div @click="showCommentFlag = false" class="icon-close"></div>
                    <div class="box-f1"></div>
                    <div @click="saveQAdata()" class="icon-sure"></div>
                </div>
            </div>
        </div>
        <div :class="hideFooter?'hide-foot':''" class="foot-bar box box-fh box-ac footer">
            <div @click="openShare()" class="box box-f1 box-fh box-ac box-pc foot-item">
                <div class="icon-share"></div>
                <div class="txt">分享</div>
            </div>
            
            <div @click="showComment()" class="box box-f1 box-fh box-ac box-pc foot-item">
                <div class="icon-ask"></div>
                <div class="txt">我要提问</div>
            </div>
            <div class="box box-f1 box-fh box-ac box-pc foot-item">
                <div @click="savePraiseData(3, $route.query.topicId, -1, $event)" :class="topicDetail.isPraise==1?'icon-zan-act':''" class="icon icon-zan"></div>
                <div class="txt">{{topicDetail.praiseNum}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui'
import { praiseAnimate, scrollController } from '../utils/common'
export default {
  components: {
    'nav-path': require('../components/path.vue'),
    "v-loading": require('../components/loading.vue')
  },
  data () {
    return {
      showDesc: true,
      showCommentFlag: false,
      answerSort: 1,
      showNotComment:false,
      comments: [], //评论列表
      commentWord: '', // 评论内容
      topicDetail: {
          content:'',
      }, // 话题详情
      curPage: 1,
      nowTime: new Date().getTime(),
      hideFooter: true,
      showEnd:false,
      isLogin: '',
      isRequest:false
    }
  },
  created () {
    var self = this
    self.getTopicDetail()
  },
  mounted () {
    var self = this
    scrollController({
      ele: self.$refs.scrollContent,
      delay: 167,
      upCb () {
        self.hideFooter = true
      },
      downCb () {
        self.hideFooter = false
      },
      endCb () {
        self.loadMore()
      }
    })
  },
  methods: {
    initShare () {
      if(!mobShare) return
      var self = this
      document.title = self.topicDetail.title
      document.querySelector('meta[name=description]').setAttribute('content',self.topicDetail.content)
      mobShare.config({
        // debug: true, // 开启调试，将在浏览器的控制台输出调试信息
        appkey: '1e7f5d9792414', // appkey
        params: {
            url: window.location.href, // 分享链接
            title: self.topicDetail.title, // 分享标题
            description: self.topicDetail.content, // 分享内容
            pic: self.$store.state.hostImg + self.topicDetail.imgUrl, // 分享图片，使用逗号,隔开
            // reason:'',//自定义评论内容，只应用与QQ,QZone与朋友网
        },
        /**
         * 分享时触发的回调函数
         * 分享是否成功，目前第三方平台并没有相关接口，因此无法知道分享结果
         * 所以此函数只会提供分享时的相关信息
         * 
         * @param {String} plat 平台名称
         * @param {Object} params 实际分享的参数 { url: 链接, title: 标题, description: 内容, pic: 图片连接 }
         */
        callback: function( plat, params ) {
        }
      });
    },
    openShare () {
      // 参考网址 http://wiki.mob.com/sharesdk-for-web%E5%BF%AB%E9%80%9F%E9%9B%86%E6%88%90/
      if(!mobShare) return
      mobShare.ui.init();
      mobShare.ui.open();
    },
    checkStatus () {
      if (this.topicDetail.status == 2) {
        Toast({message: '此话题已关闭', position: 'bottom', duration: 2000})
        return false
      } 
      return true
    },
    checkLogin() {
      var self = this
      var state = self.$store.state
      var topicId = self.$route.query.topicId
      if (!state.isLogin) {
        self.$store.commit('SET_LOGINNEXTROUTER', '/topicDetail?topicId=' + topicId)
        self.$router.push('/login')
        return false
      }
      return true
    },
    loadMore () {
      if (this.showEnd) return
      if (!this.isRequest) {
        this.curPage++
        this.getQuestionAnswerList()
      }
    },
    showComment () {
      if(!this.checkLogin()) return
      if (!this.checkStatus()) return
      this.showCommentFlag = true
    },
    showReply (item) {
      this.checkLogin()  
      window.sessionStorage.setItem('question_topicDetail',JSON.stringify(this.topicDetail))
      this.$router.push('/commentsList?questionId=' + item.questionId)
    },
    goHome (sCode, departmentId, majorId) {
      var self = this
      self.$router.push('/?sCode='+(sCode?sCode:'')+'&departmentId='+(departmentId?departmentId:'')+'&majorId='+(majorId?majorId:''))
    },
    getTopicType (sCode, departmentId, majorId) {
      if (sCode && departmentId && majorId) return '专业话题'
      if (sCode && departmentId && (!majorId)) return '院系话题'
      if ((!departmentId) && (!majorId)) return '高校话题'
    },
    // 获取话题详情
    getTopicDetail () {
      var self = this
      var state = self.$store.state
      var topicId = self.$route.query.topicId
      var url = state.host + state.baseUrl + '/topic/getTopicDetail?topicId=' + topicId + '&userId=' + state.userId
      self.$http.get(url).then(res => {
        var data = res.data.data
        if (!data) {
            Toast({message: '此话题不存在或已删除', position: 'bottom', duration: 2000})
            return
        }
        self.hideFooter = false
        self.topicDetail = data
        self.checkStatus()
        self.getQuestionAnswerList()
        self.initShare()
      })
    },
    // 获取回复列表
    getQuestionAnswerList () {
      var self = this
      var state = self.$store.state
      var topicId = self.$route.query.topicId
      self.isRequest = true
      var url = state.host + state.baseUrl + '/questionAnswer/findQuestionAnswerList?userId=' + state.userId + '&topicId=' + topicId + '&questionSort=' + self.answerSort + '&curPage=' + self.curPage + '&pageSize=5'
      self.$http.get(url).then(res => {
          // console.log('回复列表>>>>', res)
          self.isRequest = false
          var data = res.data.data.data
          if (!data || data.length === 0) {
            if (self.curPage === 1) {
                // Toast({message: '暂无ti', duration: 1000})
                self.showNotComment = true
            } else {
                self.showNotComment = false
                self.showEnd = true
            }
            self.curPage--
          } else {
            if (self.curPage === 1) self.comments = []
            self.comments = self.comments.concat(data)
          }
        }, err => {
          self.curPage--
          self.isRequest = false
          console.log('请求出错了>>>>', err)
        })
    },
    // 我要提问
    saveQAdata (pid) {
      var self = this
      var state = self.$store.state
      var topicId = self.$route.query.topicId
      if (self.commentWord.length === 0) {
        Toast({message: '请先填写评论', duration: 2000})
        return
      }
      var url = state.host + state.baseUrl + '/questionAnswer/saveQAdata?topicId=' + topicId + '&targetUserId=' + self.topicDetail.creatorId + '&targetUserNickName=' + self.topicDetail.userName  + '&content=' + self.commentWord + '&creatorId=' + state.userId + '&creator=' + state.userName + '&sCode=' + self.topicDetail.sCode
      self.$http.get(url)
      .then(res => {
        var data = res.data
        self.commentWord = ''
        self.curPage = 1
        self.showEnd = false
        self.getTopicDetail()
        Toast({message: '提问成功', duration: 2000})
        self.showCommentFlag = false
      })
    },
    // 点赞
    savePraiseData (type, bizId, index, $event) {
      var self = this
      if (!self.checkLogin()) return
      if (!this.checkStatus()) return
      if (type === 3 && self.topicDetail.isPraise == 1) {
        Toast({message: '您已经点赞过此话题', position: 'center', duration: 2000})
        return
      }
      if (index >= 0 && self.comments[index].isAnswerPraise == 1) {
        Toast({message: '您已经点赞过此回复', position: 'center', duration: 2000})
        return
      }
      var state = self.$store.state
      var url = state.host + state.baseUrl + '/questionAnswer/savePraiseData?bizId=' + bizId + '&userId=' + state.userId + '&type=' + type
      self.$http.get(url).then(res => {
        var data = res.data
        if (index >= 0) {
            self.comments[index].answerPraiseNum++
            self.comments[index].isAnswerPraise = 1
        }
        if (type === 3) {
            self.topicDetail.isPraise = 1
            self.topicDetail.praiseNum++
        }
        praiseAnimate ($event,1)
      })
    },
    // 订阅话题
    subscribe () {
      var self = this
      if (!self.checkLogin()) return
      if (!this.checkStatus()) return
      if (self.topicDetail.isSubscribe === 1) {
        Toast({message: '您已订阅过此话题', duration: 3000})
        return false
      }
      var state = self.$store.state
      var topicId = self.$route.query.topicId
      var url = state.host + state.baseUrl + '/topic/subscribe?userId=' + state.userId + '&topicId=' + topicId
      self.$http.get(url).then(res => {
        var data = res.data
        self.topicDetail.subscribeNum++
        self.topicDetail.isSubscribe = 1
        self.$store.state.subscribeList.push(self.$route.query.topicId)
        Toast({message: '订阅成功', duration: 3000})
      })
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'getTopicDetail',
    answerSort () {
      this.curPage = 1
      this.showEnd = false
      this.getQuestionAnswerList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../css/color.scss';
    @import '../css/mixins.scss';
    @import '../css/topic-detail.scss';
    @import '../css/comment-input.scss';
    .path{
        top:1.1rem !important;
        z-index:20;
    }
    .content{
        .topic-detail{
            margin-top:1.8rem !important;
        }
        padding-bottom:1rem;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .comments{
        padding:.3rem;
        //padding-bottom:1rem;
    }
    .comments-empty{
        height:1.9rem;
        background-color:#f9f9f9;
    }
    .comments-list{
        .desc-total{
            font-size:.28rem;
            margin-top:.2rem;
        }
    }
    .comments-item{
        background-color:#f9f9f9;
        color:#666;
        margin-top:.1rem;
        .item{
            padding:.2rem;
            border-bottom:.01rem dashed #e5e5e5;
            &:last-child{
                border:none
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
                    &.creator{
                        background-color:$error-red
                    }
                }
            }
            .nickname{
                font-size:.26rem;
                margin-bottom: .09rem;
                .tag{
                    font-size:.2rem;
                    padding-left:.1rem;
                    padding-right:.1rem;
                    border:.02rem solid #ff0000;
                    background-color:#ff0000;
                    color:#FFF;
                    margin-left:.12rem;
                    border-radius:.05rem;
                }
                .tag-new{
                    width:.6rem;
                    height:.27rem;
                    padding:0;
                    background-color:#FFF;
                    border:none;
                    // color:#ff0000;
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
        }
        .icon-comment,.icon-zan{
            margin-right:.1rem;
            width:.34rem;
            height:.34rem;
            @include bg-size(cover);
        }
        
    }
    .icon-arrow-bot,.icon-share,.icon-ask,.icon-zan{
        @include bg-size(cover);
        width:.44rem;
        height:.44rem;
    }
    .icon-hot,.icon-hot-act,.icon-new,.icon-new-act{
        width:.38rem;
        height:.38rem;
        @include bg-size(cover);
    }
    .icon-new,.icon-new-act{
        width:.58rem;
        height:.58rem
    }
    .tab-item{
        margin:0 .3rem;
        font-size:.28rem;
        .txt{
            margin-left:.1rem;
        }
    }
    .icon-hot{
        @include bg-image('../img/icon-hot');
    }
    .icon-new{
        @include bg-image('../img/icon-new');
    }
    .tab-item.act{
        .icon-hot{
            @include bg-image('../img/icon-hot-act');
        }
        .icon-new{
            @include bg-image('../img/icon-new-act');
        }
        color:$theme-color;
        &.hot{
             color:#ff243f
        }
    }
    
    
    .icon-arrow-bot{
        margin: .1rem auto;
        width: .30rem;
        height: .16rem;
    }
    
    .foot-bar{
        position:absolute;
        bottom:0;
        width:100%;
        height:1rem;
        background-color: #f9f9f9;
        border-top:.01rem solid $border-color;
        // transition: all .1s;
        .foot-item{
            border-right:.02rem solid #e5e5e5;
            //height:.5rem;
            &:last-child{
                border-right:.02rem solid rgba(0,0,0,0);
            }
        }
        .txt{
            color:#666;
            margin-left:.22rem;
        }
    }
</style>
