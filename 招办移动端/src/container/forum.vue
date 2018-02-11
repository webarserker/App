<template>
    <div class="forum">
      <Tab entryName="其他" tabLast="招办论坛"></Tab>
      <div class="main">
        <i class="icon-kaifa"></i>
        <p>工程师正在加紧开发，敬请期待...</p>
      </div>
    </div>

</template>
<script>
  import Tab from '../components/tab.vue'
  import {wxShare} from '../common/js/mixin'

  export default{
    mixins:[wxShare],
    components: {Tab}
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/variable";

  .forum {
    position: fixed;
    z-index: 500;
    top: .72rem;
    left: 0;
    right: 0;
    bottom: .46rem;
    background: #fff;
    padding: 0 .1rem 0 .1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .main {
      text-align: center;
      i {
        color: @theme;
        font-size: .7rem;
      }
      p {
        margin-top: .36rem;
        font-size: .14rem;
      }
    }
  }
</style>
