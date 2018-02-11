<template>
  <div class="about">
    <i class="icon-right" @click="$router.back();"></i>
    <div>
      <div class="flag">
        <img src="../common/image/logo@2x.png" width="80%" style="align:center">
        <p>智能答疑管理系统-便捷版 V1.0</p>
      </div>
      <div class="info">
        一款为招办提供移动便捷答疑、移动智能审批的信息系统，它将随时随地的为招办实现快速答疑服务及工作审批服务。使用招办移动端既能快速地满足考生、家长的信息咨询需求，也能以最便捷的方式帮助招办提高审核管控工作效率。
      </div>
    </div>

  </div>

</template>
<script>
  import Tab from '../components/tab.vue'
  import {wxShare} from '../common/js/mixin'
  export default{
    mixins:[wxShare],
    components:{Tab},
    data(){
      return{
        schoolName:localStorage.zb_schoolName
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/variable";

  .about{
    position: fixed;
    z-index:500;
    top: 0;
    left: 0;
    right: 0;
    bottom: .4rem;
    background: #fff;
    padding:0 .1rem 0 .1rem;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    display:flex;
    align-items:center;
    .icon-right{
      transform:rotate(180deg);
      font-size:22px;
      position:absolute;
      left:.12rem;
      top:.2rem;
      color:@theme;
    }
    .flag{
      text-align:center;
      p{
        margin-top:.2rem;
        font-size:.16rem;
        color:#666;
      }
      h1{
        font-size:.16rem;
        color:#666;
        margin-top:.05rem;
      }
    }
    .info{
      text-indent:2em;
      font-size:.13rem;
      color:#999;
      margin-top:.4rem;
      line-height:1.5;
    }
  }
</style>

