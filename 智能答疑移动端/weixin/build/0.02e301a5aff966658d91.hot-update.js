webpackHotUpdate(0,{

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
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

__webpack_require__(234);

var _jquery = __webpack_require__(81);

var _jquery2 = _interopRequireDefault(_jquery);

var _vuex = __webpack_require__(5);

var _piwik = __webpack_require__(9);

var _piwik2 = _interopRequireDefault(_piwik);

var _count = __webpack_require__(6);

var _count2 = _interopRequireDefault(_count);

var _urlAddToken = __webpack_require__(4);

var _urlAddToken2 = _interopRequireDefault(_urlAddToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    beforeRouteEnter: function beforeRouteEnter(to, from, next) {
        next(function (vm) {
            if (from.path.indexOf('articleDetail') > -1) {
                vm.tapIndex = sessionStorage.getItem('tapIndex') ? sessionStorage.getItem('tapIndex') : 0;
                vm.mySubConData2 = sessionStorage.getItem('subConData2') ? JSON.parse(sessionStorage.getItem('subConData2')) : [];
                //                    alert(vm.tapIndex);
            } else {

                vm.tapIndex = 0;
                vm.mySubConData2 = [];
            }
        });
    },
    data: function data() {
        return {
            mySubConData2: [],
            tapIndex: 0,
            second_navs_swiper: null,
            activeIndex: 0,
            curPage: 1,
            endFlag: false,
            ajaxFlag: false,
            firstTap: true,
            articleListCatId: '',
            canFindCatId: 1
        };
    },

    computed: {
        secondNavData: function secondNavData() {
            return this.$store.state.secondNavData;
        },
        catId: function catId() {
            return this.$route.query.catId;
        }
    },
    components: {
        "v-subNav": __webpack_require__(290)
    },
    methods: _extends({
        scrollAction: function scrollAction(e) {
            var second_navs_prev = this.$refs.second_navs_prev;
            var second_navs_next = this.$refs.second_navs_next;
            if (e.target.scrollLeft > 0) {
                second_navs_prev.style.display = "block";
            } else {
                second_navs_prev.style.display = "none";
            }
            if (e.target.scrollLeft + e.target.offsetWidth < e.target.scrollWidth - 10) {
                second_navs_next.style.display = "block";
            } else {
                second_navs_next.style.display = "none";
            }
        }
    }, (0, _vuex.mapActions)(['CHANGE_SUBNAVDATA', 'CHANGE_SUBCONDATA', 'CHANGE_SECONDNAVDATA']), {
        tapAction: function tapAction(idx, cid) {
            sessionStorage.setItem('tapIndex', 0);
            //                sessionStorage.setItem('subConData2', JSON.stringify({}));
            this.$router.push('/articleList?catId=' + cid);
        },
        getScrollList: function getScrollList() {
            var _this2 = this;

            if (this.ajaxFlag || this.endFlag) return;
            this.ajaxFlag = true;
            var idx = this.activeIndex;
            var articleListCatId = '';
            if (this.secondNavData[idx].children.length > 0) {
                articleListCatId = this.secondNavData[idx].children[0].catId;
            } else {
                articleListCatId = this.secondNavData[idx].catId;
            }
            var state = this.$store.state;
            this.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentlist?curPage=' + this.curPage + '&pageSize=20&catId=' + articleListCatId).then(function (res) {
                var data = res.data.data;
                _this2.ajaxFlag = false;
                if (!data || data.length == 0) {
                    _this2.endFlag = true;
                } else {
                    _this2.CHANGE_SUBCONDATA(state.subConData.concat(res.data.data));
                }
            }, function (err) {
                alert('getScrollList()请求失败:' + err);
            });
        },
        getInit: function getInit() {
            var _this3 = this;

            var state = this.$store.state;
            this.$http.get(state.host + state.baseUrl + '/infoCat/getInfoCatlist?sCode=' + state.scode + '&catId=' + this.catId).then(function (res) {
                _this3.$store.commit('CHANGE_LOADINGFLAG', false);
                var secondCatId = res.data.data.secondCatId;
                _this3.CHANGE_SECONDNAVDATA(res.data.data.menu);
                for (var i = 0; i < _this3.secondNavData.length; i++) {
                    if (secondCatId == _this3.secondNavData[i].catId) {
                        _this3.activeIndex = i;
                        break;
                    }
                }
                i = i >= _this3.secondNavData.length ? 0 : i;
                _this3.endFlag = false;
                _this3.curPage = 1;
                var articleListCatId = '';
                var data = res.data.data.menu;
                if (data[i].children.length > 0) {
                    articleListCatId = data[i].children[0].catId;
                } else {
                    articleListCatId = data[i].catId;
                }
                _this3.articleListCatId = articleListCatId;
                _this3.CHANGE_SUBNAVDATA(data[i].children);
                if (_this3.$children[0].$refs.sub_navs_swiper_wrap) {
                    _this3.$children[0].$refs.sub_navs_swiper_wrap.scrollLeft = 0;
                    _this3.$children[0].tapIndex = 0;
                    var state = _this3.$store.state;
                    _this3.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentlist?curPage=' + _this3.curPage + '&pageSize=20&catId=' + articleListCatId).then(function (res) {
                        console.log(res.data);
                        _this3.CHANGE_SUBCONDATA(res.data.data);
                        //                                    sessionStorage.setItem('subConData2', JSON.stringify(res.data.data));
                        //                                    var left = $('.second_navs .active').offset().left
                        //                                    this.$refs.second_navs_swiper.scrollLeft = left


                        //横向类名菜单定位优化

                        var totalWidth = 0;
                        var currentWidth = 0;
                        var allSlides = document.getElementsByClassName('swiper-slide');
                        var length = allSlides.length;
                        for (var r = 0; r < length; r++) {
                            if (r == _this3.activeIndex) {
                                currentWidth = parseFloat(getComputedStyle(allSlides[r]).width);
                                break;
                            } else {
                                var w = getComputedStyle(allSlides[r]).width;
                                totalWidth += parseFloat(w);
                            }
                        }
                        var _this = _this3;
                        var distance = parseFloat(getComputedStyle(_this.$refs.second_navs_swiper).width) / 2 - currentWidth / 2;

                        (0, _jquery2.default)('.second_navs_swiper').animate({ scrollLeft: totalWidth - distance }, 300);
                    }, function (err) {
                        console.log(err);
                    });

                    //    组件更新的时候配置微信SDK接口        *************************************************************************
                    var state = _this3.$store.state;
                    var _this = _this3;

                    //                            var url = state.host + state.baseUrl + '/getJsSign'
                    //                            var data = {
                    //                                url:location.href.indexOf('from=')>-1?location.href.split('&from=')[0]:location.href.split('#')[0]
                    //                            }
                    //                            this.$http.post(url, data, {
                    //                                emulateJSON: true
                    //                            })
                    //                                .then(res => {
                    //                                    var data = res.data
                    //                                    wx.config({
                    //                                        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    //                                        appId: data.appId, // 必填，公众号的唯一标识
                    //                                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                    //                                        nonceStr: data.nonce, // 必填，生成签名的随机串
                    //                                        signature: data.signature, // 必填，签名，见附录1
                    //                                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    //                                    });
                    //
                    //
                    ////                                    alert('state.allSchoolInfo.name:' + state.allSchoolInfo.name + ' ' + 'state.allSchoolInfo.professor:' + state.allSchoolInfo.professor + ' state.allSchoolInfo.schoolIcon:' + state.allSchoolInfo.schoolIcon)
                    ////                                    alert('sessionStorage中的spreadToken为：' + sessionStorage.spreadToken);
                    ////
                    ////                                    alert('分享链接为：' + urlAddToken(window.location.href));
                    //
                    //
                    //                                    wx.ready(function () {
                    //                                        wx.onMenuShareTimeline({
                    //                                            title: state.allSchoolInfo.name + '-' + state.secondNavData[_this.activeIndex].name, // 分享标题
                    //                                            //link: state.currentHref, // 分享链接
                    //                                            imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
                    //                                            success: function () {
                    //                                                // 用户确认分享后执行的回调函数
                    //                                            },
                    //                                            cancel: function () {
                    //                                                // 用户取消分享后执行的回调函数
                    //                                            }
                    //                                        });
                    //
                    //                                        wx.onMenuShareAppMessage({
                    //                                            title: state.allSchoolInfo.name + '-' + state.secondNavData[_this.activeIndex].name, // 分享标题
                    //                                            desc: '点击查看' + state.secondNavData[_this.activeIndex].name, // 分享描述
                    ////                                    desc:urlAddToken(window.location.href),
                    ////                                link: state.currentHref, // 分享链接
                    //                                            link: (window.location.href.split('#')[0]+'&redirectUrl='+encodeURIComponent(urlAddToken(window.location.href))).replace('/build/index.html','/weixin/index'),
                    //                                            imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
                    //                                            // type: 'music、video或link，不填默认为link', // 分享类型,music、video或link，不填默认为link
                    //                                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    //                                            success: function () {
                    //                                                // 用户确认分享后执行的回调函数
                    //                                            },
                    //                                            cancel: function () {
                    //                                                // 用户取消分享后执行的回调函数
                    //                                            }
                    //                                        });
                    //
                    //                                    })
                    //
                    //                                    wx.error(function (err) {
                    //                                        // for (var i of Object.keys(err)) {
                    //                                        //     alert(i + ' : ' + err[i])
                    //                                        // }
                    //                                    })
                    //                                }, err => {
                    //                                    console.log(err)
                    //                                })

                }

                var _this = _this3;
                setTimeout(function () {
                    (0, _count2.default)(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, null, null, _this.$store.state.viewSourceUrl).then(function (res) {});
                }, 1000);

                //                        setTimeout(() => {
                //                            this.$store.commit('CHANGE_LOADINGFLAG', false)
                //                            var second_navs_swiper = this.$refs.second_navs_swiper
                //                            var second_navs_next = this.$refs.second_navs_next
                //                            if (second_navs_swiper.scrollWidth > second_navs_swiper.offsetWidth + 10) {
                //                                second_navs_next.style.display = 'block'
                //                            } else {
                //                                second_navs_next.style.display = 'none'
                //                            }
                //                            var left = $('.second_navs .active').offset().left
                //                            this.$refs.second_navs_swiper.scrollLeft = left
                //                        }, 1)
            }, function (err) {
                _this3.$store.commit('CHANGE_LOADINGFLAG', false);
            });
            this.activeIndex = 0;
        }
    }),
    watch: {
        '$route': function $route(to, from) {

            this.tapIndex = 0;
            this.mySubConData2 = [];

            var _this = this;
            setTimeout(function () {
                (0, _count2.default)(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, null, null, _this.$store.state.viewSourceUrl).then(function (res) {});
            }, 1000);
        },

        secondNavData: function secondNavData(v) {},
        curPage: function curPage(newV, oldV) {
            if (this.curPage == 1) return;
            this.getScrollList();
        },
        catId: function catId() {
            var _this4 = this;

            //                this.getInit()
            var num = 0;

            var state = this.$store.state;
            this.$http.get(state.host + state.baseUrl + '/infoCat/getInfoCatlist?sCode=' + state.scode + '&catId=' + this.catId).then(function (res) {
                _this4.$store.commit('CHANGE_LOADINGFLAG', false);
                var secondCatId = res.data.data.secondCatId;
                _this4.CHANGE_SECONDNAVDATA(res.data.data.menu);
                for (var i = 0; i < _this4.secondNavData.length; i++) {
                    if (secondCatId == _this4.secondNavData[i].catId) {
                        num++;
                        _this4.activeIndex = i;
                        break;
                    }
                }
                if (num == 0) {
                    _this4.canFindCatId = 0;
                } else {
                    _this4.canFindCatId = 1;
                }
                i = i >= _this4.secondNavData.length ? 0 : i;
                _this4.endFlag = false;
                _this4.curPage = 1;
                var articleListCatId = '';
                var data = res.data.data.menu;
                if (data[i].children.length > 0) {
                    articleListCatId = data[i].children[0].catId;
                } else {
                    articleListCatId = data[i].catId;
                }
                _this4.articleListCatId = articleListCatId;

                sessionStorage.setItem('threeCatName', data[i].children.length > 0 ? data[i].children[0].name : '');

                _this4.CHANGE_SUBNAVDATA(data[i].children);
                if (_this4.$children[0].$refs.sub_navs_swiper_wrap) {
                    _this4.$children[0].$refs.sub_navs_swiper_wrap.scrollLeft = 0;
                    _this4.$children[0].tapIndex = 0;
                    var state = _this4.$store.state;
                    _this4.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentlist?curPage=' + _this4.curPage + '&pageSize=20&catId=' + articleListCatId).then(function (res) {
                        _this4.CHANGE_SUBCONDATA(res.data.data);
                        sessionStorage.setItem('subConData2', JSON.stringify(res.data.data));
                        //                                    var left = $('.second_navs .active').offset().left
                        //                                    this.$refs.second_navs_swiper.scrollLeft = left


                        //横向类名菜单定位优化

                        var totalWidth = 0;
                        var currentWidth = 0;
                        var allSlides = document.getElementsByClassName('swiper-slide');
                        var length = allSlides.length;
                        for (var r = 0; r < length; r++) {
                            if (r == _this4.activeIndex) {
                                currentWidth = parseFloat(getComputedStyle(allSlides[r]).width);
                                break;
                            } else {
                                var w = getComputedStyle(allSlides[r]).width;
                                totalWidth += parseFloat(w);
                            }
                        }
                        var _this = _this4;
                        var distance = parseFloat(getComputedStyle(_this.$refs.second_navs_swiper).width) / 2 - currentWidth / 2;

                        (0, _jquery2.default)('.second_navs_swiper').animate({ scrollLeft: totalWidth - distance }, 300);
                    }, function (err) {
                        console.log(err);
                    });

                    //    组件更新的时候配置微信SDK接口        *************************************************************************
                    var state = _this4.$store.state;
                    var _this = _this4;

                    var url = state.host + state.baseUrl + '/getJsSign';
                    var data = {
                        url: location.href.indexOf('from=') > -1 ? location.href.split('&from=')[0] : location.href.split('#')[0]
                    };
                    _this4.$http.post(url, data, {
                        emulateJSON: true
                    }).then(function (res) {
                        var data = res.data;
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: data.appId, // 必填，公众号的唯一标识
                            timestamp: data.timestamp, // 必填，生成签名的时间戳
                            nonceStr: data.nonce, // 必填，生成签名的随机串
                            signature: data.signature, // 必填，签名，见附录1
                            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });

                        wx.ready(function () {
                            wx.onMenuShareTimeline({
                                title: state.allSchoolInfo.name + '-' + state.secondNavData[_this.activeIndex].name, // 分享标题
                                //link: state.currentHref, // 分享链接
                                imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
                                success: function success() {
                                    // 用户确认分享后执行的回调函数
                                },
                                cancel: function cancel() {
                                    // 用户取消分享后执行的回调函数
                                }
                            });

                            wx.onMenuShareAppMessage({
                                title: state.allSchoolInfo.name + '-' + state.secondNavData[_this.activeIndex].name, // 分享标题
                                desc: '点击查看' + state.secondNavData[_this.activeIndex].name, // 分享描述
                                //                                    desc:urlAddToken(window.location.href),
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
                }

                var _this = _this4;
            }, function (err) {
                _this4.$store.commit('CHANGE_LOADINGFLAG', false);
            });
            this.activeIndex = 0;
        }
    },
    created: function created() {
        var _this5 = this;

        var num = 0;

        //            alert('分享link为：'+
        //                (window.location.href.split('#')[0]+'&redirectUrl='+encodeURIComponent(urlAddToken(window.location.href))).replace('/build/index.html','/weixin/index')
        //            )


        this.$store.commit('CHANGE_LOADINGFLAG', true);
        //            this.getInit()


        var state = this.$store.state;
        this.$http.get(state.host + state.baseUrl + '/infoCat/getInfoCatlist?sCode=' + state.scode + '&catId=' + this.catId).then(function (res) {

            //                    sessionStorage.setItem('threeCatName',res.data[0].name);
            _this5.$store.commit('CHANGE_LOADINGFLAG', false);
            var secondCatId = res.data.data.secondCatId;
            _this5.CHANGE_SECONDNAVDATA(res.data.data.menu);
            for (var i = 0; i < _this5.secondNavData.length; i++) {
                if (secondCatId == _this5.secondNavData[i].catId) {
                    num++;
                    _this5.activeIndex = i;
                    break;
                }
            }
            if (num == 0) {
                _this5.canFindCatId = 0;
            } else {
                _this5.canFindCatId = 1;
            }
            i = i >= _this5.secondNavData.length ? 0 : i;
            _this5.endFlag = false;
            _this5.curPage = 1;
            var articleListCatId = '';
            var data = res.data.data.menu;
            if (data[i].children.length > 0) {
                articleListCatId = data[i].children[0].catId;
            } else {
                articleListCatId = data[i].catId;
            }
            _this5.articleListCatId = articleListCatId;

            sessionStorage.setItem('threeCatName', data[i].children.length > 0 ? data[i].children[0].name : '');

            _this5.CHANGE_SUBNAVDATA(data[i].children);
            if (_this5.$children[0].$refs.sub_navs_swiper_wrap) {
                _this5.$children[0].$refs.sub_navs_swiper_wrap.scrollLeft = 0;
                _this5.$children[0].tapIndex = 0;
                var state = _this5.$store.state;
                _this5.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentlist?curPage=' + _this5.curPage + '&pageSize=20&catId=' + articleListCatId).then(function (res) {
                    _this5.CHANGE_SUBCONDATA(res.data.data);

                    //                                if(sessionStorage.getItem('subConData2')){
                    //
                    //                                }else{
                    sessionStorage.setItem('subConData2', JSON.stringify(res.data.data));
                    //                                }

                    //                                    var left = $('.second_navs .active').offset().left
                    //                                    this.$refs.second_navs_swiper.scrollLeft = left


                    //横向类名菜单定位优化

                    var totalWidth = 0;
                    var currentWidth = 0;
                    var allSlides = document.getElementsByClassName('swiper-slide');
                    var length = allSlides.length;
                    for (var r = 0; r < length; r++) {
                        if (r == _this5.activeIndex) {
                            currentWidth = parseFloat(getComputedStyle(allSlides[r]).width);
                            break;
                        } else {
                            var w = getComputedStyle(allSlides[r]).width;
                            totalWidth += parseFloat(w);
                        }
                    }
                    var _this = _this5;
                    var distance = parseFloat(getComputedStyle(_this.$refs.second_navs_swiper).width) / 2 - currentWidth / 2;

                    (0, _jquery2.default)('.second_navs_swiper').animate({ scrollLeft: totalWidth - distance }, 300);
                }, function (err) {
                    console.log(err);
                });

                //    组件更新的时候配置微信SDK接口        *************************************************************************
                var state = _this5.$store.state;
                var _this = _this5;

                //                            alert('分享link为：'+
                //                                (window.location.href.split('#')[0]+'&redirectUrl='+encodeURIComponent(urlAddToken(window.location.href))).replace('/build/index.html','/weixin/index')
                //                            )
                var url = state.host + state.baseUrl + '/getJsSign';
                var data = {
                    url: location.href.indexOf('from=') > -1 ? location.href.split('&from=')[0] : location.href.split('#')[0]
                };
                _this5.$http.post(url, data, {
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

                    //                                    alert('state.allSchoolInfo.name:' + state.allSchoolInfo.name + ' ' + 'state.allSchoolInfo.professor:' + state.allSchoolInfo.professor + ' state.allSchoolInfo.schoolIcon:' + state.allSchoolInfo.schoolIcon)
                    //                                    alert('sessionStorage中的spreadToken为：' + sessionStorage.spreadToken);
                    //
                    //                                    alert('分享链接为：' + urlAddToken(window.location.href));


                    wx.ready(function () {
                        wx.onMenuShareTimeline({
                            title: state.allSchoolInfo.name + '-' + state.secondNavData[_this.activeIndex].name, // 分享标题
                            //link: state.currentHref, // 分享链接
                            imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
                            success: function success() {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function cancel() {
                                // 用户取消分享后执行的回调函数
                            }
                        });

                        wx.onMenuShareAppMessage({
                            title: state.allSchoolInfo.name + '-' + state.secondNavData[_this.activeIndex].name, // 分享标题
                            desc: '点击查看' + state.secondNavData[_this.activeIndex].name, // 分享描述
                            //                                    desc:urlAddToken(window.location.href),
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
            }

            var _this = _this5;
            setTimeout(function () {
                (0, _count2.default)(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, null, null, _this.$store.state.viewSourceUrl).then(function (res) {});
            }, 1000);

            //                        setTimeout(() => {
            //                            this.$store.commit('CHANGE_LOADINGFLAG', false)
            //                            var second_navs_swiper = this.$refs.second_navs_swiper
            //                            var second_navs_next = this.$refs.second_navs_next
            //                            if (second_navs_swiper.scrollWidth > second_navs_swiper.offsetWidth + 10) {
            //                                second_navs_next.style.display = 'block'
            //                            } else {
            //                                second_navs_next.style.display = 'none'
            //                            }
            //                            var left = $('.second_navs .active').offset().left
            //                            this.$refs.second_navs_swiper.scrollLeft = left
            //                        }, 1)
        }, function (err) {
            _this5.$store.commit('CHANGE_LOADINGFLAG', false);
        });
        this.activeIndex = 0;

        var state = this.$store.state;
        if (state.scholl) {
            document.title = state.scholl.name;
        }
        // piwik.initPiwik(state.identify, state.sid)
    }
};

/***/ })

})
//# sourceMappingURL=0.02e301a5aff966658d91.hot-update.js.map