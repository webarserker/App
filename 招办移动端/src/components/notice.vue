<template>
  <div class="notice">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item,index) in messageList" @click="entryToIt(index)">{{item}}</div>
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>

    <Toast :toastWords="toastWords" v-show="showToast"></Toast>
  </div>
</template>
<script>
  import Toast from '../components/toast.vue'
  export default{
    components: {Toast},
    created(){
      this.$http.get(this.$store.state.host + '/sysUser/getToDealTaskNum' + '?userToken=' + localStorage.getItem('zb_userToken')).then((res) => {
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

          sessionStorage.setItem('zb_contentToAuditNum', res.data.contentToAuditNum);
          sessionStorage.setItem('zb_answerToAuditNum', res.data.answerToAuditNum);
          sessionStorage.setItem('zb_questionToDealNum', res.data.questionToDealNum);

          this.$store.commit('SET_CONTENT_TO_AUDIT_NUM', res.data.contentToAuditNum);
          this.$store.commit('SET_ANSWER_TO_AUDIT_NUM', res.data.answerToAuditNum);
          this.$store.commit('SET_QUESTION_TO_DEAL_NUM', res.data.questionToDealNum);

          this.messageList.push("您有" + res.data.contentToAuditNum + "条内容审核待处理，快去解决吧",
            "您有" + res.data.answerToAuditNum + "条答疑审核待处理，快去解决吧",
            "您有" + res.data.questionToDealNum + "条快捷答疑待处理，快去解决吧")
        }else{
            this.vali('系统异常')
        }
      })
    },
    data(){
      return {
        messageList: [],
        toastWords: '',
        showToast: false,
        toastTimer: null
      }
    },
    beforeDestroy(){
      this.toastTimer = null;
      this.timer = null;
    },
    updated(){
      var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 1,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,
        loop: true
      });

      var slides = document.getElementsByClassName('swiper-slide');
      var _this=this;
      for (let i = 0; i < slides.length; i++) {
        if (i == 0) {
          slides[i].onclick = function () {
            sessionStorage.setItem('zb_entryIndex', 2);
            _this.$store.commit('SET_ENTRY_INDEX', 2);
            _this.$router.push({
              'path': '/home/contentList3'
            })
          }
        } else if (i == 4) {
          slides[i].onclick = function () {
            sessionStorage.setItem('zb_entryIndex', 0);
            _this.$store.commit('SET_ENTRY_INDEX', 0);
            _this.$router.push({
              'path': '/home/contentList1'
            })
          }
        }
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
      entryToIt(index){
        sessionStorage.setItem('zb_entryIndex', index);
        this.$store.commit('SET_ENTRY_INDEX', index);
        this.$router.push({
          'path': `/home/contentList${index + 1}`
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/variable";

  .notice {
    position: fixed;
    z-index: 300;
    top: 0;
    left: 0;
    width: 100%;
    height: .36rem;
    line-height: .36rem;
    background: @theme;
    overflow: hidden;
    .swiper-container {
      width: 100%;
      height: 100%;
      .swiper-slide {
        color: #ff999a;
        font-size: .13rem;
        padding: 0 .36rem;
        text-align:center;
      }
      .swiper-button-next {
        width: .36rem;
        height: .36rem;
        top: 0;
        margin-top: 0;
        right: -3px;
        z-index: 310;
        background-color: @theme;
        background-size: 60% 60%;
        background-image:url('../common/image/move3.gif');
        transform:rotate(180deg);
      }
      .swiper-button-prev {
        width: .36rem;
        height: .36rem;
        top: 0;
        margin-top: 0;
        left: -3px;
        z-index: 310;
        background-color: @theme;
        background-size: 60% 60%;
        background-image:url('../common/image/move3.gif');
      }
    }

  }
</style>
