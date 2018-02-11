<template>
  <div class="wrap">
    <div class="send-back">
      <div class="my-words">
        <h1>请输入驳回的理由：</h1>
        <textarea autofocus v-model="val"></textarea>
      </div>
      <ul>
        <li @click="$emit('cancel')">取消</li>
        <li @click="$emit('sure',val)">确定</li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default{
      data(){
          return{
              val:''
          }
      }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/mixin";
  @import "../common/css/variable";
  .wrap{
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
    .send-back{
      width:2.6rem;
      height:2.1rem;
      background:#fcfcfc;
      border-radius:.09rem;
      .my-words{
        padding:.08rem;
        padding-top:0;
        height:1.7rem;
        h1{
          height:.4rem;
          font-size:.16rem;
          color:#333;
          line-height:.4rem;
        }
        textarea{
          resize:none;
          outline:none;
          border:1px solid #ddd;
          height:1.2rem;
          width:100%;
          padding:8px;
          box-sizing:border-box;
          background:#fff;
          font-size:.16rem;
        }
      }
      ul{
        display:flex;
        align-items:center;
        height:.4rem;
        border-top:1px solid #ddd;
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
