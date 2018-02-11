<template>
    <div>
        <div class="second_navs" :style="{'border-bottom': '2px solid '+$store.state.themeColor}">
            <div class="second_navs_prev" ref="second_navs_prev" style="display: none;"></div>
            <div v-scroll="scrollAction" class="swiper-container second_navs_swiper" ref="second_navs_swiper">
                <div class="swiper-wrapper">
                    <div v-for='(obj,idx) of secondNavData'
                         :class="idx==activeIndex?'swiper-slide active':'swiper-slide'"
                         @click="tapAction(idx,obj.catId)">
                        <h4 v-text="obj.name" :style="{color: idx==activeIndex?$store.state.themeColor:''}"></h4>
                    </div>
                </div>
            </div>
            <div class="second_navs_next" ref="second_navs_next"></div>
        </div>
        <div class="container" :key="(new Date()).getTime()">

            <v-subNav :tapIndex="tapIndex" :mySubConData2="mySubConData2"></v-subNav>
        </div>
    </div>

</template>
<script type="text/javascript">
    import "../css/articleList.scss";
    import $ from "../lib/jquery-1.11.3.js";
    import {
        mapActions
    } from 'vuex'
    import piwik from '../utils/piwik.js'
    import count from '../utils/count.js'
    import urlAddToken from '../utils/urlAddToken.js'

    export default {
        beforeRouteEnter(to, from, next){
            next(vm=>{
                if (from.path.indexOf('articleDetail') > -1) {
                    vm.tapIndex = sessionStorage.getItem('tapIndex')?sessionStorage.getItem('tapIndex'):0;
                    vm.mySubConData2=sessionStorage.getItem('subConData2')?JSON.parse(sessionStorage.getItem('subConData2')):[];
//                    alert(vm.tapIndex);
                }else{

                    vm.tapIndex=0;
                    vm.mySubConData2=[];
                }
            });
        },
        data() {
            return {
                mySubConData2:[],
                tapIndex:0,
                second_navs_swiper: null,
                activeIndex: 0,
                curPage: 1,
                endFlag: false,
                ajaxFlag: false,
                firstTap: true,
                articleListCatId: ''
            }
        },
        computed: {
            secondNavData: function () {
                return this.$store.state.secondNavData
            },
            catId: function () {
                return this.$route.query.catId
            },
        },
        components: {
            "v-subNav": require("../component/articleListSubNav.vue"),
        },
        methods: {
            scrollAction: function (e) {
                var second_navs_prev = this.$refs.second_navs_prev
                var second_navs_next = this.$refs.second_navs_next
                if (e.target.scrollLeft > 0) {
                    second_navs_prev.style.display = "block"
                } else {
                    second_navs_prev.style.display = "none"
                }
                if (e.target.scrollLeft + e.target.offsetWidth < e.target.scrollWidth - 10) {
                    second_navs_next.style.display = "block"
                } else {
                    second_navs_next.style.display = "none"
                }
            },
            ...mapActions(['CHANGE_SUBNAVDATA', 'CHANGE_SUBCONDATA', 'CHANGE_SECONDNAVDATA']),
            tapAction: function (idx, cid) {
                sessionStorage.setItem('tapIndex', 0);
//                sessionStorage.setItem('subConData2', JSON.stringify({}));
                this.$router.push('/articleList?catId=' + cid)
            },
            getScrollList: function () {
                if (this.ajaxFlag || this.endFlag) return;
                this.ajaxFlag = true
                var idx = this.activeIndex
                var articleListCatId = ''
                if (this.secondNavData[idx].children.length > 0) {
                    articleListCatId = this.secondNavData[idx].children[0].catId
                } else {
                    articleListCatId = this.secondNavData[idx].catId
                }
                var state = this.$store.state
                this.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentlist?curPage=' + this.curPage + '&pageSize=20&catId=' + articleListCatId)
                    .then(res => {
                        var data = res.data.data
                        this.ajaxFlag = false
                        if (!data || data.length == 0) {
                            this.endFlag = true
                        } else {
                            this.CHANGE_SUBCONDATA(state.subConData.concat(res.data.data));
                        }
                    }, err => {
                        alert('getScrollList()请求失败:' + err)
                    })
            },
            getInit: function () {
                var state = this.$store.state
                this.$http.get(state.host + state.baseUrl + '/infoCat/getInfoCatlist?sCode=' + state.scode + '&catId=' + this.catId)
                    .then(res => {
                        this.$store.commit('CHANGE_LOADINGFLAG', false)
                        var secondCatId = res.data.data.secondCatId
                        this.CHANGE_SECONDNAVDATA(res.data.data.menu);
                        for (var i = 0; i < this.secondNavData.length; i++) {
                            if (secondCatId == this.secondNavData[i].catId) {
                                this.activeIndex = i
                                break
                            }
                        }
                        i = i >= this.secondNavData.length ? 0 : i
                        this.endFlag = false
                        this.curPage = 1;
                        var articleListCatId = ''
                        var data = res.data.data.menu
                        if (data[i].children.length > 0) {
                            articleListCatId = data[i].children[0].catId
                        } else {
                            articleListCatId = data[i].catId
                        }
                        this.articleListCatId = articleListCatId
                        this.CHANGE_SUBNAVDATA(data[i].children);
                        if (this.$children[0].$refs.sub_navs_swiper_wrap) {
                            this.$children[0].$refs.sub_navs_swiper_wrap.scrollLeft = 0;
                            this.$children[0].tapIndex = 0;
                            var state = this.$store.state
                            this.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentlist?curPage=' + this.curPage + '&pageSize=20&catId=' + articleListCatId)
                                .then(res => {
                                    this.CHANGE_SUBCONDATA(res.data.data);
//                                    sessionStorage.setItem('subConData2', JSON.stringify(res.data.data));
//                                    var left = $('.second_navs .active').offset().left
//                                    this.$refs.second_navs_swiper.scrollLeft = left


                                    //横向类名菜单定位优化

                                    var totalWidth = 0;
                                    var currentWidth = 0;
                                    var allSlides = document.getElementsByClassName('swiper-slide');
                                    var length = allSlides.length;
                                    for (var r = 0; r < length; r++) {
                                        if (r == this.activeIndex) {
                                            currentWidth = parseFloat(getComputedStyle(allSlides[r]).width);
                                            break;
                                        } else {
                                            var w = getComputedStyle(allSlides[r]).width;
                                            totalWidth += parseFloat(w);
                                        }
                                    }
                                    var _this = this;
                                    var distance = parseFloat(getComputedStyle(_this.$refs.second_navs_swiper).width) / 2 - currentWidth / 2;

                                    $('.second_navs_swiper').animate({scrollLeft: totalWidth - distance}, 300);


                                }, err => {
                                    console.log(err)
                                })


                            //    组件更新的时候配置微信SDK接口        *************************************************************************
                            var state = this.$store.state
                            var _this = this;


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

                        var _this = this;
                        setTimeout(() => {
                            count(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, null, null, _this.$store.state.viewSourceUrl).then(res => {
                            });
                        }, 1000)

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
                    }, err => {
                        this.$store.commit('CHANGE_LOADINGFLAG', false)
                    })
                this.activeIndex = 0;
            }
        },
        watch: {
            '$route'(to, from) {

//                alert('分享link为：'+
//                    (window.location.href.split('#')[0]+'&redirectUrl='+encodeURIComponent(urlAddToken(window.location.href))).replace('/build/index.html','/weixin/index')
//                )



                this.tapIndex=0;
                this.mySubConData2=[];


                var _this = this;
                setTimeout(() => {
                    count(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, null, null, _this.$store.state.viewSourceUrl).then(res => {
                    });
                }, 1000)
            },
            secondNavData: function (v) {
                // setTimeout(() => {
                //     var that = this;
                //     this.second_navs_swiper = new Swiper('.second_navs_swiper', {
                //         // new Swiper('.second_navs_swiper', {
                //         slidesPerView: 'auto',
                //         watchSlidesProgress: true,
                //         watchSlidesVisibility: true,
                //     })
                // }, 0)
            },
            curPage: function (newV, oldV) {
                if (this.curPage == 1) return;
                this.getScrollList()
            },
            catId: function () {
                this.$http.get(this.$store.state.host+'/front/template/getParentInfoCat?catId='+this.catId).then(topRes=>{
                    topRes=topRes.body;
                    if(topRes.data!=this.catId){
                        sessionStorage.setItem('replace3catId',this.catId);
                        this.$router.push('/articleList?catId=' + topRes.data);
                    }



//                this.getInit()
                    var state = this.$store.state
                    this.$http.get(state.host + state.baseUrl + '/infoCat/getInfoCatlist?sCode=' + state.scode + '&catId=' + this.catId)
                        .then(res => {
                            this.$store.commit('CHANGE_LOADINGFLAG', false)
                            var secondCatId = res.data.data.secondCatId
                            this.CHANGE_SECONDNAVDATA(res.data.data.menu);
                            for (var i = 0; i < this.secondNavData.length; i++) {
                                if (secondCatId == this.secondNavData[i].catId) {
                                    this.activeIndex = i
                                    break
                                }
                            }
                            i = i >= this.secondNavData.length ? 0 : i
                            this.endFlag = false
                            this.curPage = 1;
                            var articleListCatId = ''
                            var data = res.data.data.menu
                            if (data[i].children.length > 0) {
                                articleListCatId = data[i].children[0].catId
                            } else {
                                articleListCatId = data[i].catId
                            }
                            this.articleListCatId = articleListCatId


                            sessionStorage.setItem('threeCatName',data[i].children.length>0?data[i].children[0].name:'');

                            console.log(data[i].children);
                            this.CHANGE_SUBNAVDATA(data[i].children);
                            if (this.$children[0].$refs.sub_navs_swiper_wrap) {
                                this.$children[0].$refs.sub_navs_swiper_wrap.scrollLeft = 0;
                                this.$children[0].tapIndex = 0;


                                /********************************************************************************************/
                                var theChildren=data[i].children;
                                for(var z=0;z<theChildren.length;z++){
                                    if(theChildren[z].catId==sessionStorage.replace3catId){
                                        this.$children[0].tapIndex = z;
                                        this.tapIndex=z;

                                        articleListCatId=theChildren[z].catId;
                                        this.articleListCatId=theChildren[z].catId;
                                    }
                                }
                                /*********************************************************************************************/



                                var state = this.$store.state
                                this.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentlist?curPage=' + this.curPage + '&pageSize=20&catId=' + articleListCatId)
                                    .then(res => {
                                        this.CHANGE_SUBCONDATA(res.data.data);
                                        console.log(res.data);
                                        sessionStorage.setItem('subConData2', JSON.stringify(res.data.data));
//                                    var left = $('.second_navs .active').offset().left
//                                    this.$refs.second_navs_swiper.scrollLeft = left


                                        //横向类名菜单定位优化

                                        var totalWidth = 0;
                                        var currentWidth = 0;
                                        var allSlides = document.getElementsByClassName('swiper-slide');
                                        var length = allSlides.length;
                                        for (var r = 0; r < length; r++) {
                                            if (r == this.activeIndex) {
                                                currentWidth = parseFloat(getComputedStyle(allSlides[r]).width);
                                                break;
                                            } else {
                                                var w = getComputedStyle(allSlides[r]).width;
                                                totalWidth += parseFloat(w);
                                            }
                                        }
                                        var _this = this;
                                        var distance = parseFloat(getComputedStyle(_this.$refs.second_navs_swiper).width) / 2 - currentWidth / 2;

                                        $('.second_navs_swiper').animate({scrollLeft: totalWidth - distance}, 300);


                                    }, err => {
                                        console.log(err)
                                    })


                                //    组件更新的时候配置微信SDK接口        *************************************************************************
                                var state = this.$store.state
                                var _this = this;

//                            alert('分享link为：'+
//                                (window.location.href.split('#')[0]+'&redirectUrl='+encodeURIComponent(urlAddToken(window.location.href))).replace('/build/index.html','/weixin/index')
//                            )
                                var url = state.host + state.baseUrl + '/getJsSign'
                                var data = {
                                    url:location.href.indexOf('from=')>-1?location.href.split('&from=')[0]:location.href.split('#')[0]
                                }
                                this.$http.post(url, data, {
                                    emulateJSON: true
                                })
                                    .then(res => {
                                        var data = res.data
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
                                                success: function () {
                                                    // 用户确认分享后执行的回调函数
                                                },
                                                cancel: function () {
                                                    // 用户取消分享后执行的回调函数
                                                }
                                            });

                                            wx.onMenuShareAppMessage({
                                                title: state.allSchoolInfo.name + '-' + state.secondNavData[_this.activeIndex].name, // 分享标题
                                                desc: '点击查看' + state.secondNavData[_this.activeIndex].name, // 分享描述
//                                    desc:urlAddToken(window.location.href),
//                                link: state.currentHref, // 分享链接
                                                link: (window.location.href.split('#')[0]+'&redirectUrl='+encodeURIComponent(urlAddToken(window.location.href))).replace('/build/index.html','/weixin/index'),
                                                imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
                                                // type: 'music、video或link，不填默认为link', // 分享类型,music、video或link，不填默认为link
                                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                                success: function () {
                                                    // 用户确认分享后执行的回调函数
                                                },
                                                cancel: function () {
                                                    // 用户取消分享后执行的回调函数
                                                }
                                            });

                                        })

                                        wx.error(function (err) {
                                            // for (var i of Object.keys(err)) {
                                            //     alert(i + ' : ' + err[i])
                                            // }
                                        })
                                    }, err => {
                                        console.log(err)
                                    })


                            }

                            var _this = this;
//                        setTimeout(() => {
//                            count(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, null, null, _this.$store.state.viewSourceUrl).then(res => {
//                            });
//                        }, 1000)

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
                        }, err => {
                            this.$store.commit('CHANGE_LOADINGFLAG', false)
                        })
                    this.activeIndex = 0;
                })





            }
        },
        created: function () {

            this.$http.get(this.$store.state.host+'/front/template/getParentInfoCat?catId='+this.catId).then(res=>{
                res=res.body;
                if(res.data!=this.catId){
                    sessionStorage.setItem('replace3catId',this.catId);
                    this.$router.push('/articleList?catId=' + res.data);
                }










                this.$store.commit('CHANGE_LOADINGFLAG', true)
//            this.getInit()


                var state = this.$store.state
                this.$http.get(state.host + state.baseUrl + '/infoCat/getInfoCatlist?sCode=' + state.scode + '&catId=' + this.catId)
                    .then(res => {

//                    sessionStorage.setItem('threeCatName',res.data[0].name);
                        this.$store.commit('CHANGE_LOADINGFLAG', false)
                        var secondCatId = res.data.data.secondCatId
                        this.CHANGE_SECONDNAVDATA(res.data.data.menu);
                        for (var i = 0; i < this.secondNavData.length; i++) {
                            if (secondCatId == this.secondNavData[i].catId) {
                                this.activeIndex = i
                                break
                            }
                        }
                        i = i >= this.secondNavData.length ? 0 : i
                        this.endFlag = false
                        this.curPage = 1;
                        var articleListCatId = ''
                        var data = res.data.data.menu
                        if (data[i].children.length > 0) {
                            articleListCatId = data[i].children[0].catId
                        } else {
                            articleListCatId = data[i].catId
                        }
                        this.articleListCatId = articleListCatId


                        sessionStorage.setItem('threeCatName',data[i].children.length>0?data[i].children[0].name:'');



                        this.CHANGE_SUBNAVDATA(data[i].children);
                        if (this.$children[0].$refs.sub_navs_swiper_wrap) {
                            this.$children[0].$refs.sub_navs_swiper_wrap.scrollLeft = 0;
                            this.$children[0].tapIndex = 0;

                            var state = this.$store.state
                            this.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentlist?curPage=' + this.curPage + '&pageSize=20&catId=' + articleListCatId)
                                .then(res => {
                                    this.CHANGE_SUBCONDATA(res.data.data);

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
                                        if (r == this.activeIndex) {
                                            currentWidth = parseFloat(getComputedStyle(allSlides[r]).width);
                                            break;
                                        } else {
                                            var w = getComputedStyle(allSlides[r]).width;
                                            totalWidth += parseFloat(w);
                                        }
                                    }
                                    var _this = this;
                                    var distance = parseFloat(getComputedStyle(_this.$refs.second_navs_swiper).width) / 2 - currentWidth / 2;

                                    $('.second_navs_swiper').animate({scrollLeft: totalWidth - distance}, 300);


                                }, err => {
                                    console.log(err)
                                })


                            //    组件更新的时候配置微信SDK接口        *************************************************************************
                            var state = this.$store.state
                            var _this = this;

//                            alert('分享link为：'+
//                                (window.location.href.split('#')[0]+'&redirectUrl='+encodeURIComponent(urlAddToken(window.location.href))).replace('/build/index.html','/weixin/index')
//                            )
                            var url = state.host + state.baseUrl + '/getJsSign'
                            var data = {
                                url:location.href.indexOf('from=')>-1?location.href.split('&from=')[0]:location.href.split('#')[0]
                            }
                            this.$http.post(url, data, {
                                emulateJSON: true
                            })
                                .then(res => {
                                    // console.log(res.data)
                                    var data = res.data
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
                                            success: function () {
                                                // 用户确认分享后执行的回调函数
                                            },
                                            cancel: function () {
                                                // 用户取消分享后执行的回调函数
                                            }
                                        });

                                        wx.onMenuShareAppMessage({
                                            title: state.allSchoolInfo.name + '-' + state.secondNavData[_this.activeIndex].name, // 分享标题
                                            desc: '点击查看' + state.secondNavData[_this.activeIndex].name, // 分享描述
//                                    desc:urlAddToken(window.location.href),
//                                link: state.currentHref, // 分享链接
                                            link: (window.location.href.split('#')[0]+'&redirectUrl='+encodeURIComponent(urlAddToken(window.location.href))).replace('/build/index.html','/weixin/index'),
                                            imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
                                            // type: 'music、video或link，不填默认为link', // 分享类型,music、video或link，不填默认为link
                                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                            success: function () {
                                                // 用户确认分享后执行的回调函数
                                            },
                                            cancel: function () {
                                                // 用户取消分享后执行的回调函数
                                            }
                                        });

                                    })

                                    wx.error(function (err) {
                                        // for (var i of Object.keys(err)) {
                                        //     alert(i + ' : ' + err[i])
                                        // }
                                    })
                                }, err => {
                                    console.log(err)
                                })


                        }

                        var _this = this;
                        setTimeout(() => {
                            count(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, null, null, _this.$store.state.viewSourceUrl).then(res => {
                            });
                        }, 1000)

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
                    }, err => {
                        this.$store.commit('CHANGE_LOADINGFLAG', false)
                    })
                this.activeIndex = 0;









                var state = this.$store.state
                if (state.scholl) {
                    document.title = state.scholl.name
                }
            })






            // piwik.initPiwik(state.identify, state.sid)
        }
    }
</script>
