// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import router from './router'
import fastclick from 'fastclick'
import store from './store'



import 'common/css/index.less'

Vue.use(VueResource)

fastclick.attach(document.body)

Vue.config.productionTip = false

Vue.http.options.emulateJSON = true;

// localStorage.clear();
Date.prototype.myDateFormat = function() {
  var month=(this.getMonth()+1)<10?'0'+(this.getMonth()+1):(this.getMonth()+1);
  var date=this.getDate()<10?('0'+this.getDate()):this.getDate();
  var h=this.getHours()<10?('0'+this.getHours()):this.getHours();
  var m=this.getMinutes()<10?('0'+this.getMinutes()):this.getMinutes();
  var s=this.getSeconds()<10?('0'+this.getSeconds()):this.getSeconds();
  return this.getFullYear()+'-'+month+'-'+date+' '+h+':'+m+':'+s;
};

Date.prototype.myDateFormatOnlyDate = function() {
  var month=(this.getMonth()+1)<10?'0'+(this.getMonth()+1):(this.getMonth()+1);
  var date=this.getDate()<10?('0'+this.getDate()):this.getDate();
  return this.getFullYear()+'-'+month+'-'+date;
};

/* eslint-disable no-new */
new Vue({
  http: {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  },
  el: '#app',
  router,
  store,
  render: h => h(App)
})
