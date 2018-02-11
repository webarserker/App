<template>
  <div>
    <router-view></router-view>
    <MFooter></MFooter>
  </div>

</template>
<script>
  import MFooter from '../components/footer'
  import {wxShare} from '../common/js/mixin'

  export default{
    mixins:[wxShare],
    components: {MFooter}
  }

</script>
<style>

</style>
