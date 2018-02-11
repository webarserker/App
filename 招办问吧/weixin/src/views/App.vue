<template>
  <div class="root h-p100 box box-ver">
    <div class="container h-p100 box box-ver">
        <router-view></router-view>
        <v-loading :isRequest="$store.state.isLoading"></v-loading>
    </div>
  </div>
</template>
<script type="text/javascript">
import '../font/common/style.css'
import '../css/common.scss'
import '../css/mint-ui.scss'
export default {
  name: 'app',
  components: {
    "v-loading": require('../components/loading.vue')
  },
  mounted () {
    var self = this
    self.updateNews()
    setInterval(()=>{
      self.updateNews()
    },1000*60)
  },
  methods: {
    updateNews () {
      var state = this.$store.state
      if (!state.isLogin) return
      this.$http.get(state.host + state.baseUrl + '/message/isNewMessage?userId=' + state.userId).then(res => {
          this.$store.commit('SET_HASNEWS', res.data.data.flag)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
