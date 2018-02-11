webpackHotUpdate(0,{

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _piwik = __webpack_require__(9);

var _piwik2 = _interopRequireDefault(_piwik);

var _count = __webpack_require__(6);

var _count2 = _interopRequireDefault(_count);

var _urlParse = __webpack_require__(22);

var _urlParse2 = _interopRequireDefault(_urlParse);

var _urlAddToken = __webpack_require__(4);

var _urlAddToken2 = _interopRequireDefault(_urlAddToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

exports.default = {
    data: function data() {
        return {
            headTop: 0,
            threeCatNameToBread: sessionStorage.getItem('threeCatNameToBread') ? sessionStorage.getItem('threeCatNameToBread') : '',
            content: '',
            title: '',
            secondCatName: '',
            flag: false,
            specType: 0,
            h: 0,
            publishTime: '',
            viewTimes: ''
        };
    },

    computed: {
        catId: function catId() {
            return this.$route.query.catId;
        },
        infoId: function infoId() {
            return this.$route.query.infoId || null;
        },
        contentType: function contentType() {
            return this.$route.query.contentType;
        },
        majorId: function majorId() {
            return this.$route.query.tid || null;
        },
        initScrollWindow: function initScrollWindow() {
            //                return this.content || document.getElementsByClassName('comp').length
            return this.content || this.specType || this.title;
        }
    },
    components: {
        "v-header": __webpack_require__(14),
        "v-footer": __webpack_require__(72),
        "v-loadingImg": __webpack_require__(16),
        "v-comp-6": __webpack_require__(95),
        "v-comp-8": __webpack_require__(96),
        "v-comp-10": __webpack_require__(93),
        "v-comp-11": __webpack_require__(94),
        "v-comp-13": __webpack_require__(290),
        "v-comp-1": __webpack_require__(92),
        "v-menuball": __webpack_require__(15),
        "v-sdecode": __webpack_require__(17),
        "v-sdecode2": __webpack_require__(18),
        //            注册新加的组件
        "v-comp-14": __webpack_require__(291)
    },
    watch: {
        '$route': function $route(to, from) {
            var _this = this;
            setTimeout(function () {
                (0, _count2.default)(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, _this.infoId, _this.majorId, _this.$store.state.viewSourceUrl).then(function (res) {});
            }, 1000);
        },

        content: function content() {
            if (!this.content) return;
            this.content = this.content.replace(/[0-9]+px/g, function (val) {
                return parseInt(val) / 32 + 'rem';
            });
        }
    },
    methods: {
        gotop: function gotop() {
            this.$refs.content.scrollTop = 0;
        },
        scrollAction: function scrollAction(e) {
            this.flag = this.$refs.content.scrollTop > 50 ? true : false;

            var table_list = document.getElementsByClassName('table_list')[0];
            var thead = document.getElementsByClassName('t_head')[0];
            var tbody = document.getElementsByClassName('t_body')[0];
            var content = document.getElementsByClassName('content')[0];

            if (this.headTop == 0) {
                if (thead) {
                    this.headTop = thead.offsetTop;
                }
            }

            if (thead) {
                // if(this.$refs.content.scrollTop-this.h>10){
                //                    if (this.$refs.content.scrollTop - thead.offsetTop > -20 / 64 * parseInt(document.documentElement.style['font-size'])) {
                if (this.$refs.content.scrollTop > this.headTop) {
                    thead.style.position = 'fixed';
                    thead.style.top = '2.3rem';
                    thead.style.left = '0.53rem';
                    thead.style.right = '0.53rem';
                    tbody.style.marginTop = '0.93rem';
                    // thead.style['z-index'] = '9999999'
                    //                        if (thead.style.position == 'fixed') {
                    //                            // console.log(this.$refs.content.scrollTop - thead.offsetTop, content.offsetHeight + 3.4 * parseInt(document.documentElement.style.fontSize))
                    //                            if (this.$refs.content.scrollTop - this.headTop < content.offsetHeight + 3.4 * parseInt(document.documentElement.style.fontSize)) {
                    //                                thead.style.position = 'inherit'
                    //                                tbody.style.marginTop = '0'
                    //                            }
                    //                        }
                } else {
                    //                        thead.style.position = 'inherit'
                    thead.style.position = 'inherit';
                    tbody.style.marginTop = '0';
                    // thead.style.zIndex = '9999999'
                }
            }
        },
        goback: function goback() {

            alert('window.history.length:' + window.history.length);
            if (window.history.length > 1) {
                this.$router.go(-1);
            } else {
                var obj = (0, _urlParse2.default)();
                if (obj.contentType) {
                    this.$router.push('/normalQuestion?contentType=' + obj.contentType);
                } else if (obj.catId) {
                    this.$router.push('/articleList?catId=' + obj.catId);
                } else {
                    this.$router.push('/');
                }
            }
            // var contentType = this.contentType
            // if (contentType) {
            //     this.$router.push('/normalQuestion?contentType=' + contentType)
            // } else {
            //     this.$router.push('/search')
            //         // this.$store.commit('CHANGE_FOOTERTAB',contentType==2?1:3)
            // }
        }
    },
    mounted: function mounted() {
        var _this2 = this;

        var _this = this;
        setTimeout(function () {
            (0, _count2.default)(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, _this.infoId, _this.majorId, _this.$store.state.viewSourceUrl).then(function (res) {});
        }, 1000);

        // if(!this.$route.query.catId){
        //     this.specType = this.$route.query.specType
        //     if(this.specType == 8){
        //         this.secondCatName =  '招生计划'
        //         this.title = '招生计划'
        //     }
        //     if(this.specType == 10){
        //         this.secondCatName =  '专业录取情况'
        //         this.title = '详情'
        //     }
        //     // if(this.specType == 8){
        //     //     this.secondCatName =  '招生计划'
        //     //     this.title = '招生计划'
        //     // }
        //     // location.reload()
        //     return;
        // }
        // this.$store.commit('CHANGE_FOOTERTAB',this.contentType==2?1:3)
        var userId = '';
        localStorage.setItem(this.infoId, this.infoId);
        if (localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode || this.$store.state.isLogin) {
            userId = '&userId=' + JSON.parse(localStorage.user).id;
        } else {}
        var state = this.$store.state;
        this.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentDetail?infoId=' + this.infoId + userId + '&sCode=' + state.scode + '&parentId=' + this.catId).then(function (res) {
            var data = res.data.data;
            //                    this.content = data.content
            if (data.content) {
                _this2.content = data.content.replace(/<table.*?>.*?<\/table>/g, function (keyword) {
                    return '<div class="table-scroll-wrapper">' + keyword + '</div>';
                });
            }

            _this2.title = data.title;
            _this2.publishTime = data.publishTime;
            _this2.viewTimes = data.viewTimes;
            _this2.secondCatName = data.secondCatName;
            _this2.specType = data.specType;
            //                    document.title = data.title
            setTimeout(function () {
                _this2.$store.commit('CHANGE_LOADINGFLAG', false);
            }, 1000);

            //    组件更新的时候配置微信SDK接口        *************************************************************************
            var state = _this2.$store.state;
            var _this = _this2;

            var url = state.host + state.baseUrl + '/getJsSign';
            var data = {
                url: location.href.indexOf('from=') > -1 ? location.href.split('&from=')[0] : location.href.split('#')[0]
            };
            _this2.$http.post(url, data, {
                emulateJSON: true
            }).then(function (res) {
                // console.log(res.data)
                var data = res.data;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonce, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                //                            alert('state.allSchoolInfo.name:' + state.allSchoolInfo.name + ' ' + 'state.allSchoolInfo.professor:' + state.allSchoolInfo.professor + ' state.allSchoolInfo.schoolIcon:' + state.allSchoolInfo.schoolIcon)
                //                            alert('分享链接为：'+urlAddToken(window.location.href));

                wx.ready(function () {
                    wx.onMenuShareTimeline({
                        title: state.allSchoolInfo.name + '-' + '文章详情', // 分享标题
                        //link: state.currentHref, // 分享链接
                        //                            imgUrl: state.imgHost + iconUrl, // 分享图标
                        success: function success() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function cancel() {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: state.allSchoolInfo.name + '-' + '文章详情', // 分享标题
                        desc: '点击查看' + _this.title, // 分享描述
                        //                    desc:urlAddToken(window.location.href),
                        //                                link: state.currentHref, // 分享链接
                        link: (window.location.href.split('#')[0] + '&redirectUrl=' + encodeURIComponent((0, _urlAddToken2.default)(window.location.href))).replace('/build/index.html', '/weixin/index'),
                        imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
                        // type: 'music、video或link，不填默认为link', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function success() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function cancel() {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                });

                wx.error(function (err) {
                    // for (var i of Object.keys(err)) {
                    //     alert(i + ' : ' + err[i])
                    // }
                });
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
            _this2.$store.commit('CHANGE_LOADINGFLAG', false);
        });
    },
    created: function created() {
        var _this3 = this;

        this.$store.state.currentHref = location.href;
        var reg = new RegExp("(^|&)scode=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            localStorage.scode = unescape(r[2]);
            this.$store.commit('CHANGE_SCODE', unescape(r[2]));
        }
        this.$store.commit('CHANGE_LOADINGFLAG', true);
        // this.$store.commit('CHANGE_FOOTERTAB', -1)
        var state = this.$store.state;
        var userId = '';
        var login = '&login=' + false;
        localStorage.setItem(this.infoId, this.infoId);
        // if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
        if (localStorage.user || this.$store.state.isLogin) {
            userId = '&userId=' + JSON.parse(localStorage.user).id;
            login = '&login=' + true;
        }
        this.$http.get(state.host + state.baseUrl + '/index/getBaseInfo?sCode=' + state.scode + userId + login).then(function (res) {
            var data = res.data.data;
            _this3.$store.commit('CHANGE_MSGCOUNT', data.messageCount);
            _this3.$store.commit('CHANGE_SCHOLL', data.school);
            _this3.$store.commit('CHANGE_FOOTERMENU', data.footerMenu.length > 4 ? data.footerMenu.slice(0, 4) : data.footerMenu);
            _this3.$store.commit('CHANGE_THEMECOLOR', '#' + data.school.themeColor);
            // document.title = data.school.name
            setTimeout(function () {
                _this3.$store.commit('CHANGE_LOADINGFLAG', false);
            }, 1000);

            document.title = data.school.name + '-文章详情';
            // piwik.initPiwik(state.identify, state.sid)
            // this.$on('piwik', function(e) {
            //     // console.info(e);
            //     piwik.piwikReady(function() {
            //         var tracker = Piwik.getAsyncTracker();
            //         tracker.trackPageView(document.title); //参数可以加标题
            //     }.bind(e));
            // });
        }, function (err) {
            console.log(err);
        });
    },
    updated: function updated() {
        //            var u = navigator.userAgent;
        //            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (document.getElementsByClassName('content').length) {
            var imgs = document.getElementsByClassName('content')[0].getElementsByTagName('img');

            if (imgs.length) {
                for (var i = 0; i < imgs.length; i++) {
                    var width = imgs[i].getAttribute('width');
                    var height = imgs[i].getAttribute('height');
                    var bili = height / width;
                    var nowWidth = getComputedStyle(imgs[i]).width;
                    var nowHeight = parseFloat(nowWidth) * bili;
                    imgs[i].style.height = nowHeight + 'px';
                }
            }
        }

        //            if(!isiOS) {
        //                var iframes=document.getElementsByClassName('content')[0].getElementsByTagName('iframe');
        //                if(iframes != null) {
        //                    for(let i=0;i<iframes.length;i++){
        //                        iframes[i].style.maxWidth='100%';
        ////                        iframes[i].style.height='auto';
        //                    }
        //                }
        //            }


        var bigHeight = window.innerHeight;
        var mHeaderHeight = getComputedStyle(document.getElementById('m-header')).height;
        var breadHeight = getComputedStyle(this.$refs.bread).height;
        var bottomContentHeight = this.$refs.bottomContent ? getComputedStyle(this.$refs.bottomContent).height : 0;
        var minHeight = parseFloat(bigHeight) - parseFloat(mHeaderHeight) - parseFloat(breadHeight) - parseFloat(bottomContentHeight);
        if (this.$refs.articleBody) {
            this.$refs.articleBody.style.minHeight = minHeight + 'px';
        }
    }
};

/***/ })

})
//# sourceMappingURL=0.351ddb7a7c4c28cf7fba.hot-update.js.map