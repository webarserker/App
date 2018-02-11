<template>
  <div class="news2">
    <Tab entryName="答疑审核" :tabLast="tabLast"></Tab>
    <div class="wrapper">
      <ul>
        <li>
          <span>标题：</span>
          <p>{{newsList.question}}</p>
        </li>
        <li>
          <span>提问人：</span>
          <p>{{newsList.forwordUserName}}</p>
        </li>
        <li>
          <span>提问时间：</span>
          <p>{{newsList.createTime | myDateFormat}}</p>
        </li>
        <li>
          <span>处理类型：</span>
          <p>{{newsList.answerType == 0 ? 'PC端智能' :
            newsList.answerType == 1 ? 'PC端人工' :
              newsList.answerType == 2 ? '微信端智能' :
                newsList.answerType == 3 ? '微信端人工' : ''}}</p>
        </li>
        <li>
          <span>处理人：</span>
          <p>{{newsList.answerUserName}}</p>
        </li>
        <li>
          <span>状态：</span>
          <p :class="[{'status0':status==0},{'status4':status==4}]">{{status == 1 ? "草稿" :
            status == 2 ? "待审核" :
              status == 0 ? "通过" :
                status == 4 ? "驳回" : ''}}
          </p>
        </li>
        <li>
          <span>修改人：</span>
          <p>{{newsList.modifier}}</p>
        </li>
        <li v-if="status==4">
          <span>意见：</span>
          <p>{{newsList.remark}}</p>
        </li>
        <li>
          <span>内容详情：</span>
        </li>
        <div class="short-content" v-if="showShort">
          <div v-html="shortContent">
          </div>
          <a @click="toggleShort" v-show="!littleWords">查看更多&gt;&gt;</a>
        </div>
        <div class="content" v-if="!showShort">
          <div style="display:inline-block;" v-html="answer">
          </div>
          <p class="retract"><a @click="toggleShort" v-show="!littleWords">&lt;&lt;收起</a></p>
        </div>
      </ul>
    </div>

    <div class="auditing-btns">
      <div @click="yesFlag=true;" :class="['yes',{'active':yesFlag}]" v-if="status==2 && isCanAudit">
        <i class="icon-gou"></i>
        审核通过
      </div>
      <div @click="noFlag=true;" :class="['no',{'active':noFlag}]" v-if="status==2 && isCanAudit">
        <i class="icon-cha"></i>
        审核不通过
      </div>
    </div>
    <div class="revoke" v-if="this.isCanRepealAudit && this.repealAuditLeftSecond>0">
      <div class="revoke-btns">
        <div class="last-time">
          {{this.repealAuditLeftSecond}}s
        </div>
        <div class="revoke-click" @click="revoke">
          撤销审核
        </div>
      </div>
    </div>
    <Loading v-show="$store.state.showLoading"></Loading>
    <Confirm text="是否确认审核通过？" v-show="yesFlag" @cancel="yesFlag=false;" @sure="postYes"></Confirm>
    <SendBack v-show="noFlag" @cancel="noFlag=false;" @sure="postNo"></SendBack>

    <Toast :toastWords="toastWords" v-show="showToast"></Toast>
    <MFooter entryIndex="1"></MFooter>
  </div>


</template>
<script>
  import Tab from '../components/tab.vue'
  import Loading from '../components/loading.vue'
  import Confirm from '../components/confirm.vue'
  import SendBack from '../components/sendBack.vue'
  import MFooter from '../components/footer.vue'
  import Notice from '../components/notice.vue'
  import Toast from '../components/toast.vue'
  import {wxShare} from '../common/js/mixin'

  export default {
    mixins:[wxShare],
    components: {Tab, Loading, Confirm, SendBack, MFooter, Notice, Toast},
    beforeDestroy(){
      this.timer = null;
      this.toastTimer = null;
    },
    data(){
      return {
        status: 1,
        yesFlag: false,
        noFlag: false,
        newsList: {},
        showShort: true,
        tabLast: '',
        timer: null,
        isCanRepealAudit: 0,
        repealAuditLeftSecond: 0,
        isCanAudit: true,
        littleWords: false,
        showToast: false,
        toastTimer: null,
        toastWords: ''
      }
    },
    filters: {
      myDateFormat(time) {
        return new Date(Number(time)).myDateFormat()
      }
    },
    computed: {
      shortContent(){
        return this.newsList.answer ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + this.newsList.answer.substr(0, 120) : '';
      },
      answer(){
        return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + this.newsList.answer.replace(/\s{3,}/g, "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
      }
    },
    created(){

      this.$store.commit('SET_LOADING_STATU', true);
      this.$http.get(this.$store.state.host + '/answer/getAnswerDetail' + '?id=' + this.$route.params.newsid.substring(1) + '&userToken=' + localStorage.zb_userToken)
        .then(res => {
          console.log(res.body);

          //如果账号被挤下去了的话
          if (res.code == '040004') {
            localStorage.setItem('zb_userToken', '');
            this.$router.push({
              path: '/login'
            })
          }


          if (res.body.code == '000000') {
            this.newsList = res.body.data;
            this.status = res.body.data.status;
            if (!res.body.data.answer) {
              this.littleWords = true;
            } else if (res.body.data.answer && res.body.data.answer.length <= 120) {
              this.showShort = false;
              this.littleWords = true;
            } else {
              this.showShort = true;
              this.littleWords = false;
            }

            this.tabLast = res.body.data.question;
            this.isCanRepealAudit = res.body.data.isCanRepealAudit;
            this.repealAuditLeftSecond = res.body.data.repealAuditLeftSecond;
            this.isCanAudit = res.body.data.isCanAudit;
            //定时器放在请求到数据之后，不能放在mounted里面，因为有异步延迟
            if (this.isCanRepealAudit) {
              this.timer = setInterval(() => {
                if (this.repealAuditLeftSecond == 0) {
                  this.timer = null;
                } else {
                  this.repealAuditLeftSecond = this.repealAuditLeftSecond - 1;
                }
              }, 1000)
            }
          }
          this.$store.commit('SET_LOADING_STATU', false);
        })
    },
    methods: {
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
      //撤销审核方法
      revoke(){
        this.$store.commit('SET_LOADING_STATU', true);
        this.$http.get(this.$store.state.host + '/answer/repealAudit' + '?id=' + this.newsList.id + '&userToken=' + localStorage.zb_userToken)
          .then((res) => {
            res = res.body;

            //如果账号被挤下去了的话
            if (res.code == '040004') {
              localStorage.setItem('zb_userToken', '');
              this.$router.push({
                path: '/login'
              })
            } else if (res.code == '999999') {
              this.vali('系统异常');
            } else if (res.code == '000000') {
              this.$store.commit('SET_LOADING_STATU', false);
              window.location.reload(true);
            }else{
                this.vali('系统异常')
            }
          })

      },
      toggleShort(){
        this.showShort = !this.showShort;
      },
      postYes(){
        this.yesFlag = false;
        //点击审核通过的请求
        this.$store.commit('SET_LOADING_STATU', true);
        this.$http.get(this.$store.state.host + '/answer/audit' + '?id=' + this.newsList.id + '&userToken=' + localStorage.zb_userToken + '&status=1')
          .then((res) => {
            res = res.body;

            //如果账号被挤下去了的话
            if (res.code == '040004') {
              localStorage.setItem('zb_userToken', '');
              this.$router.push({
                path: '/login'
              })
            } else if (res.code == '060003') {
              this.$store.commit('SET_LOADING_STATU', false);
              this.vali('回复已经撤回，不能审核');
            } else if (res.code == '000000') {
              this.$store.commit('SET_LOADING_STATU', false);
              window.location.reload(true);
            }
          })

      },
      postNo(value){
        //点击审核不通过的请求
        if (value.trim() == '') {
          this.vali('驳回理由不能为空')
        } else {
          this.$store.commit('SET_LOADING_STATU', true);
          this.$http.post(this.$store.state.host + '/answer/audit',
            {
              id: this.newsList.id,
              userToken: localStorage.zb_userToken,
              status: 0,
              remark: value
            })
            .then((res) => {
              res = res.body;

              //如果账号被挤下去了的话
              if (res.code == '040004') {
                localStorage.setItem('zb_userToken', '');
                this.$router.push({
                  path: '/login'
                })
              } else if (res.code == '060003') {
                this.$store.commit('SET_LOADING_STATU', false);
                this.vali('回复已经撤回，不能审核');
              } else if (res.code == '770002') {
                this.$store.commit('SET_LOADING_STATU', false);
                this.vali('请勿输入表情')
              } else if (res.code == '999999') {
                this.$store.commit('SET_LOADING_STATU', false);
                this.vali('系统异常');
              } else if (res.code == '000000') {
                this.$store.commit('SET_LOADING_STATU', false);
                window.location.reload(true);
              } else {
                this.vali('系统异常')
              }
            })
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/variable";

  .news2 {
    padding-top: .36rem;
    /*position: absolute;*/
    /*z-index:101;*/
    /*top: 0;*/
    /*width:100%;*/
    /*bottom: .46rem;*/
    /*overflow-y: scroll;*/
    /*-webkit-overflow-scrolling: touch;*/
    /*background: #fff;*/
    /*padding: .1rem .1rem .7rem .1rem;*/

    .wrapper {
      padding: 0 .1rem;
      position: absolute;
      background: #fff;
      z-index: 56;
      width: 100%;
      top: .72rem;
      bottom: .46rem;
      padding-bottom: .5rem;
      left: 0;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .revoke {
      position: fixed;
      background: #fff;
      z-index: 300;
      width: 100%;
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
    .auditing-btns {
      position: fixed;
      z-index: 300;
      background: #fff;
      width: 100%;
      left: 0;
      bottom: .46rem;
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
        color: #e76d66;
        font-size: .14rem;
        height: .26rem;
        border: 1px solid #e76d66;
        border-radius: .13rem;
        line-height: .24rem;
        text-align: center;
        padding: 0 .12rem;
        &.active {
          color: #fff;
          background: #e76d66;
          border: none;
          line-height: .26rem;
        }
      }
    }
    ul {
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
      .content, .short-content {
        /*text-indent: 1em;*/
        line-height: 1.4;
        margin-top: .04rem;
        font-size: .13rem;
        color: #666;
      }
      .short-content a, .content a {
        color: @theme;
        font-size: .12rem;
      }
      .content .retract {
        text-align: right;
      }
    }
  }
</style>

