<template>
  <div class="drop-flag">
    <div class="drop">
      <div class="words">
        网络异常，请稍后再试
      </div>
      <div class="confirm" @click="sure">
        确定
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    methods:{
      sure(){
        this.$store.commit('SET_DROPPED',false);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";
  .drop-flag{
    position: fixed;
    z-index: 5000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    justify-content: center;
    .drop{
      background-color:#fff;
      width:pxToRem(520);
      height:pxToRem(220);
      border-radius:pxToRem(20);
      text-align:center;
      .words{
        color:#000;
        font-size:pxToRem(32);
        height:pxToRem(140);
        line-height:pxToRem(140);
        @include border-1px(#ddd);
      }
      .confirm{
        color:#479DE2;
        font-size:pxToRem(32);
        line-height:pxToRem(80);
      }
    }
  }
</style>
