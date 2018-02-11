webpackHotUpdate(0,{

/***/ 150:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(250);

__webpack_require__(252);

__webpack_require__(251);

__webpack_require__(253);

__webpack_require__(188);

__webpack_require__(254);

//
//
//
//
//
//
//
//

exports.default = {
    created: function created() {
        this.isWeixin();
    },

    methods: {
        isWeixin: function isWeixin() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                alert("微信浏览器");
            } else {
                alert("不是微信浏览器");
            }
        }
    }
};

//v2版本的icon文件引入   ----刘洋

/***/ })

})
//# sourceMappingURL=0.23c9aa3b2cc699634ebe.hot-update.js.map