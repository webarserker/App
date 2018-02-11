<template>
  <div class="wrap">
      <span class="icon-loading"></span>
  </div>

</template>
<script>
  export default {

  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/variable";
  .wrap{
    position:fixed;
    background:rgba(0,0,0,.3);
    z-index:2000;
    top:0;
    left:0;
    right:0;
    bottom:0;
    display:flex;
    align-items:center;
    justify-content: center;
    .icon-loading{
      font-size:.5rem;
      color:@theme;
      -moz-animation: whirly-loader 1.25s infinite linear;
      -webkit-animation: whirly-loader 1.25s infinite linear;
      animation: whirly-loader 1.25s infinite linear;
      -moz-transform-origin: 50% 50%;
      -ms-transform-origin: 50% 50%;
      -webkit-transform-origin: 50% 50%;
      transform-origin: 50% 50%;
    }
  }
  @-moz-keyframes whirly-loader {
    0% {
      -moz-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -moz-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes whirly-loader {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes whirly-loader {
    0% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -moz-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }


</style>
