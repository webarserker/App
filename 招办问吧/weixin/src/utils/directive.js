import Vue from 'vue'

// 自动获取焦点
Vue.directive('focus', {
  // 当绑定指令的
  inserted: function (el, {value}) {
    if (value) {
      el.focus();
    }
  }
})
