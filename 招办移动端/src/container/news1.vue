<template>
  <div class="news1">
    <Tab entryName="内容审核" :tabLast="tabLast"></Tab>
    <div class="wrapper" ref="canToTop" @scroll="setScrollTop">
      <ul>
        <li>
          <span>标题：</span>
          <p v-html="newsList.title"></p>
        </li>
        <li>
          <span>发布人：</span>
          <p>{{newsList.publishBy}}</p>
        </li>
        <li>
          <span>发布时间：</span>
          <p>{{newsList.pulishTime | myDateFormat}}</p>
        </li>
        <li>
          <span>所属分类：</span>
          <p v-html="newsList.belongCategory"></p>
        </li>
        <li>
          <span>修改人：</span>
          <p v-html="newsList.modifier"></p>
        </li>
        <li v-if="status==4">
          <span>意见：</span>
          <p v-html="newsList.opinion"></p>
        </li>
        <li>
          <span>处理人：</span>
          <p v-html="newsList.dealBy"></p>
        </li>
        <li>
          <span>状态：</span>
          <p :class="[{'status3':status==3},{'status4':status==4}]">{{status == 1 ? "草稿" :
            status == 2 ? "待审核" :
              status == 3 ? "通过" :
                status == 4 ? "驳回" : ''}}
          </p>
        </li>
        <li v-show="newsList.timer">
          <span>定时发布：</span>
          <p>{{newsList.timer}}</p>
        </li>
        <li v-show="newsList.timer">
          <span>定时发布描述：</span>
          <p v-html="newsList.timerDesc"></p>
        </li>
        <li>
          <span>内容详情：</span>
        </li>
        <!--<div class="short-content" v-if="showShort">-->
        <!--<div v-html="shortContent"></div>&nbsp;&nbsp;-->
        <!--&lt;!&ndash;<a @click="toggleShort" v-show="!littleWords">查看更多&gt;&gt;</a>&ndash;&gt;-->
        <!--</div>-->
        <div class="content" ref="content">
          <div v-html="newsList.content"></div>
          <!--<p class="retract"><a @click="toggleShort" v-show="!littleWords">&lt;&lt;收起</a></p>-->
        </div>
      </ul>
    </div>

    <div class="auditing-btns">
      <div @click="yesFlag=true;" :class="['yes',{'active':yesFlag}]" v-if="status==2">
        <i class="icon-gou"></i>
        审核通过
      </div>
      <div @click="noFlag=true;" :class="['no',{'active':noFlag}]" v-if="status==2">
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
    <div class="top" @click="toTop" v-show="scrollTop>50"></div>

    <Loading v-show="$store.state.showLoading"></Loading>
    <Confirm text="是否确认审核通过？" v-show="yesFlag" @cancel="yesFlag=false;" @sure="postYes"></Confirm>
    <SendBack v-show="noFlag" @cancel="noFlag=false;" @sure="postNo"></SendBack>
    <Toast :toastWords="toastWords" v-show="showToast"></Toast>
    <MFooter entryIndex="0"></MFooter>


    <div class="bigImg" v-show="imgToBig">
      <img :src="currentImgSrc" @click="imgToBig=!imgToBig">
    </div>
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
        imgToBig: false,
        currentImgSrc: '',
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
//        littleWords: false,
        showToast: false,
        toastTimer: null,
        toastWords: '',
        scrollTop: 0
      }
    },
    filters: {
      myDateFormat(time) {
        return new Date(Number(time)).myDateFormat()
      }
    },
    computed: {
//      content(){
//        return this.newsList.content ? this.newsList.content.replace(/<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g, '') : '';
//
//      },
//      shortContent(){
////        var shortContent = this.newsList.content ? this.newsList.content.substr(0, 280) : '';
////        if (shortContent.lastIndexOf('>') != -1) {
////          var i = shortContent.lastIndexOf('>');
////          return shortContent.substring(0, i + 1);
////        } else {
////          return shortContent;
////        }
//        return this.content.substr(0, 120);
//      }
    },
    updated(){
      var _this = this;
      var imgs = this.$refs.content.getElementsByTagName('img');
      for (let i = 0; i < imgs.length; i++) {
        imgs[i].onclick = function () {
          var src = this.getAttribute('src');
          _this.imgToBig = true;
          _this.currentImgSrc = src;
        }
      }
    },
    created(){

      this.$store.commit('SET_LOADING_STATU', true);
      this.$http.get(this.$store.state.host + '/infoContent/getContentDetail' + '?id=' + this.$route.params.newsid.substring(1) + '&userToken=' + localStorage.zb_userToken)
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
//            if (!res.body.data.content) {
////              this.littleWords = true;
//            } else if (res.body.data.content && this.content.length <= 120) {
//              this.showShort = false;
//              this.littleWords = true;
//            } else {
//              this.showShort = true;
//              this.littleWords = false;
//            }

            this.tabLast = res.body.data.title;
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
      setScrollTop(e){
        var ele = e.currentTarget;
        var top = ele.scrollTop;
        this.scrollTop = top;
      },
      toTop(){
        this.$refs.canToTop.scrollTop = 0;
      },
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
        this.$http.get(this.$store.state.host + '/infoContent/repealAudit' + '?id=' + this.newsList.id + '&userToken=' + localStorage.zb_userToken)
          .then((res) => {
            res = res.body;

            //如果账号被挤下去了的话
            if (res.code == '040004') {
              localStorage.setItem('zb_userToken', '');
              this.$router.push({
                path: '/login'
              })
            } else if (res.code == '999999') {
              this.$store.commit('SET_LOADING_STATU', false);
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
        this.$store.commit('SET_LOADING_STATU', true);
        //点击审核通过的请求
        this.$http.get(this.$store.state.host + '/infoContent/audit' + '?id=' + this.newsList.id + '&userToken=' + localStorage.zb_userToken + '&status=1')
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
            window.location.reload(true);
          })

      },
      postNo(value){  //驳回输入框点击确认
        //点击审核不通过的请求
        if (value.trim() == '') {
          this.vali('驳回理由不能为空')
        } else {
          this.$store.commit('SET_LOADING_STATU', true);

          this.$http.post(this.$store.state.host + '/infoContent/audit',
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
              } else if (res.code == '770002') {
                this.$store.commit('SET_LOADING_STATU', false);
                this.vali('请勿输入表情')
              } else if (res.code == '999999') {
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

  .news1 {
    padding-top: .36rem;
    /*position: absolute;*/
    /*padding: .6rem .1rem .7rem .1rem;*/
    /*z-index:99;*/
    /*width:100%;*/
    /*top: 0;*/
    /*left:0;*/
    /*height:100%;*/
    /*overflow-y: scroll;*/
    /*-webkit-overflow-scrolling: touch;*/
    .bigImg {
      position: fixed;
      z-index: 1800;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, .8);
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 98%;
        height: auto;
      }
    }

    .top {
      width: .4rem;
      height: .4rem;
      background-image: url('../common/image/top.png');
      position: fixed;
      bottom: 1.2rem;
      right: .15rem;
      z-index: 999;
      background-size: cover;
    }
    .wrapper {
      padding: 0 .1rem;
      position: absolute;
      background: #fff;
      z-index: 200 !important;
      width: 100%;
      top: .72rem;
      bottom: .46rem;
      padding-bottom: .6rem;
      left: 0;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .wrapper * {
      z-index: 200 !important;
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
          &.status3 {
            color: #4da622;
          }
          &.status4 {
            color: #E15B53;
          }
        }
      }
      .content, .short-content {
        /*text-indent: 1em;*/
        line-height: 1.5;
        margin-top: .04rem;
        color: #666;
        font-size: .14rem;
      }
      .short-content a, .content a {
        color: @theme;
        font-size: .12rem;
        display: inline-block;
      }
      .content .retract {
        text-align: right;
      }
    }
  }
</style>
