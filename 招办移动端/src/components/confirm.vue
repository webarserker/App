<template>
  <div class="wrap">
    <div class="confirm">
      <div class="text">{{text}}</div>
      <ul>
        <li @click="$emit('cancel')">取消</li>
        <li @click="$emit('sure')">确定</li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default{
    props: {
      'text': {
        type: String,
        default: ''
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/mixin";
  @import "../common/css/variable";

  .wrap {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, .3);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    .confirm {
      width: 2.6rem;
      height: 1.1rem;
      border-radius: .09rem;
      background: #fff;
      .text {
        height: .7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        font-size: .16rem;
        .border-1px(#ddd);
      }
      ul{
        display:flex;
        align-items:center;
        height:.4rem;
        li{
          flex:1;
          font-size:.16rem;
          color:@theme;
          display:flex;
          align-items:center;
          justify-content: center;
          height:100%;
          &:first-child{
            border-right:1px solid #ddd;
          }
        }
      }
    }
  }
</style>
