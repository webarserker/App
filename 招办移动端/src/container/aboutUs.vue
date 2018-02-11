<template>
    <div class="aboutUs">
      <Tab entryName="其他" tabLast="关于我们"></Tab>
      <div class="flag">
        <img :src="$store.state.schoolLogo" width="35%">
        <p>智能答疑管理系统-便捷版 V1.0</p>
        <h1>{{schoolName}}</h1>
      </div>
      <div class="info">
        一款为招办提供移动便捷答疑、移动智能审批的信息系统，它将随时随地的为招办实现快速答疑服务及工作审批服务。使用招办移动端既能快速地满足考生、家长的信息咨询需求，也能以最便捷的方式帮助招办提高审核管控工作效率。
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

  .aboutUs{
    position: fixed;
    z-index:500;
    top: .72rem;
    left: 0;
    right: 0;
    bottom: .46rem;
    background: #fff;
    padding:0 .1rem 0 .1rem;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .flag{
      text-align:center;
      padding-top:.4rem;
      p{
        margin-top:.15rem;
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
      margin-top:.25rem;
      line-height:1.5;
    }
  }
</style>
