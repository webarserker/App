<template>
  <div class="loading-wrapper">
    <div class="loader-inner ball-scale-multiple">
      <div></div>
      <div></div>
      <div></div>

      <p class="word">
        加载中…
      </p>
    </div>

  </div>

</template>
<script>
  export default {

  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";
  .loading-wrapper{
    position:fixed;
    background:rgba(0,0,0,.3);
    z-index:3999;
    top:0;
    left:0;
    right:0;
    bottom:0;
    display:flex;
    align-items:center;
    justify-content: center;
  }
  .loader-inner{
    padding-bottom:pxToRem(80);
    p.word{
      color:#fff;
      position:absolute;
      top:pxToRem(250);
      width:pxToRem(300);
      transform:translateX(-50%);
      text-align: center;
      font-size:pxToRem(34);
    }
  }


  @-webkit-keyframes ball-scale-multiple {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
      opacity: 0; }
    5% {
      opacity: 1; }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0; } }

  @keyframes ball-scale-multiple {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
      opacity: 0; }
    5% {
      opacity: 1; }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0; } }

  .ball-scale-multiple {
    position: relative;
    -webkit-transform: translateY(pxToRem(-80));
    transform: translateY(pxToRem(-80)); }
  .ball-scale-multiple > div:nth-child(2) {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s; }
  .ball-scale-multiple > div:nth-child(3) {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s; }
  .ball-scale-multiple > div {
    background-color: #fff;
    width: pxToRem(50);
    height: pxToRem(50);
    border-radius: 100%;
    margin: 2px;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    position: absolute;
    left: pxToRem(-100);
    top: 0px;
    opacity: 0;
    margin: 0;
    width: pxToRem(200);
    height: pxToRem(200);
    -webkit-animation: ball-scale-multiple 1s 0s linear infinite;
    animation: ball-scale-multiple 1s 0s linear infinite; }
</style>
