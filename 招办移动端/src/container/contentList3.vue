<template>
    <div class="contentList">
      <Notice></Notice>
      <Tab entryName="快捷答疑"></Tab>
      <div class="wrapper">
        <ul>
          <li>
            <div class="header" @click=slideToggle(1)>
              <p>
                待认领问题
                <span class="red" v-show="Number($store.state.waitClaimNotReadNum)"></span>
              </p>
              <i :class="['icon-bottom',{'icon-top':slideStatu1}]"></i>
            </div>
            <div class="scroll-wrap1" @scroll="scrollUl1($event,2)">
              <ul v-show="slideStatu1" class="scroll-ul">
                <li v-for="(item,index) in contentList31" @click="item.isRead=true;newsDetail1(item.id,'待认领问题')">
                  <div class="title">
                    <p>
                      {{item.question}}
                      <span class="red" v-show="!item.isRead"></span>
                    </p>
                  </div>
                  <div class="time">
                    {{item.createTime | myDateFormat}}
                    <i class="icon-right"></i>
                  </div>
                </li>
                <Loadword v-show="hasNoMore1"></Loadword>
              </ul>
            </div>
          </li>

          <li>
            <div class="header header2" @click=slideToggle(2)>
              <p>
                待处理问题
                <span class="red" v-show="Number($store.state.waitReplyNotReadNum)"></span>
              </p>
              <i :class="['icon-bottom',{'icon-top':slideStatu2}]"></i>
            </div>
            <div class="scroll-wrap2" @scroll="scrollUl2($event,2)">
              <ul v-show="slideStatu2" class="scroll-ul">
                <li v-for="(item,index) in contentList32" @click="item.isRead=true;newsDetail2(item.id,'待处理问题')">
                  <div class="title">
                    <p>
                      {{item.question}}
                      <span class="red" v-show="!item.isRead"></span>
                    </p>
                  </div>
                  <div class="time">
                    {{item.createTime | myDateFormat}}
                    <i class="icon-right"></i>
                  </div>
                </li>
                <Loadword v-show="hasNoMore2"></Loadword>
              </ul>
            </div>
          </li>

          <li>
            <div class="header header3" @click=slideToggle(3)>
              <p>
                已解决问题
                <span class="red" v-show="Number($store.state.hasResolveNotReadNum)"></span>
              </p>
              <i :class="['icon-bottom',{'icon-top':slideStatu3}]"></i>
            </div>
            <div class="scroll-wrap3" @scroll="scrollUl3($event,2)">
              <ul v-show="slideStatu3" class="scroll-ul">
                <li v-for="(item,index) in contentList33" @click="item.isRead=true;newsDetail3(item.id,'已解决问题')">
                  <div class="title">
                    <p>
                      {{item.question}}
                      <span class="red" v-show="!item.isRead"></span>
                    </p>
                  </div>
                  <div class="time">
                    {{item.createTime | myDateFormat}}
                    <i class="icon-right"></i>
                  </div>
                </li>
                <Loadword v-show="hasNoMore3"></Loadword>
              </ul>
            </div>
          </li>

          <li>
            <div class="header header4" @click=slideToggle(4)>
              <p>
                已驳回问题
                <span class="red" v-show="Number($store.state.rejectReplyNotReadNum)"></span>
              </p>
              <i :class="['icon-bottom',{'icon-top':slideStatu4}]"></i>
            </div>
            <div class="scroll-wrap4" @scroll="scrollUl4($event,2)">
              <ul v-show="slideStatu4" class="scroll-ul">
                <li v-for="(item,index) in contentList34" @click="item.isRead=true;newsDetail4(item.id,'已驳回问题')">
                  <div class="title">
                    <p>
                      {{item.question}}
                      <span class="red" v-show="!item.isRead"></span>
                    </p>
                  </div>
                  <div class="time">
                    {{item.createTime | myDateFormat}}
                    <i class="icon-right"></i>
                  </div>
                </li>
                <Loadword v-show="hasNoMore4"></Loadword>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <Loading v-show="$store.state.showLoading"></Loading>
      <MFooter entryIndex="2" ></MFooter>
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
  import Toast from '../components/toast'
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

      /*第一个列表组*/
      this.$store.commit('SET_LOADING_STATU', true);
      this.$http.get(this.$store.state.host + '/answer/getQuestionList' + '?userToken=' + localStorage.zb_userToken + '&type=' + 3
        + '&sCode=' + localStorage.zb_sCode + '&curPage=' + this.curPage1 + '&pageSize=' + this.pageSize).then((res) => {
        res = res.body;

        //如果账号被挤下去了的话
        if (res.code == '040004') {
          localStorage.setItem('zb_userToken','');
          this.$router.push({
            path: '/login'
          })
        }


        if (res.code = '000000') {
          this.contentList31 = res.data.data;
          if (res.data.data.length < this.pageSize) {
            this.hasNoMore1 = true;
          }
        }else if(res.code=='999999'){
            this.vali('系统异常')
        }else if(res.code=='999998'){
            this.vali('参数错误')
        }else if(res.code=='999997'){
            this.vali('发生错误')
        }else{
            this.vali('系统异常')
        }
        this.$store.commit('SET_LOADING_STATU', false);
      })
      /*第二个列表组*/
//      this.$store.commit('SET_LOADING_STATU', true);
      this.$http.get(this.$store.state.host + '/answer/getQuestionList' + '?userToken=' + localStorage.zb_userToken + '&type=' + 1
        + '&sCode=' + localStorage.zb_sCode + '&curPage=' + this.curPage2 + '&pageSize=' + this.pageSize).then((res) => {
        res = res.body;
        console.log(res);
        //如果账号被挤下去了的话
        if (res.code == '040004') {
          localStorage.setItem('zb_userToken','');
          this.$router.push({
            path: '/login'
          })
        }


        if (res.code = '000000') {
          this.contentList32 = res.data.data;
          if (res.data.data.length < this.pageSize) {
            this.hasNoMore2 = true;
          }
        }else if(res.code=='999999'){
          this.vali('系统异常')
        }else if(res.code=='999998'){
          this.vali('参数错误')
        }else if(res.code=='999997'){
          this.vali('发生错误')
        }else{
          this.vali('系统异常')
        }
//        this.$store.commit('SET_LOADING_STATU', false);
      })
      /*第三个列表组*/
//      this.$store.commit('SET_LOADING_STATU', true);
      this.$http.get(this.$store.state.host + '/answer/getQuestionList' + '?userToken=' + localStorage.zb_userToken + '&type=' + 0
        + '&sCode=' + localStorage.zb_sCode + '&curPage=' + this.curPage3 + '&pageSize=' + this.pageSize).then((res) => {
        res = res.body;

        //如果账号被挤下去了的话
        if (res.code == '040004') {
          localStorage.setItem('zb_userToken','');
          this.$router.push({
            path: '/login'
          })
        }


        if (res.code = '000000') {
          this.contentList33 = res.data.data;
          if (res.data.data.length < this.pageSize) {
            this.hasNoMore3 = true;
          }
        }else if(res.code=='999999'){
          this.vali('系统异常')
        }else if(res.code=='999998'){
          this.vali('参数错误')
        }else if(res.code=='999997'){
          this.vali('发生错误')
        }else{
          this.vali('系统异常')
        }
//        this.$store.commit('SET_LOADING_STATU', false);
      })

      /*第四个列表组*/
//      this.$store.commit('SET_LOADING_STATU', true);
      this.$http.get(this.$store.state.host + '/answer/getQuestionList' + '?userToken=' + localStorage.zb_userToken + '&type=' + 4
        + '&sCode=' + localStorage.zb_sCode + '&curPage=' + this.curPage4 + '&pageSize=' + this.pageSize).then((res) => {
        res = res.body;

        //如果账号被挤下去了的话
        if (res.code == '040004') {
          localStorage.setItem('zb_userToken','');
          this.$router.push({
            path: '/login'
          })
        }


        if (res.code = '000000') {
          this.contentList34 = res.data.data;
          if (res.data.data.length < this.pageSize) {
            this.hasNoMore4 = true;
          }
        }else if(res.code=='999999'){
          this.vali('系统异常')
        }else if(res.code=='999998'){
          this.vali('参数错误')
        }else if(res.code=='999997'){
          this.vali('发生错误')
        }else{
          this.vali('系统异常')
        }
//        this.$store.commit('SET_LOADING_STATU', false);
      })
    },
    data(){
      return {
        contentList31: [],
        contentList32: [],
        contentList33: [],
        contentList34: [],
        curPage1: 1,
        curPage2: 1,
        curPage3: 1,
        curPage4: 1,
        pageSize: 15,
        hasNoMore1: false,
        hasNoMore2: false,
        hasNoMore3: false,
        hasNoMore4: false,
        slideStatu1: true,
        slideStatu2: false,
        slideStatu3: false,
        slideStatu4: false,
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
      newsDetail1(id,str){
        this.$store.commit('SET_CURRENT_CLASSIFY',str);
        this.$http.get(this.$store.state.host + '/sysUser/saveContentReadRecord' + '?userToken=' + localStorage.zb_userToken + '&sCode=' + localStorage.zb_sCode
          + '&userType=20' + '&contentId=' + id + '&contentType=20').then(res => {

          res = res.body;

          //如果账号被挤下去了的话
          if (res.code == '040004') {
            localStorage.setItem('zb_userToken','');
            this.$router.push({
              path: '/login'
            })
          }else if(res.code=='999999'){
            this.vali('系统异常');
          }else if(res.code='000000'){
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


            this.$router.push({
              path: `/home/contentList3/:${id}`
            })
          }else{
              this.vali('系统异常')
          }

        })

      },
      newsDetail2(id,str){
        this.$store.commit('SET_CURRENT_CLASSIFY',str);
        this.$http.get(this.$store.state.host + '/sysUser/saveContentReadRecord' + '?userToken=' + localStorage.zb_userToken + '&sCode=' + localStorage.zb_sCode
          + '&userType=20' + '&contentId=' + id + '&contentType=21').then(res => {

          res = res.body;

          //如果账号被挤下去了的话
          if (res.code == '040004') {
            localStorage.setItem('zb_userToken','');
            this.$router.push({
              path: '/login'
            })
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


            this.$router.push({
              path: `/home/contentList3/:${id}`
            })
          }else{
              this.vali('系统异常')
          }


        })
      },
      newsDetail3(id,str){
        this.$store.commit('SET_CURRENT_CLASSIFY',str);
        this.$http.get(this.$store.state.host + '/sysUser/saveContentReadRecord' + '?userToken=' + localStorage.zb_userToken + '&sCode=' + localStorage.zb_sCode
          + '&userType=20' + '&contentId=' + id + '&contentType=23').then(res => {

          res = res.body;

          //如果账号被挤下去了的话
          if (res.code == '040004') {
            localStorage.setItem('zb_userToken','');
            this.$router.push({
              path: '/login'
            })
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


            this.$router.push({
              path: `/home/contentList3/:${id}`
            })
          }else{
              this.vali('系统异常')
          }


        })
      },
      newsDetail4(id,str){
        this.$store.commit('SET_CURRENT_CLASSIFY',str);
        this.$http.get(this.$store.state.host + '/sysUser/saveContentReadRecord' + '?userToken=' + localStorage.zb_userToken + '&sCode=' + localStorage.zb_sCode
          + '&userType=20' + '&contentId=' + id + '&contentType=22').then(res => {

          res = res.body;

          //如果账号被挤下去了的话
          if (res.code == '040004') {
            localStorage.setItem('zb_userToken','');
            this.$router.push({
              path: '/login'
            })
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


            this.$router.push({
              path: `/home/contentList3/:${id}`
            })
          }else{
              this.vali('系统异常')
          }


        })
      },







      scrollUl1(event, distance){
        var ele = event.currentTarget;
        var scrollTop = ele.scrollTop;
        var scrollHeight = ele.scrollHeight;
        var offsetHeight = ele.offsetHeight;
        if (scrollTop + offsetHeight + distance > scrollHeight) {
          this.loadMore1();
        }
      },
      scrollUl2(event, distance){
        var ele = event.currentTarget;
        var scrollTop = ele.scrollTop;
        var scrollHeight = ele.scrollHeight;
        var offsetHeight = ele.offsetHeight;
        if (scrollTop + offsetHeight + distance > scrollHeight) {
          this.loadMore2();
        }
      },
      scrollUl3(event, distance){
        var ele = event.currentTarget;
        var scrollTop = ele.scrollTop;
        var scrollHeight = ele.scrollHeight;
        var offsetHeight = ele.offsetHeight;
        if (scrollTop + offsetHeight + distance > scrollHeight) {
          this.loadMore3();
        }
      },
      scrollUl4(event, distance){
        var ele = event.currentTarget;
        var scrollTop = ele.scrollTop;
        var scrollHeight = ele.scrollHeight;
        var offsetHeight = ele.offsetHeight;
        if (scrollTop + offsetHeight + distance > scrollHeight) {
          this.loadMore4();
        }
      },
      loadMore1(){
        if (!this.hasNoMore1) {
          this.curPage1++;
          this.$store.commit('SET_LOADING_STATU', true);
          this.$http.get(this.$store.state.host + '/answer/getQuestionList' + '?userToken=' + localStorage.zb_userToken + '&type=' + 3
            + '&sCode=' + localStorage.zb_sCode + '&curPage=' + this.curPage1 + '&pageSize=' + this.pageSize).then((res) => {
            res = res.body;
            console.log(res);
            //如果账号被挤下去了的话
            if (res.code == '040004') {
              localStorage.setItem('zb_userToken','');
              this.$router.push({
                path: '/login'
              })
            }


            if (res.code = '000000') {
              this.contentList31 = this.contentList31.concat(res.data.data);
              if (res.data.data.length < this.pageSize) {
                this.hasNoMore1 = true;
              }
            }else{
                this.vali('系统异常')
            }
            this.$store.commit('SET_LOADING_STATU', false);
          })
        }
      },
      loadMore2(){
        if (!this.hasNoMore2) {
          this.curPage2++;
          this.$store.commit('SET_LOADING_STATU', true);
          this.$http.get(this.$store.state.host + '/answer/getQuestionList' + '?userToken=' + localStorage.zb_userToken + '&type=' + 1
            + '&sCode=' + localStorage.zb_sCode + '&curPage=' + this.curPage2 + '&pageSize=' + this.pageSize).then((res) => {
            res = res.body;
            console.log(res);
            //如果账号被挤下去了的话
            if (res.code == '040004') {
              localStorage.setItem('zb_userToken','');
              this.$router.push({
                path: '/login'
              })
            }


            if (res.code = '000000') {
              this.contentList32 = this.contentList32.concat(res.data.data);
              if (res.data.data.length < this.pageSize) {
                this.hasNoMore2 = true;
              }
            }else{
              this.vali('系统异常')
            }
            this.$store.commit('SET_LOADING_STATU', false);
          })
        }

      },
      loadMore3(){
        if (!this.hasNoMore3) {
          this.curPage3++;
          this.$store.commit('SET_LOADING_STATU', true);
          this.$http.get(this.$store.state.host + '/answer/getQuestionList' + '?userToken=' + localStorage.zb_userToken + '&type=' + 0
            + '&sCode=' + localStorage.zb_sCode + '&curPage=' + this.curPage3 + '&pageSize=' + this.pageSize).then((res) => {
            res = res.body;

            //如果账号被挤下去了的话
            if (res.code == '040004') {
              localStorage.setItem('zb_userToken','');
              this.$router.push({
                path: '/login'
              })
            }


            if (res.code = '000000') {
              this.contentList33 = this.contentList33.concat(res.data.data);
              if (res.data.data.length < this.pageSize) {
                this.hasNoMore3 = true;
              }
            }else{
              this.vali('系统异常')
            }
            this.$store.commit('SET_LOADING_STATU', false);
          })
        }
      },
      loadMore4(){
        if (!this.hasNoMore4) {
          this.curPage4++;
          this.$store.commit('SET_LOADING_STATU', true);
          this.$http.get(this.$store.state.host + '/answer/getQuestionList' + '?userToken=' + localStorage.zb_userToken + '&type=' + 4
            + '&sCode=' + localStorage.zb_sCode + '&curPage=' + this.curPage4 + '&pageSize=' + this.pageSize).then((res) => {
            res = res.body;

            //如果账号被挤下去了的话
            if (res.code == '040004') {
              localStorage.setItem('zb_userToken','');
              this.$router.push({
                path: '/login'
              })
            }


            if (res.code = '000000') {
              this.contentList34 = this.contentList34.concat(res.data.data);
              if (res.data.data.length < this.pageSize) {
                this.hasNoMore4 = true;
              }
            }else{
              this.vali('系统异常')
            }
            this.$store.commit('SET_LOADING_STATU', false);
          })
        }
      },
      slideToggle(index){
        if (this['slideStatu' + index] == true) {
          this['slideStatu' + index] = false;
        } else {
          this.slideStatu1 = false,
            this.slideStatu2 = false,
            this.slideStatu3 = false,
            this.slideStatu4 = false,
            this['slideStatu' + index] = true;
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/variable";
  @import "../common/css/mixin";

  .contentList {

    .wrapper{
      position:absolute;
      background:#fff;
      z-index:55;
      width:100%;
      top:.72rem;
      bottom:.46rem;
      left:0;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    div.header {
      font-size: .14rem;
      .border-1px(#ddd);
      .borderTop-1px(#ddd);
      height: .44rem;
      line-height: .44rem;
      padding: 0 .1rem;
      background:#fff;
      p{
        display:inline-block;
        padding-right:10px;
        position:relative;
        span.red{
          position: absolute;
          width: 4px;
          height: 4px;
          right: 0px;
          top: .06rem;
          background: #E15B53;
          border-radius: 50%;
        }
      }
      i{
        float:right;
        line-height:.44rem;
        margin-right:.1rem;
        &.icon-top{
          color: @theme;
        }
      }
    }
    div.header2 {
      position: relative;
      top: -1px;
    }
    div.header3 {
      position: relative;
      top: -2px;
    }
    div.header4 {
      position: relative;
      top: -3px;
    }
    .scroll-wrap1, .scroll-wrap2, .scroll-wrap3, .scroll-wrap4 {
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      max-height: 3rem;
      .scroll-ul {
        padding: 0 .1rem;
        position: relative;
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
                right: 2px;
                top: .06rem;
                width: 4px;
                height: 4px;
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
  }

</style>
