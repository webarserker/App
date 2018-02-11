webpackHotUpdate(0,{

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(234);

exports.default = {
    data: function data() {
        return {
            user_items_flag: false,
            showFlag: false
        };
    },

    computed: {
        isLogin: function isLogin() {
            return this.$store.state.isLogin;
        },
        user: function user() {
            if (this.isLogin) {
                return true;
            } else if (localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        logOut: function logOut() {
            this.showFlag = false;
            this.user_items_flag = false;
            localStorage.removeItem('user');
            localStorage.removeItem('uid');
            this.$store.commit('CHANGE_ISLOGIN', 0);

            sessionStorage.setItem('isLogin', 0);

            this.$router.push('/');
        }
    },
    created: function created() {
        // var reg = new RegExp("(^|&)scode=([^&]*)(&|$)");
        // var r = window.location.search.substr(1).match(reg);
        // if(r!=null){
        //     localStorage.scode = unescape(r[2])
        //     this.$store.commit('CHANGE_SCODE', unescape(r[2]))
        // }
    },
    mounted: function mounted() {
        var _this = this;

        // if(!this.$store.state.scholl){
        //     var uid = localStorage.uid?'&uid='+localStorage.uid:''
        //     this.$router.push('/?scode='+localStorage.scode+uid)
        // }
        window.addEventListener('touchstart', function () {
            if (_this.user_items_flag) {
                setTimeout(function () {
                    _this.user_items_flag = false;
                }, 300);
            }
        });
    }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),

/***/ 328:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('header', {
    style: ({
      background: _vm.$store.state.themeColor
    }),
    attrs: {
      "id": "m-header"
    }
  }, [(_vm.$store.state.scholl) ? _c('img', {
    staticClass: "header_logo",
    attrs: {
      "src": _vm.$store.state.imgHost + _vm.$store.state.scholl.logoUrl
    },
    on: {
      "click": function($event) {
        _vm.$router.push('/')
      }
    }
  }) : _vm._e(), _vm._v(" "), (_vm.isLogin) ? _c('div', {
    staticClass: "header_setting_btn",
    on: {
      "click": function($event) {
        _vm.user_items_flag = !_vm.user_items_flag
      }
    }
  }, [(_vm.$store.messageCount) ? _c('span', {
    staticClass: "header_setting_point"
  }) : _vm._e()]) : _c('div', {
    staticClass: "comicon-11 l_p",
    on: {
      "click": function($event) {
        _vm.$router.push('/login')
      }
    }
  }), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.user_items_flag),
      expression: "user_items_flag"
    }],
    staticClass: "user_items"
  }, [_c('div', {
    staticClass: "user_item",
    style: ({
      background: _vm.$store.state.themeColor
    }),
    on: {
      "click": function($event) {
        _vm.user_items_flag = false;
        _vm.$router.push('/updateUser')
      }
    }
  }, [_c('i', {
    staticClass: "iconfont comicon-11"
  }), _vm._v(" "), _c('span', [_vm._v("我的资料")])]), _vm._v(" "), _c('div', {
    staticClass: "user_item",
    style: ({
      background: _vm.$store.state.themeColor
    }),
    on: {
      "click": function($event) {
        _vm.user_items_flag = false;
        _vm.$router.push('/msgNotice')
      }
    }
  }, [_c('i', {
    staticClass: "iconfont comicon-19"
  }), _vm._v(" "), _c('span', [_vm._v("招办回复")]), _vm._v(" "), (_vm.$store.messageCount) ? _c('s') : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "user_item",
    style: ({
      background: _vm.$store.state.themeColor
    }),
    on: {
      "click": function($event) {
        _vm.showFlag = true
      }
    }
  }, [_c('i', {
    staticClass: "iconfont comicon-14"
  }), _vm._v(" "), _c('span', [_vm._v("退出登录")])]), _vm._v(" "), _c('b', {
    staticClass: "triangle_up",
    style: ({
      'border-bottom': '0.13333rem solid ' + _vm.$store.state.themeColor
    })
  })]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showFlag),
      expression: "showFlag"
    }],
    staticClass: "flag"
  }, [_c('div', {
    staticClass: "flag-content"
  }, [_c('div', {
    staticClass: "message"
  }, [_vm._v("\n                是否退出登录？\n            ")]), _vm._v(" "), _c('div', {
    staticClass: "confirm"
  }, [_c('p', {
    staticClass: "cancle",
    style: ({
      color: _vm.$store.state.themeColor
    }),
    on: {
      "click": function($event) {
        _vm.showFlag = false
      }
    }
  }, [_vm._v("取消")]), _vm._v(" "), _c('p', {
    staticClass: "out",
    style: ({
      color: _vm.$store.state.themeColor
    }),
    on: {
      "click": _vm.logOut
    }
  }, [_vm._v("退出")])])])])])
},staticRenderFns: []}

/***/ })

})
//# sourceMappingURL=0.8a0ce2c0ac1785026b73.hot-update.js.map