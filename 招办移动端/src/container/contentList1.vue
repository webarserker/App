<template>
    <div class="contentList" >
      <Notice></Notice>
      <Tab entryName="内容审核"></Tab>
      <div class="none" v-show="contentList1.length==0 && !unLoad">
        <div>
          <span class="icon-nonelist"><span class="path1"></span><span class="path2"></span></span>
          <p>您没有审核消息</p>
        </div>
      </div>
      <div class="wrapper" @scroll="scrollUl($event,3)">
        <ul class="scroll-ul" v-show="contentList1.length>0">
          <li v-for="(item,index) in contentList1" @click="item.isRead=true;newsDetail(item.id)">
            <div class="title">
              <p>
                {{item.title}}
                <span class="red" v-show="!item.isRead"></span>
              </p>
            </div>
            <div class="time">
              {{item.createTime | myDateFormat}}
              <i class="icon-right"></i>
            </div>
          </li>
          <Loadword v-show="hasNoMore"></Loadword>
        </ul>
      </div>

      <Loading v-show="$store.state.showLoading"></Loading>


      <MFooter entryIndex="0"></MFooter>

      <Toast :toastWords="toastWords" v-show="showToast"></Toast>

      <router-view></router-view>
    </div>


</template>
<script>
  import Tab from '../components/tab'
  import Loadword from '../components/loadword'
  import Loading from '../components/loading'
  import MFooter from '../components/footer'
  import Notice from '../components/notice'
  import Toast from '../components/toast.vue'
  import {wxShare} from '../common/js/mixin'


  export default {
    mixins:[wxShare],
    components: {Tab, Loadword, Loading,MFooter,Notice,Toast},
    filters: {
      myDateFormat(time) {
        return new Date(Number(time)).myDateFormatOnlyDate()
      }
    },
    created(){

      this.$store.commit('SET_LOADING_STATU', true);
      this.$http.get(this.$store.state.host + '/infoContent/findToAuditContentList' + '?userToken=' + localStorage.zb_userToken
        + '&sCode=' + this.$store.state.sCode + '&curPage=' + this.curPage + '&pageSize=' + this.pageSize).then((res) => {
        res = res.body;

        //如果账号被挤下去了的话
        if (res.code == '040004') {
          localStorage.setItem('zb_userToken','');
          this.$router.push({
            path: '/login'
          })
        }


        if (res.code = '000000') {
          this.contentList1 = res.data.data;
          if (res.data.length < this.pageSize) {
            this.hasNoMore = true;
          }
        }else{
            this.vali('系统异常')
        }
        this.unLoad=false;
        this.$store.commit('SET_LOADING_STATU', false);
      })


//      this.$http.get('/api/contentList1').then((res) => {
//        res = res.body;
//        if (res.code = '000000') {
//          this.contentList1 = res.data;
//          if (res.data.length < this.pageSize) {
//            this.hasNoMore = true;
//          }
//        }
//        this.$store.commit('SET_LOADING_STATU', false);
//      })
    },
    data(){
      return {
        contentList1: [],
        curPage: 1,
        pageSize: 15,
        hasNoMore: false,
        unLoad:true,
        toastWords:'',
        showToast:false,
        toastTimer:null
      }
    },
    methods: {
      vali(words){
        this.toastWords = words;
        this.showToast = true;
        var _this = this;
        this.toastTimer = setTimeout(function () {
          _this.showToast = false
        }, 2000)
      },
      newsDetail(id){
//        this.$store.commit('SET_LOADING_STATU', true);
        this.$http.get(this.$store.state.host + '/sysUser/saveContentReadRecord' + '?userToken=' + localStorage.zb_userToken + '&sCode=' + localStorage.zb_sCode
          + '&userType=20' + '&contentId=' + id + '&contentType=10').then(res => {

          res = res.body;

          //如果账号被挤下去了的话
          if (res.code == '040004') {
            localStorage.setItem('zb_userToken','');
            this.$router.push({
              path: '/login'
            })
          }else if(res.code=='999999'){
              this.vali('系统异常');
          }else if(res.code=='000000'){

            sessionStorage.setItem('zb_contentNotReadNum', res.data.contentNotReadNum);
            sessionStorage.setItem('zb_answerNotReadNum', res.data.answerNotReadNum);
            sessionStorage.setItem('zb_questionNotReadNum', res.data.questionNotReadNum);
            sessionStorage.setItem('zb_waitClaimNotReadNum', res.data.waitClaimNotReadNum);
            sessionStorage.setItem('zb_waitReplyNotReadNum', res.data.waitReplyNotReadNum);
            sessionStorage.setItem('zb_hasResolveNotReadNum', res.data.hasResolveNotReadNum);
            sessionStorage.setItem('zb_rejectReplyNotReadNum', res.data.rejectReplyNotReadNum);

            this.$store.commit('SET_CONTENT_NOT_READ_NUM', res.data.contentNotReadNum);
            this.$store.commit('SET_ANSWER_NOT_READ_NUM', res.data.answerNotReadNum);
            this.$store.commit('SET_QUESTION_NOT_READ_NUM', res.data.questionNotReadNum);
            this.$store.commit('SET_WAIT_CLAIM_NOT_READ_NUM', res.data.waitClaimNotReadNum);
            this.$store.commit('SET_WAIT_REPLY_NOT_READ_NUM', res.data.waitReplyNotReadNum);
            this.$store.commit('SET_HAS_RESOLVE_NOT_READ_NUM', res.data.hasResolveNotReadNum);
            this.$store.commit('SET_REJECT_REPLY_NOT_READ_NUM', res.data.rejectReplyNotReadNum);

//          this.$store.commit('SET_LOADING_STATU', false);
            this.$router.push({
              path: `/home/contentList1/:${id}`
            })
          }


        })
      },
      scrollUl(event, distance){
        var ele = event.currentTarget;
        var scrollTop = ele.scrollTop;
        var scrollHeight = ele.scrollHeight;
        var offsetHeight = ele.offsetHeight;
//        console.log("scrollTop:"+scrollTop+",和scrollHeight:"
//          +scrollHeight+",和offsetHeight:"+offsetHeight);
        if (scrollTop + offsetHeight + distance > scrollHeight) {
          this.loadMore();
        }
      },
      loadMore(){
        //在没有见底的情况下才继续上拉加载请求
        if(!this.hasNoMore){
          this.curPage++;
          this.$store.commit('SET_LOADING_STATU', true);
          this.$http.get(this.$store.state.host + '/infoContent/findToAuditContentList' + '?userToken=' + localStorage.zb_userToken
            + '&sCode=' + this.$store.state.sCode + '&curPage=' + this.curPage + '&pageSize=' + this.pageSize).then((res) => {
            res = res.body;

            //如果账号被挤下去了的话
            if (res.code == '040004') {
              localStorage.setItem('zb_userToken','');
              this.$router.push({
                path: '/login'
              })
            }


            console.log(res);
            if (res.code = '000000') {
              this.contentList1 = this.contentList1.concat(res.data.data);
              if (res.data.data.length < this.pageSize) {
                this.hasNoMore = true;
              }
            }
            this.$store.commit('SET_LOADING_STATU', false);
          })
        }

//        this.$http.get('/api/contentList1').then((res) => {
//          res = res.body;
//          if (res.code = '000000') {
//            this.contentList1 = this.contentList1.concat(res.data);
//            if (res.data.length < this.pageSize) {
//              this.hasNoMore = true;
//            }
//          }
//          this.$store.commit('SET_LOADING_STATU', false);
//        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/mixin";


  .contentList {


    .wrapper{
      position: absolute;
      /*padding-top:.6rem;*/
      /*padding-bottom:.46rem;*/
      z-index: 55 !important;
      width: 100%;
      top: .72rem;
      bottom:.46rem;
      left:0;
      /*height:100%;*/
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }

    .none {
      position: fixed;
      width: 100%;
      top: .72rem;
      bottom: .5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      div {
        text-align: center;
        span {
          font-size: .9rem;
        }
        p {
          margin-top: .15rem;
          font-size: .13rem;
          color: #666;
        }
      }
    }
    .scroll-ul{
      li {
        .border-1px(#ddd);
        height: .43rem;
        line-height: .42rem;
        display: flex;
        padding: 0 .1rem;
        &:active{
          background-color:#eee;
        }
        .title {
          flex: 1;
          font-size: .13rem;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            position: relative;
            max-width: 100%;
            padding-right: 10px;
            font-size: .13rem;
            .red {
              position: absolute;
              width: 4px;
              height: 4px;
              right: 0px;
              top: .06rem;
              background: #E15B53;
              border-radius: 50%;
            }
          }
        }
        .time {
          width: 1rem;
          text-align: right;
          font-size: .13rem;
        }
      }
    }
  }

</style>
