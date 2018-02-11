<template>
  <div class="box box-ver h-p100">
    <v-header></v-header>
    <!--页面切换动画版-->
    <!--<transition :name="transitionName">
      <router-view class="child-router"></router-view>
    </transition>-->
    <!--页面切换无动画版-->
    <!--<keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>-->
    <router-view></router-view>
  </div>
    
</template>
<script>
export default {
  components: {
    'v-header': require('../components/header.vue')
  },
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  beforeRouteUpdate (to, from, next) {
    // let isBack = this.$router.isBack
    // if (isBack) {
    //   this.transitionName = 'slide-right'
    // } else {
    //   this.transitionName = 'slide-left'
    // }
    // this.$router.isBack = false
    next()
  },
  mounted () {
    this.onMounted()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'onMounted',
  },
  methods: {
    onMounted() {
      var uid = this.$route.query.uid
      var userId = this.$store.state.userId
      if (userId) {
        if (uid) {
          this.$router.replace('/')
          return
        }
        this.getUserInfo(userId)
      }
      if (uid) {
        this.$store.commit('SET_USERID',uid)
        this.$router.replace('/')
        return
      }
      
    },
    getUserInfo(id) {
      let state = this.$store.state
      let url = state.host + state.baseUrl + '/user/getUserInfoById?userId=' + id
      console.log(url)
      this.$http.get(url).then((res) => {
        let data = res.data
        if (res.data.data) {
          this.$store.commit('SET_USERID', data.data.id)
          this.$store.commit('SET_USERNAME', data.data.nickName)
          this.$store.commit('SET_ISLOGIN', true)
          this.$store.commit('SET_USERINFO', data.data)
        } 
      })
    },
  }
}
</script>
<style lang="scss" scoped>
    @import '../css/color.scss';
    @import '../css/mixins.scss';
</style>

