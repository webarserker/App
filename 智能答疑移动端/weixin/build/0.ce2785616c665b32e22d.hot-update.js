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
//
//
//

exports.default = {
    created: function created() {
        var _this2 = this;

        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.isWeixin = 1;
            this.words = '请长按识别二维码，关注公众号，方便再次访问哟！';
        } else {}

        if (sessionStorage.getItem('spreadToken')) {
            this.$http.get(this.$store.state.host + '/front/template/findSchool/' + localStorage.scode).then(function (res) {
                res = res.body;
                console.log(res);
                _this2.imgSrc = _this2.$store.state.imgHost + '/imgServer/qrcode/' + res.identify + '.jpg';
            });
        } else {
            this.$http.get(this.$store.state.host + '/front/template/wxqrcodeBySpreadUser?spreadToken=' + sessionStorage.spreadToken + '&sCode=' + localStorage.scode).then(function (res) {
                res = res.body;
                console.log(res);
                _this2.imgSrc = res.data;
            });
        }

        //            一下是弹窗的逻辑
        var _this = this;
        this.checkIdTimer = setInterval(function () {

            var user = localStorage.user;
            if (user) {} else {

                //                    clearInterval(_this.showPropagandaTimer);
                //                    _this.showPropagandaTimer=null;
                //                    alert(_this.showPropagandaTimer);
                //                    _this.showPropagandaTimer=setTimeout(function(){
                //                        alert(1);
                //                        _this.showPropaganda=1;
                //                    },3000);
            }
        }, 1000);
    },
    data: function data() {
        return {
            showPropaganda: 0,
            isWeixin: 0,
            words: '请保存此二维码，发送到微信中，并长按识别，方便再次访问哟！',
            imgSrc: '',
            checkIdTimer: null,
            showPropagandaTimer: null
        };
    },

    methods: {}
};

//v2版本的icon文件引入   ----刘洋

/***/ })

})
//# sourceMappingURL=0.ce2785616c665b32e22d.hot-update.js.map