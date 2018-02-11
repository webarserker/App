import Vue from 'vue'
// import VueResource from 'vue-resource'
import App from './views/App.vue'
import router from './router'
import store from './vuex/store'
import './utils/filter'
import './utils/directive'
import 'mint-ui/lib/style.css'
import './css/animate.scss'
import {remChange, setDPR} from './utils/remChange'
import ajax from './utils/ajax'
// setDPR()
remChange()
Vue.prototype.$getRealImg = function(url, localHost) {
  if(!url) return ''
  return  url.substring(0,4).toLowerCase()==='http' ? url : localHost+url
}
Vue.use(ajax)
router.beforeEach(function (to, from, next) {
  store.state.isLoading = true
  setTimeout(() => {
    document.title = to.meta.pageTitle ? to.meta.pageTitle : '招办问答'
    next()
  },300*Math.random()+200)
  
})
router.afterEach(function (to) {
  store.state.isLoading = false
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

