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

        if (!sessionStorage.getItem('spreadToken')) {
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

        var user = localStorage.user;
        if (user) {
            _this.$http.get(_this.$store.state.host + '/weixin/api/user/getUserIsSub?id=' + JSON.parse(user).id).then(function (res) {
                res = res.body;
                console.log(res);
                if (res.data) {
                    _this.showPropaganda = 0;
                    clearInterval(_this.showPropagandaTimer);
                    _this.showPropagandaTimer = null;
                }
            });
        }
        this.checkIdTimer = setInterval(function () {

            var user = localStorage.user;
            if (user) {
                _this.$http.get(_this.$store.state.host + '/weixin/api/user/getUserIsSub?id=' + JSON.parse(user).id).then(function (res) {
                    res = res.body;
                    if (res.data) {
                        _this.showPropaganda = 0;
                        clearInterval(_this.showPropagandaTimer);
                        _this.showPropagandaTimer = null;
                    }
                });
            }
        }, 1000);
    },
    data: function data() {
        return {
            showPropaganda: 1,
            isWeixin: 0,
            words: '请保存此二维码，发送到微信中，并长按识别，方便再次访问哟！',
            imgSrc: '',
            checkIdTimer: null,
            showPropagandaTimer: null
        };
    },

    methods: {
        close: function close() {
            var _this = this;
            _this.showPropaganda = 0;
        }
    }
};

//v2版本的icon文件引入   ----刘洋

/***/ })

})
//# sourceMappingURL=0.b4023c146e731c400927.hot-update.js.map