<template>
    <div class="box box-ver h-p100">
        <nav-path>
            <a href="javascript:;" @click="$router.push('/')">{{question.schoolName?question.schoolName:'获取中...'}}</a>
            &gt;&nbsp;
            <div class="ellipsis box-f1">{{question.topicTitle?question.topicTitle:'获取中...'}}</div>
        </nav-path> 
        <div ref="scrollContent" class="comments box box-ver box-fh box-f1">
            <div class="box">
                <div class="box-f1"></div>
                <div @click="$router.push('/topicDetail?topicId=' + question.topicId)" class="back-topic box box-ac box-pc">进入原话题</div>
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
                        <div class="time">{{question.userSource ? question.userSource : '此用户很懒，还没有留下任何足迹'}}</div>
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
            <div v-if="answer.length>0" class="box order box-ac">
                <div class="box-f1"></div>
                <div @click="changeSort()" class="box box-ac">
                    <div class="icon-order"></div>
                    <div >排序</div>
                </div>
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
                      <div class="answer-answer-item"><span class="nicknime">{{itemChild.nickName | cutString(0,10)}}回复<span class="tc-main-act">@{{itemChild.targetNickName | cutString(0,10)}}</span></span>{{'：'+itemChild.content}}</div>
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
      showCommentFlag: false,
      question:{},
      answer: [],
      commentWord: '',
      questionId: this.$route.query.questionId,
      answerSort:0,
      curPage:1,
      nowTime:new Date().getTime,
      isRequest:false,
      showEnd:false,
      hideFooter:false,
      nowCommentTarget:-2,
      commentTargetId:this.$route.query.questionId,
      targetName:''
    }
  },
  mounted () {
    var self = this
    scrollController({
      ele: self.$refs.scrollContent,
      delay: 167,
      endCb () {
        self.loadMore()
      }
    })
    this.getQuestionData();
  },
  methods: {
    loadMore () {
      if (this.showEnd) return
      if (!this.isRequest) {
        this.curPage++
        this.getAnswerData()
      }
    },
    checkLogin() {
      var self = this
      var state = self.$store.state
      if (!state.isLogin) {
        self.$router.push('/login')
        return false
      }
      return true
    },
    checkStatus () {
      if (this.question.topicStatus == 2) {
        Toast({message: '所属话题已关闭', position: 'bottom', duration: 2000})
        return false
      } 
      return true
    },
    showComment () {
      var self = this
      if (!self.checkLogin()) return
      if (!self.checkStatus()) return
      self.showCommentFlag = true
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
      self.$store.commit('SET_SCODE', !sCode ? '' : sCode)
      self.$store.commit('SET_DEPARTMENTID', !departmentId ? '' : departmentId)
      self.$store.commit('SET_MAJORID', !majorId ? '' : majorId)
      self.$router.push('/')
    },
    changeSort () {
      var answerSort = this.answerSort
      this.answerSort = answerSort===0?1:0
      this.curPage = 1
      this.showEnd = false
      this.getAnswerData()
    },
    getQuestionData () {
      var self = this
      var state = self.$store.state
      var url = state.host + state.baseUrl + '/questionAnswer/getQuestionData?userId='+state.userId+'&questionId=' + self.questionId
      self.$http.get(url).then(res => {
        var data = res.data.data
        if (!data.topicId) {
            Toast({message: '此话题不存在或已删除', position: 'bottom', duration: 2000})
            return
        }
        self.question = data
        self.targetName = self.question.nickName
        document.title = this.question.topicTitle
        self.getAnswerData()
      })
    },
    getAnswerData () {
      var self = this
      var state = self.$store.state
      self.isRequest = true
      var url = state.host + state.baseUrl + '/questionAnswer/getAnswerData?userId='+state.userId+'&questionId=' + self.questionId + '&answerSort=' + self.answerSort + '&curPage=' + self.curPage + '&pageSize=10'
      self.$http.get(url).then(res => {
          setTimeout(() => {
            self.isRequest = false
          },1000*Math.random())
          var data = res.data.data.data
          if (!data || data.length === 0) {
            if (self.curPage === 1) {
              Toast({message: '此问题暂无回复', duration: 1000})
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
          console.log('请求出错了>>>>', err)
        })
    },
    saveQAdata () {
      var self = this
      var state = self.$store.state
      if (self.commentWord.length === 0) {
        Toast({message: '请先填写回复内容', duration: 2000})
        return
      }
      var url = state.host + state.baseUrl + '/questionAnswer/saveQAdata?topicId=' + self.question.topicId + '&pid=' + self.commentTargetId + '&targetUserId=' + self.question.creatorId + '&targetUserNickName=' + self.targetName + '&content=' + self.commentWord + '&creatorId=' + state.userId  + '&creator=' + state.userName + '&sCode=' + self.question.sCode
      self.$http.get(url).then(res => {
        var data = res.data
        self.commentWord = ''
        self.curPage = 1
        self.showEnd = false
        self.getQuestionData()
        Toast({message: '回复成功', duration: 3000})
        self.nowCommentTarget = -2
        self.showCommentFlag = false
      })
    },
    savePraiseData (type, bizId, index, $event) {
      $event.stopPropagation()
      var self = this
      var state = self.$store.state
      if (!self.checkLogin()) return
      if (!self.checkStatus()) return
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
        var data = res.data
        if (index >= 0) {
            self.answer[index].praiseNum++
            self.answer[index].isPraise = 1
        }
        if(type == 1) {
            self.question.praiseNum++
            self.question.isPraise = 1
        }
        // praiseAnimate ($event,10)
        praiseAnimate ($event,1)
      })
    },
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../css/color.scss';
    @import '../css/mixins.scss';
    @import '../css/comment-list.scss';
</style>
