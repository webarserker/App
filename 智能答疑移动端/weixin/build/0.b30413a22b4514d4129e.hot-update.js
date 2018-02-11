webpackHotUpdate(0,{

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(252);

__webpack_require__(254);

__webpack_require__(253);

__webpack_require__(255);

__webpack_require__(189);

__webpack_require__(256);

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
                _this2.imgSrc = _this2.$store.state.imgHost + '/imgServer/qrcode/' + res.identify + '.jpg';
            });
        } else {
            this.$http.get(this.$store.state.host + '/front/template/wxqrcodeBySpreadUser?spreadToken=' + sessionStorage.spreadToken + '&sCode=' + localStorage.scode).then(function (res) {
                res = res.body;
                _this2.imgSrc = res.data;
            });
        }

        //            一下是弹窗的逻辑
        var _this = this;
        var i = window.location.href.indexOf('scode=');
        if (i == -1) {
            _this.showPropaganda = 0;
            clearInterval(_this.showPropagandaTimer);
            _this.showPropagandaTimer = null;
        } else {
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
            //                this.checkIdTimer=setInterval(function(){
            //
            //                    var user=localStorage.user;
            //                    if(user){
            //                        _this.$http.get(_this.$store.state.host+'/weixin/api/user/getUserIsSub?id='+JSON.parse(user).id).then(res=>{
            //                            res=res.body;
            //                            if(res.data){
            //                                _this.showPropaganda = 0;
            //                                clearInterval(_this.showPropagandaTimer);
            //                                _this.showPropagandaTimer=null;
            //                            }
            //                        })
            //                    }
            //                },5000)
        }
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

    computed: {
        isLogin: function isLogin() {
            return this.$store.state.isLogin;
        }
    },
    watch: {
        isLogin: function isLogin() {
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
        }
    },
    methods: {
        close: function close() {
            var _this = this;
            _this.showPropaganda = 0;
            var user = localStorage.user;
            if (!user) {
                _this.showPropagandaTimer = setTimeout(function () {
                    _this.showPropaganda = 1;
                }, 60000);
            } else {
                _this.$http.get(_this.$store.state.host + '/weixin/api/user/getUserIsSub?id=' + JSON.parse(user).id).then(function (res) {
                    res = res.body;
                    if (!res.data) {
                        _this.showPropagandaTimer = setTimeout(function () {
                            _this.showPropaganda = 1;
                        }, 60000);
                    }
                });
            }
        }
    }
};

//v2版本的icon文件引入   ----刘洋

/***/ })

})
//# sourceMappingURL=0.b30413a22b4514d4129e.hot-update.js.map