<template>
    <div class="home">
      <router-view></router-view>
    </div>

</template>
<script>
  import {wxShare} from '../common/js/mixin'

  export default{
    mixins:[wxShare]
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>

  .home {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
  }
</style>
