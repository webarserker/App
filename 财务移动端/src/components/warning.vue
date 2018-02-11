<template>
  <div class="warning-flag" v-if="showWarning">
    <div class="warning">
      <h1>紧急通知</h1>
      <div class="content-wrapper">
        <div class="content" v-html="noticeJson.content"></div>
      </div>
      <div class="bottom-control">
        <span class="i-know" @click="doYouKnow">
          我知道了
        </span>
        <div class="never-show" @click="neverShow=!neverShow">
          <span class="rect">
            <i class="icon-gou" v-show="neverShow"></i>
          </span>
          不再提醒
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    watch: {
      '$route'(to, from) {
        this.showWarning = false;
        this.neverShow=false;
        this.noticeId = '';
        this.noticeJson = [];

        this.$http.get(`${this.$store.state.host}/front/getUrgentNotification?userId=${localStorage.fuserid}`).then(res => {
          res = res.body;
          if (res.code == '000000') {
            this.noticeId = res.data.id;
            this.noticeJson = res.data;
            if (res.data.isRead) {
              this.showWarning = false;
            } else {
              this.showWarning = true;
            }
          }
        })
      }
    },
    data() {
      return {
        showWarning: false,
        neverShow: false,
        noticeJson: {},
        noticeId: ''
      }
    },
    created() {
      this.$http.get(`${this.$store.state.host}/front/getUrgentNotification?userId=${localStorage.fuserid}`).then(res => {
        res = res.body;
        if (res.code == '000000') {
          this.noticeId = res.data.id;
          this.noticeJson = res.data;
          if (res.data.isRead) {
            this.showWarning = false;
          } else {
            this.showWarning = true;
          }
        }
      })
    },
    methods: {
      doYouKnow() {
        if (this.neverShow) {
          this.$http.get(this.$store.state.host + '/front/infoContentUser/save?id=' + this.noticeId + '&userId=' + localStorage.fuserid).then(res => {
            res = res.body;
          })
          this.showWarning = false;
        } else {
          this.showWarning = false;
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";

  .warning-flag {
    position: fixed;
    z-index: 2000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    justify-content: center;

    .warning {
      width: pxToRem(560);
      /*height:pxToRem(480);*/
      background-color: #fff;
      border-radius: pxToRem(14);
      padding-bottom: pxToRem(100);
      position: relative;
      padding-top:pxToRem(34);
      &>h1 {
        text-align: center;
        color: $themeColor;
        font-size: pxToRem(34);
        font-weight:bold;
        height:pxToRem(34);
        line-height:pxToRem(34)
      }
      .content-wrapper {
        min-height:pxToRem(150);
        max-height:pxToRem(400);
        padding-left: pxToRem(25);
        padding-right: pxToRem(25);
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;

        .content {
          margin-top: pxToRem(15);
          color: #666;
          font-size: pxToRem(28) !important;
          line-height:1.3 !important;
          *{
            font-size:pxToRem(28) !important;
            line-height:1.3 !important;
          }
        }
      }
      .bottom-control {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: pxToRem(110);
        .i-know {
          width: pxToRem(180);
          height: pxToRem(50);
          border: pxToRem(1.4) solid $themeColor;
          border-radius: pxToRem(8);
          font-size: pxToRem(28);
          line-height: pxToRem(50);
          background-color: #a53726;
          color:#fff;
          text-align: center;
        }
        .never-show {
          height: pxToRem(42);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: pxToRem(40);
          display: flex;
          align-items: center;
          color: #666;
          font-size: pxToRem(22);
          .rect {
            width: pxToRem(22);
            height: pxToRem(22);
            border: pxToRem(1.5) solid green;
            margin-right: pxToRem(6);
            display: flex;
            align-items: center;
            justify-content: center;
            i {
              font-size: pxToRem(36);
              color: $themeColor;
            }
          }
        }
      }
    }
  }
</style>
