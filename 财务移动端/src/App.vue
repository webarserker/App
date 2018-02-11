<template>
  <div class="app">
    <Loading v-show="showLoading"></Loading>
    <router-view></router-view>
  </div>
</template>

<script>
  import './common/css/style.css'
  import Loading from './components/loading.vue'
  import mHeader from './components/header.vue'
  import mFooter from './components/footer.vue'
  import Dropped from './components/dropped.vue'
  import axios from 'axios'

  export default {
    components: {Loading, mHeader, mFooter, Dropped},
    computed: {
      showLoading() {
        return this.$store.state.showLoading;
      },
      showDropped() {
        return this.$store.state.showDropped;
      }
    },
    data() {
      return {
        timer: null
      }
    },
    watch: {
      '$route'(to, from) {
        var _this = this;


        axios.get(this.$store.state.host+'/front/navigator' + '?userId=' + localStorage.fuserid).then(res=>{

        }).catch(()=>{
          clearTimeout(_this.timer);
          _this.timer = null;
          _this.timer = setTimeout(() => {
            _this.$store.commit('SET_LOADING_STATU', false);
          }, 3000)
        })

      }
    },
    created() {
      var _this = this;

      axios.get(this.$store.state.host+'/front/navigator' + '?userId=' + localStorage.fuserid).then(res=>{

      }).catch(()=>{
        clearTimeout(_this.timer);
        _this.timer = null;
        _this.timer = setTimeout(() => {
          _this.$store.commit('SET_LOADING_STATU', false);
        }, 3000)
      })


//      window.addEventListener("offline", function (e) {
//        clearTimeout(_this.timer);
//        _this.timer = null;
//        _this.timer = setTimeout(() => {
//          _this.$store.commit('SET_LOADING_STATU', false);
//        }, 3000)

//      })
//      window.addEventListener("online", function(e) {
//        _this.$store.commit('SET_DROPPED',false);
//        _this.$store.commit('SET_LOADING_STATU',false);
//      })
    }
  }
</script>
<style lang="scss" scoped>

</style>
