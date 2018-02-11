<template>
  <div class="header" id="mheader">
    <i class="icon-zuojiantou" v-show="canBack" @click="$router.back()"></i>
    <i class="icon-search" @click="$router.push('/searchPage')"></i>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props:{
      canBack:{
        type:Boolean,
        default:true
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";
  .header{
    height:pxToRem(88);
    background:$themeColor;
    color:#fff;
    line-height:pxToRem(88);
    position:fixed;
    left: 0;
    top:0;
    width:100%;
    text-align: center;
    z-index:601;
    h1{
      font-size:pxToRem(32);
      color:#fff;
    }
    span{
      line-height:pxToRem(88);
      font-size:pxToRem(32);
    }
    img.logo{
      height:pxToRem(70);
      position:absolute;
      left:50%;
      transform:translateX(-50%);
      top:pxToRem(11);
    }
    i.icon-zuojiantou{
      float:left;
      line-height:pxToRem(88);
      margin-left:pxToRem(40);
      @include  extend-click();
      font-size:pxToRem(40);
    }
    i.icon-search{
      font-size:pxToRem(40);
      color:#fff;
      float:right;
      line-height:pxToRem(88);
      margin-right:pxToRem(40);
      @include extend-click();
    }
  }
</style>
