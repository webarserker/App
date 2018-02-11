<template>
    <div class="box box-ver h-p100 of-hide">
        <nav-path>
            <a href="javascript:;" @click="$router.push('/')">首页</a>
            &gt;
            <a href="javascript:;" @click="$router.push('/userinfo')">个人信息</a>
            &gt;
            <a href="javascript:;" @click="$router.push('/userCommentsList')">我的问答记录</a>
            &gt;
            <div class="ellipsis box-f1">回复详情</div>
        </nav-path>
        <div ref="scrollContent" class="box box-ver box-f1 container">
            <div  class="box box-ver topic-detail">
                <div :style="{'background-image':'url('+$store.state.hostImg + topicDetail.imgUrl+')'}" class="box banner topic-item box-ver">
                    <div class="box box-ac">
                        <div class="create-user box box-ac box-f1">
                            <div :style="{'background-image':'url('+ (topicDetail.userPhoto?$getRealImg(topicDetail.userPhoto,$store.state.hostImg):$store.state.defaultPhoto) +')'}"  class="icon-head" ></div>
                            <div class="name ellipsis box-f1">{{topicDetail.userName | cutString(0, 10)}}</div>
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
                <div  class="box box-ver comments-list">
                    <div class="desc-total box">
                    <div class="box-f1">共{{topicDetail.questionNum}}个提问·<span class="tc-main-act">{{topicDetail.answerNum}}</span>个回复</div>
                    <div @click="seeAll()" class="seeAll">查看全部回复</div>
                    </div>
                    <div @click="changeCommentTarget(-1)" :class="(nowCommentTarget == -1)?'bc-act':''" class="box box-ver comments-item question ">
                        <div class="box box-ac">
                            <div :style="{'background-image':'url('+ (question.userPhoto?$getRealImg(question.userPhoto,$store.state.hostImg):$store.state.defaultPhoto) +')'}" class="icon-user box">
                                <div v-if="question.isTopicCreator >= 1" :class="question.isTopicCreator == 1?'creator':''" class="vip box box-ac box-pc">V</div>
                            </div>
                            <div class="box box-ver box-f1">
                                <div class="nickname box">
                                    <div>{{question.nickName | cutString(0, 10)}}</div>
                                    <div v-if="question.isTopicCreator==1" class="tag">题主</div>
                                </div>
                                <div class="time">{{question.userSource?question.userSource:'此用户很懒，还没有留下任何足迹'}}</div>
                            </div>
                            <div class="box box-ac">
                                <div class="icon icon-comment"></div>
                                <div class="num">{{question.answerNum}}</div>
                            </div>
                            <div class="box box-ac">
                                <div @click="savePraiseData(1, '', -1, $event)" :class="question.isPraise==1?'icon-zan-act':''" class="icon icon-zan"></div>
                                <div class="num">{{question.praiseNum}}</div>
                            </div>
                        </div>
                        <div class="txt">{{question.content}}</div>
                    </div>
                    <div v-if="answer.length>0" class="box box-ver comments-list">
                        <div v-for="(item, index) in answer" class="comments-item box box-ver">
                        <div @click="changeCommentTarget(index,item)" :class="(nowCommentTarget == index)?'bc-act':''" class="box box-ver question-answer">
                            <div class="box box-ac">
                            <div :style="{'background-image':'url('+ (item.userPhoto?$getRealImg(item.userPhoto,$store.state.hostImg):$store.state.defaultPhoto) +')'}" class="icon-user box">
                                <div v-if="item.isTopicCreator >= 1" :class="item.isTopicCreator == 1?'creator':''" class="vip box box-ac box-pc">V</div>
                            </div>
                            <div class="box box-ver box-f1">
                                <div class="nickname box">
                                    <div>{{item.nickName | cutString(0,10)}}</div>
                                    <div v-if="item.isTopicCreator == 1" class="tag">题主</div>
                                </div>
                                <div class="time">{{item.createTime | formatTime(nowTime)}}</div>
                            </div>
                            <div class="box box-ac">
                                <div @click="savePraiseData(2, item.answerId, index, $event)"  :class="item.isPraise==1?'icon-zan-act':''" class="icon icon-zan"></div>
                                <div class="num">{{item.praiseNum}}</div>
                            </div>
                            </div>
                            <div class="txt">{{item.content}}</div>
                        </div>
                        <div @click="changeCommentTarget(index+','+childIndex, itemChild)" :class="(nowCommentTarget == (index+','+childIndex))?'bc-act':''" v-for="(itemChild,childIndex) in item.childList" class="box box-ver answer-answer-list">
                            <div class="answer-answer-item"><span class="nicknime">{{itemChild.nickName | cutString(0,10)}}回复{{itemChild.targetNickName | cutString(0,8)}}</span>{{'：'+itemChild.content}}</div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <v-loading :isRequest="isRequest" :showEnd="showEnd" :msg="'没有更多回复了'"></v-loading>
        </div>
        
        <div @click="showCommentFlag = false" v-if="showCommentFlag" class="comment-input-bg box box-fh box-ver">
            <div class="box-f1"></div>
            <div @click="$event.stopPropagation()" class="comment-area box box-ver">
                <div class="comment-input box box-ver">
                    <textarea v-focus="showCommentFlag" autofocus="autofocus" ref="commentInput" v-model="commentWord" class="box box-f1" maxlength="140" :placeholder="'回复'+targetName"></textarea>
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
        <div @click="showComment()" :class="hideFooter?'hide-foot':''" class="answerIpt box box-ac footer">
            <div class="icon icon-comment"></div>
            <div >回复{{targetName}}</div>
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
      showCommentFlag:false,
      comments: [JSON.parse(window.sessionStorage.getItem('myReply'))],
      commentWord: '', // 评论内容
      topicDetail: {
        content:''
      }, // 话题详情
      question:'',
      answer: [],
      questionId:'',
      answerSort:0,
      curPage: 1,
      hideFooter: false,
      nowTime: new Date().getTime(),
      isRequest:false,
      showEnd:false,
      nowCommentTarget:-2,
      commentTargetId:'',
      targetName:''
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
    self.questionId = self.comments[0].questionId
    self.getTopicDetail()
    self.getQuestionData()
    self.getAnswerData()
  },
  methods: {
    loadMore () {
      if (this.showEnd) return
      if (!this.isRequest) {
          this.curPage++
        this.getAnswerData()
      }
    },
    seeAll () {
      this.$router.push('/topicDetail?topicId=' + this.$route.query.topicId)
    },
    checkStatus () {
      if (this.topicDetail.status == 2) {
        Toast({message: '此话题已关闭', position: 'bottom', duration: 2000})
        return false
      } 
      return true
    },
    showComment () {
      this.showCommentFlag = true
      setTimeout(() => {
        this.$refs.commentInput.focus()
      },0)
    },
    showReply () {
      this.$router.push('./commentsList')
    },
    changeCommentTarget (index,item) {
      this.nowCommentTarget = index
      if (index == -1) {
        this.targetName = this.question.nickName
        this.commentTargetId = this.questionId
      } else {
        this.targetName = item.nickName
        this.commentTargetId = item.answerId
      }
    },
    goHome (sCode, departmentId, majorId) {
      var self = this
      self.$router.push('/?sCode='+(sCode?sCode:'')+'&departmentId='+(departmentId?departmentId:'')+'&majorId='+(majorId?majorId:''))
    },
    getTopicType (sCode, departmentId, majorId) {
      if (sCode && departmentId && majorId) return '专业话题'
      if (sCode && departmentId && (!majorId)) return '院系话题'
      if (sCode && (!departmentId) && (!majorId)) return '高校话题'
      if (!sCode && (!departmentId) && (!majorId)) return '高校话题'
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
        self.topicDetail = data
        self.checkStatus()
        document.title = self.topicDetail.title
        document.querySelector('meta[name=description]').setAttribute('content',self.topicDetail.content)
      })
    },
    getQuestionData () {
      var self = this
      var state = self.$store.state
      var url = state.host + state.baseUrl + '/questionAnswer/getQuestionData?userId='+state.userId+'&questionId=' + self.questionId
      self.$http.get(url).then(res => {
        var data = res.data.data
        self.question = data
        self.targetName = self.question.nickName
        self.commentTargetId = self.questionId
      })
    },
    getAnswerData () {
      var self = this
      var state = self.$store.state
      self.isRequest = true
      var url = state.host + state.baseUrl + '/questionAnswer/getAnswerData?userId='+state.userId+'&questionId=' + self.questionId + '&answerSort=' + self.answerSort + '&curPage=' + self.curPage + '&pageSize=10'
      self.$http.get(url)
        .then(res => {
          setTimeout(() => {
            self.isRequest = false
          },1000*Math.random())
          var data = res.data.data.data
          if (!data || data.length === 0) {
            if (self.curPage === 1) {
                Toast({message: '您的问题暂无回复', duration: 1000})
                self.answer = []
            } else {
                self.showEnd = true
            }
            self.curPage--
          } else {
            if (self.curPage === 1) self.answer = []
            self.answer = self.answer.concat(data)
          }
        }, err => {
          self.isRequest = false
          self.curPage--
        })
    },
    saveQAdata () {
      var self = this
      var state = self.$store.state
      var topicId = self.$route.query.topicId
      if (self.commentWord.length === 0) {
        Toast({message: '请先填写回复内容', duration: 2000})
        return
      }
      var url = state.host + state.baseUrl + '/questionAnswer/saveQAdata?topicId=' + self.topicDetail.id + '&pid=' + self.commentTargetId + '&targetUserId=' + self.question.creatorId + '&targetUserNickName=' + self.targetName + '&content=' + self.commentWord + '&creatorId=' + state.userId  + '&creator=' + state.userName + '&sCode=' + self.topicDetail.sCode
      self.$http.get(url).then(res => {
        var data = res.data
        self.commentWord = ''
        self.curPage = 1
        self.showEnd = false
        self.getQuestionData()
        self.getAnswerData()
        Toast({message: '回复成功', duration: 3000})
        self.nowCommentTarget = -2
        self.showCommentFlag = false
      })
    },
    // 点赞
    savePraiseData (type, bizId, index, $event) {
      $event.stopPropagation()
      var self = this
      var state = self.$store.state
      if (type === 1 && self.question.isPraise == 1) {
        Toast({message: '您已经点赞过此问题', position: 'center', duration: 2000})
        return
      }
      if (index >= 0 && self.answer[index].isPraise == 1) {
        Toast({message: '您已经点赞过此回复', position: 'center', duration: 2000})
        return
      }
      if(type == 1) {
        bizId = self.questionId
      }
      var url = state.host + state.baseUrl + '/questionAnswer/savePraiseData?bizId=' + bizId + '&userId=' + state.userId + '&type=' + type
      self.$http.get(url).then(res => {
        if (index >= 0) {
        self.answer[index].praiseNum++
        self.answer[index].isPraise = 1
        }
        if(type == 1) {
        self.question.praiseNum++
        self.question.isPraise = 1
        }
        praiseAnimate($event,1)
      })
    },
    // 订阅话题
    subscribe () {
      var self = this
      if (self.topicDetail.isSubscribe === 1) {
        Toast({message: '您已订阅过此话题', duration: 3000})
        return false
      }
      var state = self.$store.state
      var topicId = self.$route.query.topicId
      var url = state.host + state.baseUrl + '/topic/subscribe?userId=' + state.userId + '&topicId=' + topicId
      self.$http.get(url).then(res => {
        self.topicDetail.subscribeNum++
        self.topicDetail.isSubscribe = 1
        Toast({message: '订阅成功', duration: 3000})
      })
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'getTopicDetail'
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../css/color.scss';
    @import '../css/mixins.scss';
    @import '../css/topic-detail.scss';
    @import '../css/comment-list.scss';
    
    .path{
        top:0 !important;
    }
    .container{
        margin-top:.7rem;
        margin-bottom:.9rem;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        // padding-bottom:.9rem;
    }
    .comments{
        margin-top:0 !important;
        padding-bottom: 0;
        overflow: auto;
    }
    .comments-item{
        border:0;
        border-bottom:.01rem dashed $border-color;
        &:last-child{
            .item{
                border:0;
            }
        }
    }
    .question{
        border-bottom:.01rem solid $border-color !important;
    }
    .desc-total{
      margin:.1rem .28rem;
      .seeAll{
          color:$theme-color;
          border-bottom:.02rem solid $theme-color;
        }
    }
    
</style>
