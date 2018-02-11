<template>
  <div class="news3" @click="canselSlide($event)">
    <Tab entryName="快捷答疑" :tabLast="$store.state.currentClassify"></Tab>
    <div class="wrapper">
      <ul class="newsDetailList">
        <li>
          <span>提问时间：</span>
          <p>{{newsList.createTime | myDateFormat}}</p>
        </li>
        <li>
          <span>提问人：</span>
          <p>{{newsList.forwordUserName}}</p>
        </li>
        <li>
          <span>处理人：</span>
          <p>{{newsList.answerUserName}}</p>
        </li>
        <li>
          <span>状态：</span>
          <p :class="[{'status0':status==0},{'status4':status==4}]">{{status == 0 ? "审核通过" :
            status == 1 ? "待回复" :
              status == 2 ? "已回复" :
                status == 3 ? "待认领" :
                  status == 4 ? "驳回" : ''}}</p>
        </li>
        <li v-if="status==4">
          <span>意见：</span>
          <p>{{newsList.remark}}</p>
        </li>
        <li>
          <span>问题内容：</span>
        </li>
        <div class="questionContent">
          {{newsList.question}}
        </div>
        <li v-if="newsList.answer">
          <span>我的回复：</span>
        </li>
        <div class="answerContent" v-if="newsList.answer" v-html="answer">
        </div>
      </ul>
    </div>

    <div class="claim-btns" v-if="status==3">
      <div class="yes" @click="wantClaim">
        <i class="icon-gou"></i>
        我要认领
      </div>
      <div class="no" @click="$router.back()">
        <i class="icon-cha"></i>
        &nbsp; 取&nbsp;&nbsp; 消&nbsp;
      </div>
    </div>

    <div class="revoke" v-if="this.isCanRepealReply && this.repealReplyLeftSecond>0">
      <div class="revoke-btns">
        <div class="last-time">
          {{this.repealReplyLeftSecond}}s
        </div>
        <div class="revoke-click" @click="revoke">
          撤销回复
        </div>
      </div>
    </div>

    <div class="reply-area-container" v-if="status==1||status==4">
      <div class="reply-area">
        <div class="fast-list" v-show="showFastList">
          <ul class="tab">
            <li :class="{'active':chooseIndex==0}" @click="chooseIndex=0;">历史回复</li>
            <li :class="{'active':chooseIndex==1}" @click="chooseIndex=1;">推荐回复</li>
          </ul>
          <ul class="history-content" v-show="chooseIndex==0">
            <li v-for="(item,index) in historyContentList" @click="showFastList=false;replyContent=item;">
              {{item}}
            </li>
            <p v-show="historyContentList.length==0">您还没有历史回复消息</p>
          </ul>
          <ul class="fast-content" v-show="chooseIndex==1">
            <li v-for="(item,index) in fastContentList" @click="showFastList=false;replyContent=item;">
              {{item}}
            </li>
            <p v-show="fastContentList.length==0">抱歉！该问题还没有匹配到合适的回复。</p>
          </ul>
        </div>
        <textarea maxlength="10000" autofocus placeholder="请输入回复消息" v-model="replyContent"></textarea>
        <div class="reply-btns">
          <p @click="clearContent">
            <i class="icon-cha"></i>
            <span>清空</span>
          </p>
          <p @click="showFastList=!showFastList" :class="{'active':showFastList}">
            <i class="icon-bottom"></i>
            <span>快捷回复</span>
          </p>
          <p @click="showVoice=true;">
            <i class="icon-voice"></i>
            <span>语音输入</span>
          </p>
        </div>
      </div>
      <div class="auditing-btns">
        <div @click="yesFlag=true;" :class="['yes',{'active':yesFlag}]">
          <i class="icon-gou"></i>
          提交审批
        </div>
        <div @click="cancelAuditing" :class="['no',{'active':noFlag}]">
          <i class="icon-cha"></i>
          &nbsp; 取&nbsp;&nbsp; 消&nbsp;
        </div>
      </div>
    </div>

    <Confirm text="是否确认提交审批？" v-show="yesFlag" @cancel="yesFlag=false;" @sure="postYes"></Confirm>
    <Confirm text="是否放弃您填写的回复文本？" v-show="noFlag" @cancel="noFlag=false;" @sure="postNo"></Confirm>
    <Toast :toastWords="toastWords" v-show="showToast"></Toast>
    <Loading v-show="$store.state.showLoading"></Loading>
    <Voice v-show="showVoice" @voiceCancel="showVoice=false;showFastList=false;" @voicePost="voicePost"></Voice>
    <MFooter entryIndex="2"></MFooter>
  </div>

</template>
<script>
  import Tab from '../components/tab.vue'
  import Confirm from '../components/confirm.vue'
  import Loading from '../components/loading.vue'
  import Voice from '../components/voice.vue'
  import Toast from '../components/toast.vue'
  import MFooter from '../components/footer.vue'
  import Notice from '../components/notice.vue'
  import {wxShare} from '../common/js/mixin'

  export default{
    mixins:[wxShare],
    components: {Confirm, Loading, Tab, Voice, Toast, MFooter, Notice},
    beforeDestroy(){
      this.timer = null;
      this.toastTimer = null;
    },
    computed: {
      answer(){
        return this.newsList.answer.replace(/\n/g, '<br>')
      }
    },
    data(){
      return {
        showToast: false,
        showVoice: false,
        replyContent: '',
        lastTime: 5,
        yesFlag: false,
        noFlag: false,
        newsList: {},
        showShort: true,
        tabLast: '',
        timer: null,
        chooseIndex: 1,
        showFastList: false,
        historyContentList: [],
        fastContentList: [],
        toastTimer: null,
        toastWords: '',
        isCanRepealReply: 0,
        repealReplyLeftSecond: 0,
        status: 3
      }
    },
    methods: {
      cancelAuditing(){
        if (this.replyContent.trim() == '') {
          this.$router.back();
        } else {
          this.noFlag = true;
        }
      },
      canselSlide(e){
        if (e.target.className == 'wrapper' || e.target.className == 'newsDetailList') {
          this.showFastList = false;
        }
      },
//      scrollUl(event, distance){
//        var ele = event.currentTarget;
//        var scrollTop = ele.scrollTop;
//        var scrollHeight = ele.scrollHeight;
//        var offsetHeight = ele.offsetHeight;
////        console.log("scrollTop:"+scrollTop+",和scrollHeight:"
////          +scrollHeight+",和offsetHeight:"+offsetHeight);
//        if (scrollTop + offsetHeight + distance > scrollHeight) {
//          this.loadMore();
//        }
//      },
      vali(words){
        this.toastWords = words;
        this.showToast = true;
        var _this = this;
        this.toastTimer = setTimeout(function () {
          _this.showToast = false
        }, 2000)
      },
      //撤销回复方法
      revoke(){
        this.$store.commit('SET_LOADING_STATU', true);
        this.$http.get(this.$store.state.host + '/answer/repealAnswer' + '?id=' + this.newsList.id + '&userToken=' + localStorage.zb_userToken)
          .then((res) => {
            res = res.body;

            //如果账号被挤下去了的话
            if (res.code == '040004') {
              localStorage.setItem('zb_userToken', '');
              this.$router.push({
                path: '/login'
              })
            }


            this.$store.commit('SET_LOADING_STATU', false);

            if (res.code == '000000') {
              window.location.reload(true);
            } else if (res.code == '999997') {
              this.vali('发生错误');
            } else if (res.code == '999998') {
              this.vali('参数错误');
            } else if (res.code == '999999') {
              this.vali('系统异常');
            } else if (res.code == '060001') {
              this.vali('答疑问题已经被认领');
            } else if (res.code == '060002') {
              this.vali('答疑已经审核，不能撤回回复');
            }
          })

      },
      voicePost(value){
        this.showFastList = false;
        this.showVoice = false;
        this.replyContent = value;
      },
      //点击我要认领后
      wantClaim(){
        this.$store.commit('SET_LOADING_STATU', true);
        this.$http.get(this.$store.state.host + '/answer/userClaimQuestion' + '?id=' + this.$route.params.newsid.substring(1) + '&userToken=' + localStorage.zb_userToken)
          .then((res) => {
            res = res.body;

            //如果账号被挤下去了的话
            if (res.code == '040004') {
              localStorage.setItem('zb_userToken', '');
              this.$router.push({
                path: '/login'
              })
            }


            this.$store.commit('SET_LOADING_STATU', false);
            if (res.code == '000000') {
              window.location.reload(true);
            } else if (res.code == '999997') {
              this.vali('发生错误');
            } else if (res.code == '999998') {
              this.vali('参数错误');
            } else if (res.code == '999999') {
              this.vali('系统异常');
            } else if (res.code == '060001') {
              this.vali('问题已被认领');
            }
          })
      },
      clearContent(){
        this.showFastList = false;
        this.replyContent = '';
      },
      postNo(){
        this.$router.back();
      },
      postYes(){
        if (this.replyContent.trim() == '') {
          this.yesFlag = false;
          this.vali('回复信息不能为空');
        } else {
          this.$store.commit('SET_LOADING_STATU', true);
          this.$http.post(this.$store.state.host + '/answer/saveAnswer',
            {
              userToken: localStorage.zb_userToken,
              id: this.$route.params.newsid.substring(1),
              sCode: localStorage.zb_sCode,
              answer: this.replyContent
            })
            .then(res => {
              res = res.body;
              //如果账号被挤下去了的话
              if (res.code == '040004') {
                localStorage.setItem('zb_userToken', '');
                this.$router.push({
                  path: '/login'
                })
              }

              this.$store.commit('SET_LOADING_STATU', false);
              this.yesFlag = false;

              if (res.code == '000000') {
                window.location.reload(true);
              } else if (res.code == '999997') {
                this.vali('发生错误');
              } else if (res.code == '999998') {
                this.vali('参数错误');
              } else if (res.code == '999999') {
                this.vali('系统异常');
              } else if (res.code == '770002') {
                this.vali('请勿输入表情')
              }

            })
        }
      }
    },
    filters: {
      myDateFormat(time) {
        return new Date(Number(time)).myDateFormat()
      }
    },
    created(){

      this.$store.commit('SET_LOADING_STATU', true);
      this.$http.get(this.$store.state.host + '/answer/getQuestionDetail' + '?id=' + this.$route.params.newsid.substring(1) + '&userToken=' + localStorage.zb_userToken)
        .then(res => {
          res = res.body;

          //如果账号被挤下去了的话
          if (res.code == '040004') {
            localStorage.setItem('zb_userToken', '');
            this.$router.push({
              path: '/login'
            })
          }


          if (res.code == '000000') {
            console.log(res)
            this.newsList = res.data;
            this.tabLast = res.data.question;
            this.isCanRepealReply = res.data.isCanRepealReply;
            this.repealReplyLeftSecond = res.data.repealReplyLeftSecond;
            this.status = res.data.status;

//            刷新时如果允许撤销回复，就开启定时器
            if (res.data.isCanRepealReply) {
              this.timer = setInterval(() => {
                if (this.repealReplyLeftSecond == 0) {
                  this.timer = null;
                } else {
                  this.repealReplyLeftSecond = this.repealReplyLeftSecond - 1;
                }
              }, 1000)
            }
          } else if (res.code == '999999') {
            this.vali('系统异常')
          } else if (res.code == '999998') {
            this.vali('参数错误')
          } else if (res.code == '999997') {
            this.vali('发生错误')
          } else {
            this.vali('系统异常')
          }


          this.$store.commit('SET_LOADING_STATU', false);
        })
//获取历史回复内容列表的接口
      this.$http.get(this.$store.state.host + '/answer/findUserHistoryAnswerList' + '?userToken=' + localStorage.zb_userToken + '&pageSize=10')
        .then(res => {

          //如果账号被挤下去了的话
          if (res.code == '040004') {
            localStorage.setItem('zb_userToken', '');
            this.$router.push({
              path: '/login'
            })
          }


          if (res.body.code == '000000') {
            this.historyContentList = res.body.data;
//            this.historyContentList = [];
          }
        })

      //获取快捷回复内容列表的接口
      this.$http.get(this.$store.state.host + '/answer/findRecommendAnswerList' + '?userToken=' + localStorage.zb_userToken + '&sCode=' + localStorage.zb_sCode
        + '&question=' + this.newsList.question + '&pageSize=10')
        .then(res => {

          //如果账号被挤下去了的话
          if (res.code == '040004') {
            localStorage.setItem('zb_userToken', '');
            this.$router.push({
              path: '/login'
            })
          }


          if (res.body.code == '000000') {
            this.fastContentList = res.body.data;
//            this.fastContentList = [];
          }
        })

    },
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/variable";
  @import "../common/css/mixin";

  .news3 {
    padding-top: .36rem;
    /*position: fixed;*/
    /*z-index: 101;*/
    /*top: .6rem;*/
    /*left: 0;*/
    /*right: 0;*/
    /*bottom: .46rem;*/
    /*padding-bottom: .52rem;*/
    /*overflow-y: scroll;*/
    /*-webkit-overflow-scrolling: touch;*/
    /*background: #fff;*/
    /*padding: .1rem .1rem 2.15rem .1rem;*/

    .wrapper {
      padding: 0 .1rem;
      position: absolute;
      background: #fff;
      z-index: 56;
      width: 100%;
      top: .72rem;
      /*bottom: .96rem;*/
      bottom: .46rem;
      padding-bottom: 2.2rem;
      left: 0;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .revoke {
      position: fixed;
      background: #fff;
      width: 100%;
      z-index: 57;
      left: 0;
      bottom: .46rem;
      height: .5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      .revoke-btns {
        width: 2.7rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .last-time {
          width: .6rem;
          height: .3rem;
          border-radius: .15rem;
          background: #e76d66;
          line-height: .3rem;
          font-size: .17rem;
          text-align: center;
          color: #fff;
        }
        .revoke-click {
          width: 2rem;
          height: .3rem;
          line-height: .28rem;
          border-radius: .15rem;
          text-align: center;
          color: @theme;
          background: #eee;
          font-size: .17rem;
          border: 1px solid @theme;
        }
      }
    }
    .claim-btns {
      position: fixed;
      background: #fff;
      z-index: 300;
      width: 100%;
      left: 0;
      bottom: .46rem;
      height: .5rem;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .yes {
        color: @theme;
        font-size: .14rem;
        height: .26rem;
        border: 1px solid @theme;
        border-radius: .13rem;
        line-height: .24rem;
        text-align: center;
        padding: 0 .12rem;
      }
      .no {
        color: #999;
        font-size: .14rem;
        height: .26rem;
        border: 1px solid #999;
        border-radius: .13rem;
        line-height: .24rem;
        text-align: center;
        padding: 0 .12rem;
      }
    }

    .reply-area-container {
      position: fixed;
      z-index: 350;
      bottom: .46rem;
      background: #fff;
      width: 100%;
      left: 0;
      .reply-area {
        height: 1.5rem;
        padding-left: .08rem;
        padding-right: .08rem;
        width: 100%;
        padding-bottom: .38rem;
        .fast-list {
          position: absolute;
          bottom: .9rem;
          left: .08rem;
          right: .08rem;
          height: 2.2rem;
          ul.tab {
            display: flex;
            align-items: center;
            height: .24rem;
            li {
              flex: 1;
              height: .24rem;
              text-align: center;
              font-size: .13rem;
              color: #555;
              line-height: .24rem;
              background-image: url('../common/image/gray.png');
              background-size: cover;
              &.active {
                background-image: url('../common/image/blue.png');
                color: #fff;
              }
            }
          }
          ul.fast-content, ul.history-content {
            height: 1.96rem;
            padding: 0 7px;
            overflow-y: scroll;
            background: rgba(0, 0, 0, .6);
            -webkit-overflow-scrolling: touch;
            li {
              padding: 7px 0;
              line-height: 1.4;
              color: #fff;
              font-size: .12rem;
              .border-1px(#ddd);
            }
            p {
              padding: 7px 0;
              line-height: 1.4;
              color: #fff;
              font-size: .12rem;
            }
          }
        }
        textarea {
          resize: none;
          padding: 8px;
          border: 1px solid #ddd;
          background: #fcfcfc;
          width: 100%;
          box-sizing: border-box;
          height: 1.44rem;
          outline: none;
          padding-bottom: .34rem;
          font-size: .16rem;
        }
        .reply-btns {
          position: absolute;
          bottom: .6rem;
          left: 0;
          width: 100%;
          /*height: .34rem;*/
          padding-right: .16rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          p {
            font-size: .12rem;
            color: @theme;
            padding: .03rem .04rem;
            display: flex;
            align-items: center;
            width: .8rem;
            border: 1px solid #ddd;
            padding-right: 0;
            margin-left: .1rem;
            background: #fff;
            &.active {
              color: #fff;
              background: @theme;
              i {
                color: @theme;
                background: #fff;
              }
            }
            i {
              border-radius: 50%;
              background: @theme;
              color: #fff;
              display: inline-block;
              width: .16rem;
              height: .16rem;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            span {
              font-size: .13rem;
              flex: 1;
              display: flex;
              justify-content: space-around;
            }
          }
        }
      }
      .auditing-btns {
        background: #fff;
        width: 100%;
        height: .5rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .yes {
          color: #409c23;
          font-size: .14rem;
          height: .26rem;
          border: 1px solid #409c23;
          border-radius: .13rem;
          line-height: .24rem;
          text-align: center;
          padding: 0 .12rem;
          &.active {
            color: #fff;
            background: #409c23;
            border: none;
            line-height: .26rem;
          }
        }
        .no {
          color: #999;
          font-size: .14rem;
          height: .26rem;
          border: 1px solid #999;
          border-radius: .13rem;
          line-height: .24rem;
          text-align: center;
          padding: 0 .12rem;
          &.active {
            color: #fff;
            background: #999;
            border: none;
            line-height: .26rem;
          }
        }
      }
    }

    ul.newsDetailList {
      margin-top: .06rem;
      li {
        font-size: .14rem;
        display: flex;
        line-height: 1.8;
        span {
          color: @theme;
        }
        p {
          color: #666;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          &.status0 {
            color: #4da622;
          }
          &.status4 {
            color: #E15B53;
          }
        }
      }
      .questionContent, .answerContent {
        /*text-indent: 2em;*/
        line-height: 1.4;
        margin-top: .04rem;
        font-size: .13rem;
        color: #666;
      }
    }
  }
</style>
