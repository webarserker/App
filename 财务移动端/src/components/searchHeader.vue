<template>
  <div class="searchHeader">
    <i class="icon-zuojiantou" @click="backOrToggle"></i>
    <span>搜索</span>
  </div>
</template>
<script>
  export default {
    props:{
      'showResult':{
        type:Boolean,
        default:false
      }
    },
    methods:{
      backOrToggle(){
        if(!this.showResult){
          this.$router.back();
        }else{
          this.$emit('toggle')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";
  .searchHeader{
    height:pxToRem(88);
    background-color:$themeColor;
    color:#fff;
    text-align:center;
    font-size:pxToRem(36);
    line-height:pxToRem(88);
    position:relative;
    span{
      position:absolute;
      left:50%;
      transform:translateX(-50%);
    }
    i{
      float:left;
      margin-left:pxToRem(40);
      @include  extend-click();
      font-size:pxToRem(40);
      line-height:pxToRem(88);
    }
  }
</style>
