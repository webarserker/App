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
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.isWeixin = 1;
        } else {}
    },
    data: function data() {
        return {
            isWeixin: 0
        };
    },

    methods: {}
};

//v2版本的icon文件引入   ----刘洋

/***/ })

})
//# sourceMappingURL=0.b34149f6f4f4ffc714cb.hot-update.js.map