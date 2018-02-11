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
//
//
//

exports.default = {
    created: function created() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.isWeixin = 1;
            this.words = '请长按识别二维码，关注公众号，方便再次访问哟！';
        } else {}

        if (sessionStorage.getItem('spreadToken')) this.$http.get(this.$store.state.host + '/front/template/findSchool/');
    },
    data: function data() {
        return {
            isWeixin: 0,
            words: '请保存此二维码，发送到微信中，并长按识别，方便再次访问哟！'
        };
    },

    methods: {}
};

//v2版本的icon文件引入   ----刘洋

/***/ })

})
//# sourceMappingURL=0.54206c5da70e0cd234c4.hot-update.js.map