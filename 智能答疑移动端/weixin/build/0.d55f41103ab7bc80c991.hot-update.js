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
    beforeCreated: function beforeCreated() {
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
//# sourceMappingURL=0.d55f41103ab7bc80c991.hot-update.js.map