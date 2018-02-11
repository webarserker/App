<template>
  <div class="friend-detail">
    <div class="main" ref="scrollContent">
      <div class="list-large" v-for="(list, index) in lists" @click="gotoDetail(list.userId, list.isSeater, list.userSource)">
        <div class="info clear">
            <div class="avatar fl">
              <!-- <img :src="list.userPhoto?$getRealImg(list.userPhoto,$store.state.hostImg):$store.state.defaultPhoto" alt=""> -->
              <div :style="{'background-image':'url('+ (list.userPhoto?$getRealImg(list.userPhoto,$store.state.hostImg):$store.state.defaultPhoto) +') !important'}" class="box img"></div>
              <span class="admin" v-if="list.isSeater">V</span>
            </div>
            <div class="text fl">
              <p class="name ellipsis">{{list.nickName}}</p>
              <div class="time">{{list.createTime | formatTime(nowTime)}}</div>
            </div>
        </div>
          <template v-if="list.type === 1 || list.type === 2 || list.type === 3">
            <div class="content" v-if="list.type === 1">
              我创建了一个话题，快来提问吧！
            </div>
            <div class="content" v-if="list.type === 2">
              我订阅了{{list.dynamicsTopicVo.userName}}用户的话题，快来一起提问吧！
            </div>
            <div class="content" v-if="list.type === 3">
              我点赞了{{list.dynamicsTopicVo.userName}}用户的话题
            </div>
            <div class="box box-ver topic-list">
              <div @click.stop="goTopicDetail(list.dynamicsTopicVo, list.dynamicsTopicVo.status)" :style="{'background-image':'url('+$store.state.hostImg + list.dynamicsTopicVo.imgUrl+')'}"  class="box topic-item box-ver" >
                  <div class="create-user box box-ac">
                    <div v-text="showStatus(list.dynamicsTopicVo.status)" class="box">
                    </div>
                    <div class="box box-f1"></div>
                    <a class="link" >{{list.dynamicsTopicVo.schoolName}}</a>
                      <!-- <div :style="{'background-image':'url('+(list.dynamicsTopicVo.userPhoto?$getRealImg(list.dynamicsTopicVo.userPhoto,$store.state.hostImg):$store.state.defaultPhoto)+')'}" class="icon-head"></div> -->
                      <!-- <div class="name ellipsis box-f1">{{list.dynamicsTopicVo.userName}}</div> -->
                  </div>
                  <div class="box-f1"></div>
                  <div class="box-pc box title tx-c">
                      {{list.dynamicsTopicVo.title}}
                  </div>
                  <div class="box box-ac">
                      <div class="create-college box box-ac box-f1 box-fh">
                          <div :style="{'background-image':'url('+$store.state.hostSchoolLogo + list.dynamicsTopicVo.schoolLogo+')'}" class="icon-head" ></div>
                          <div class="name ellipsis box-f1">{{list.dynamicsTopicVo.schoolName}}</div>
                      </div>
                      <!-- <div v-text="showStatus(list.dynamicsTopicVo.status)" class="box box-ac box-pc box-f1 box-fh status">
                      </div> -->
                      <div class="box box-ac box-f1 box-fh collect">
                          <div class="box-f1"></div>
                          <div class="icon-collect-act"></div>
                          <div class="num">{{list.dynamicsTopicVo.subscribeNum}}</div>
                      </div>
                  </div>
              </div>
            </div>
          </template>
          <template v-if="list.type === 4 || list.type === 5">
            <div class="content" v-if="list.type === 4">
              我回复了{{list.userQuestionAnswerVo.targetUserNickName}}的提问
            </div>
            <div class="content" v-if="list.type === 5">
              我对{{list.userQuestionAnswerVo.targetUserNickName}}的话题提了一个问题
            </div>
            <div class="box box-ver box-f1 comments-list" @click.stop="goDetail(list.userQuestionAnswerVo)" >
              <div class="comments-item box box-ver">
                  <div class="box box-ver item">
                      <div class="box box-ac">
                          <div :style="{'background-image':'url('+ (list.userQuestionAnswerVo.targetUserPhoto?$getRealImg(list.userQuestionAnswerVo.targetUserPhoto,$store.state.hostImg):$store.state.defaultPhoto) +') !important'}" class="avatar box" :id="'id.'+list.userQuestionAnswerVo.targetUserPhoto">
                              <div v-if="list.isSeater == 1" class="vip box box-ac box-pc">V</div>
                          </div>
                          <div class="box box-ver box-f1">
                              <div class="nickname box">
                                  <div>{{list.userQuestionAnswerVo.targetUserNickName}}</div>
                                  <!-- <div v-if="item.isTopicCreator == 1" class="tag">题主</div> -->
                              </div>
                              <div class="time">{{list.userQuestionAnswerVo.targetCreateTime | formatTime(nowTime)}}</div>
                          </div>
                          <div class="box box-ac">
                              <div class="icon-comment"></div>
                              <div class="num">{{list.userQuestionAnswerVo.questionReplyNum}}</div>
                          </div>
                      </div>
                      <div class="txt ell-3">{{list.userQuestionAnswerVo.content}}</div>
                  </div>
                  <div class="icon-arrow-bot"></div>
              </div>
            </div>
          </template>
          <template v-if="list.type === 6">
            <div class="content">
              我关注了{{list.userAttentionVo.targetUserNickName}}用户
            </div>
            <div class="list-large" style="border-bottom:none" @click.stop="goFriendDetail(list.userAttentionVo.targetUserId, list.userAttentionVo.targetUserIsSeater, list.userAttentionVo.targetUserProvinceName)">
              <div class="info clear">
                <div class="avatar fl">
                  <div :style="{'background-image':'url('+(list.userAttentionVo.targetUserPhoto?$getRealImg(list.userAttentionVo.targetUserPhoto,$store.state.hostImg):$store.state.defaultPhoto)+')'}" class="box img"></div>
                  <span class="admin" v-if="list.userAttentionVo.targetUserIsSeater">V</span>
                </div>
                <div class="text fl">
                  <p class="name">{{list.userAttentionVo.targetUserNickName}}</p>
                  <div class="time province">{{list.userAttentionVo.targetUserProvinceName}}</div>
                </div>
              </div>
              <div class="content">个性签名：<br/>{{list.userAttentionVo.content}}</div>
            </div>
          </template>
          <template v-if="list.type === 7">
            <div class="content">
              <span style="display:block;margin-bottom:.04rem;">我修改了签名:</span>{{list.content}}
            </div>
          </template>
      </div>
      <v-loading :isRequest="isRequest" :showEnd="showEnd" :msg="'没有更多消息了'"></v-loading>
    </div>
  </div>
</template>

<script>
  import { MessageBox, Toast } from 'mint-ui'
  import { scrollController } from '../utils/common'

  export default {
    components: {
      MessageBox,
      Toast,
      "v-loading": require('../components/loading.vue')
    },
    data() {
      return {
        zanImg: require('../img/icon-zan.png'),
        isAdmin: true,
        name: 'fsfs',
        desc: 'fsfsf',
        actTabIndex: -1,
        schoolList: [],
        departmentList: [],
        lists: [],
        showTabListFlag: false,
        curPage: 1,
        ArrStatus: ['待审核', '进行中...', '此话题已关闭'],
        lastScrollTop: 0,
        nowTime: new Date().getTime(),
        isRequest: false,
        showEnd:false,
        topicDetail: {
            content:''
        }, // 话题详情
        topicId: ''
      }
    },
    methods: {
      loadMore () {
        if (this.showEnd) return
        if (!this.isRequest) {
          this.curPage++
          this.loadData()
        }
      },
      routergo (router) {
        var self = this
        self.$router.push(router)
      },
      goTopicDetail (item, status) {
        var self = this
        if (status == 2) {
          Toast({message: '此话题已经被删除', duration: 1000})
          return
        }
        self.routergo('/topicDetail1?topicId=' + item.topicId)
      },
      goDetail (item) {
        this.getQuestionData (item.questionId)
      },
      goFriendDetail(userId, isSeater, provinceName) {
        if(!provinceName) {
          provinceName = ''
        }
        window.localStorage.setItem('targetUserId', userId)
        window.localStorage.setItem('userSource', provinceName)

        console.log(userId)
        if (isSeater) {
          this.$router.push('/userfriendadmin')
        } else {
          this.$router.push('/userfriend')
        }
      },
      getQuestionData (questionId) {
        var self = this
        var state = self.$store.state
        var url = state.host + state.baseUrl + '/questionAnswer/getQuestionData?questionId=' + questionId
        self.$http.get(url)
          .then(res => {
            // console.log('问题详情>>>>', JSON.stringify(res))
            var data = res.data.data
            if (!data || data.length === 0) { 
            } else {
              self.topicId = data.topicId
              this.getTopicDetail (self.topicId,questionId)
            }
          })
      },
      // 获取话题详情
      getTopicDetail (topicId,questionId) {
        var self = this
        var state = self.$store.state
        var url = state.host + state.baseUrl + '/topic/getTopicDetail?topicId=' + topicId + '&userId=' + state.userId
        self.$http.get(url)
          .then(res => {
            var data = res.data.data
            if (!data) {
              console.log('没有详情')
            } else {
              self.topicDetail = data
              window.sessionStorage.setItem('question_topicDetail',JSON.stringify(self.topicDetail))
              this.$router.push('/commentsList?questionId=' + questionId)
            }
          })
      },
      showStatus (status) {
        return this.ArrStatus[status]
      },
      loadData () {
        let that = this
        let state = this.$store.state
        let userinfo = state.userInfo
        let url = state.host + state.baseUrl + '/userDynamics/findUserDynamicsList?userId=' + userinfo.id + '&curPage=' + this.curPage + '&pageSize=5'
        console.log(url)
        that.isRequest = true

        this.$http.get(url, '', true).then(res => {
          var data = res.data.data.data
          that.isRequest = false
          console.log('dynamics>>>>', res)
          if (!data || data.length === 0) {
            if (that.curPage === 1) {
              Toast({message: '暂无好友动态', duration: 1000})
              return false
            } else {
              that.showEnd = true
            }
            that.curPage--
          } else {
            if (that.curPage === 1) that.users = []
            that.lists = that.lists.concat(data)
          }
        }, err => {
          that.isRequest = false
          that.curPage--
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
    mounted() {
      var self = this
      if (!this.$store.state.isLogin) {
        this.$router.replace('/')
        return
      }
      scrollController({
        ele: self.$refs.scrollContent,
        delay: 267,
        endCb () {
          self.loadMore()
        }
      })
      this.loadData()
    }
  }
</script>

<style scoped lang="scss">
  @import "../css/color.scss";
  @import "../css/mixins.scss";
  @import '../css/topicList.scss';
  .create-user {
    .icon-head {
      background-size: cover;
      background-position-y: 0 !important;
      background-repeat: no-repeat;
    }
  }
  .topic-list {
    margin-top: 0 !important;
  }
  .topic-item {
    margin: .1rem 0 0 !important;
  }
  .icon-collect-act {
    background-size: cover;
    background-repeat: no-repeat;
  }
  // 用户资料
  .friend-detail {
    // padding-top: 1.3rem;
    height:100%;
    .main {
      height:100%;
      overflow-y:scroll;
    }
    .time {
      font-size: .22rem;
      color: #999;
      line-height: 1;
    }
    .list-large {
        /* margin: 0 .3rem; */
        padding: .3rem;
        border-bottom: .15rem solid #DBDBDB;
      .list-large {
        padding-left: 0;
        margin-left: 1rem;
        .content {
          margin-top: .1rem;
          margin-left: 0;
        }
      }
      .icon-head {
        background-size: cover;
        background-position-y: -0.1rem;
        background-repeat: no-repeat;
      }
      .zan {
        color: #999;
        img {
          vertical-align: middle;
        }
      }
      .content {
        color: #555;
        font-size: .30rem;
        margin: .05rem 0;
        margin-left: .78rem;
        line-height: 1.2;
        word-wrap: break-word;
      }
      .list-large .content {
          margin-left: 0;
          font-size: .26rem;
          color: #999;
        }
      .avatar {
        position: relative;
        width: .7rem;
        height: .7rem;
        margin-right: .1rem;
        margin-top: .02rem;
        // overflow: hidden;
        .img {
          border-radius: 50%;
          width: .7rem;
          height: .7rem;
          background-size: cover;
          background-repeat: no-repeat;
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
        width: 85%;
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
    }
  }

    // 回复相关
    .ell-3{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .comments-list{
      // margin-top:.7rem;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
        .desc-total{
            font-size:.28rem;
            margin-top:.2rem;
        }
    }

    .comments-item{
        background-color: #f9f9f9;
        color: #666;
        margin-top: .1rem;
        margin-left: .9rem;
        margin-right: 0;
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
        .avatar{
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
        .box.avatar {
          width:.72rem;
          height:.72rem;
          background-size: cover;
          background-color:#ddd;
          border-radius:50%;
          margin-right:.2rem;
        }
        .nickname{
            font-size:.26rem;
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
</style>

