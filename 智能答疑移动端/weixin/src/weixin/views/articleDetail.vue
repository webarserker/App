<template>
    <div>
        <v-header></v-header>
        <!-- 面包屑 -->
        <div class="path dpath" ref="bread">
            <i :style="{color: $store.state.themeColor}" class="comicon-17 icon1-return" @click="goback"></i>
            <!-- <a :style="{color: $store.state.themeColor}" href="javascript:void(0);" @click="$router.push('/')">首页</a>  -->
            <a :style="{color: $store.state.themeColor}" href="javascript:void(0);" v-text="secondCatName"></a>
            <i class="comicon-07 icon1-link" v-show="threeCatNameToBread"></i>
            <span>{{threeCatNameToBread ? threeCatNameToBread : ''}}</span>
            <!--<span v-text='title'></span>-->
        </div>
        <div class="container" v-scroll="scrollAction" ref="content" v-if="initScrollWindow">
            <div class="article-body" ref="articleBody">

                <div class="title-container" ref="titleContainer">
                    <h2 :style="{color: $store.state.themeColor}" v-text="title" class="article-title"></h2>
                    <div class="info" v-if="infoId && catId">
                        <p class="date">
                            发布时间：{{publishTime}}
                        </p>
                        <p class="see">
                            浏览量：{{viewTimes}}
                        </p>
                    </div>
                </div>
                <div v-html="content" ref="articleContent" class="content fixLineHeight" v-if="content">

                </div>
                <v-comp-6 v-if="specType==6" :infoId="infoId" class="comp"></v-comp-6>
                <v-comp-13 v-if="specType==13" :infoId="infoId" class="comp"></v-comp-13>
                <v-comp-8 v-if="specType==8" :infoId="infoId" class="comp"></v-comp-8>
                <v-comp-10 v-if="specType==10" :infoId="infoId" class="comp"></v-comp-10>
                <v-comp-11 v-if="specType==11" :infoId="infoId" class="comp"></v-comp-11>
                <v-comp-1 v-if="specType==1" :infoId="infoId" class="comp"></v-comp-1>

                <!--此处添加一个路由模板-->
                <v-comp-14 v-if="specType==14" :infoId="infoId"></v-comp-14>
                <!-------------------------------->
                <!-- <v-table1 ></v-table1> -->
                <!--<div class="emp_360"></div>-->

            </div>
            <!-- 版权模块 -->
            <div ref="bottomContent" class="copyright_container" :style={background:$store.state.themeColor}>
                <div class="dcode_area">
                    <!-- <div class="dcode_item">
                        <img v-if="$store.state.scholl" :src="$store.state.imgHost+$store.state.scholl.schoolOfficeQrcode" title="qrcode" alt="qrcode" />
                        <span v-if="$store.state.scholl" v-text="$store.state.scholl.name"></span>
                    </div> -->
                    <div class="dcode_item">
                        <img v-if="$store.state.allSchoolInfo"
                             :src="$store.state.imgHost+$store.state.allSchoolInfo.wxSchoolOfficeQrcode" title="qrcode"
                             alt="qrcode" @click="$store.state.sdecode=true"/>
                        <span v-if="$store.state.allSchoolInfo" v-text="$store.state.allSchoolInfo.name"></span>
                    </div>
                </div>
                <p v-if="$store.state.allSchoolInfo">© 版权所有 : {{$store.state.allSchoolInfo.name}}</p>
                <p>Copyright 2017 ALL RIGHTS RESERVED</p>
                <p>北京闻道卓越教育科技有限公司技术支持|京ICP备16030849号</p>
            </div>
        </div>
        <!-- <v-footer></v-footer> -->
        <!-- <v-loadingImg></v-loadingImg> -->
        <div v-show="flag" class="gotop" @click="gotop"></div>
        <v-menuball></v-menuball>
        <v-sdecode></v-sdecode>
        <v-sdecode2></v-sdecode2>
    </div>
</template>
<script type="text/javascript">
    import piwik from '../utils/piwik.js'
    import count from '../utils/count.js'
    import urlParse from '../utils/urlParse2.js'
    import urlAddToken from '../utils/urlAddToken.js'

    export default {
        beforeRouteEnter(to, from, next){
            next(vm=>{
                if (from.path.indexOf('articleList') > -1) {
                    vm.fromPageIsList=1;
                }else if(from.path.indexOf('articleDetail') > -1){
                    vm.fromPageIsDetail=1;
                }
            });
        },
        data() {
            return {
                fromPageIsList:0,
                fromPageIsDetail:0,
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
            }
        },
        computed: {
            catId: function () {
                return this.$route.query.catId
            },
            infoId: function () {
                return this.$route.query.infoId || null;
            },
            contentType: function () {
                return this.$route.query.contentType
            },
            majorId: function () {
                return this.$route.query.tid || null;
            },
            initScrollWindow() {
//                return this.content || document.getElementsByClassName('comp').length
                return this.content || this.specType || this.title;

            }
        },
        components: {
            "v-header": require('../component/Header.vue'),
            "v-footer": require('../component/Footer.vue'),
            "v-loadingImg": require('../component/loadingImg.vue'),
            "v-comp-6": require('../component/comp-6.vue'),
            "v-comp-8": require('../component/comp-8.vue'),
            "v-comp-10": require('../component/comp-10.vue'),
            "v-comp-11": require('../component/comp-11.vue'),
            "v-comp-13": require('../component/comp-13.vue'),
            "v-comp-1": require('../component/comp-1.vue'),
            "v-menuball": require('../component/Menuball.vue'),
            "v-sdecode": require('../component/sdecode.vue'),
            "v-sdecode2": require('../component/sdecode2.vue'),
            //            注册新加的组件
            "v-comp-14": require('../component/comp-14.vue')
        },
        watch: {
            '$route'(to, from) {
                var _this = this;
                setTimeout(() => {
                    count(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, _this.infoId, _this.majorId, _this.$store.state.viewSourceUrl).then(res => {
                    });
                }, 1000)
            },
            content: function () {
                if (!this.content) return;
                this.content = this.content.replace(/[0-9]+px/g, function (val) {
                    return parseInt(val) / 32 + 'rem'
                });

            }
        },
        methods: {
            gotop: function () {
                this.$refs.content.scrollTop = 0
            },
            scrollAction: function (e) {
                this.flag = this.$refs.content.scrollTop > 50 ? true : false

                var table_list = document.getElementsByClassName('table_list')[0]
                var thead = document.getElementsByClassName('t_head')[0]
                var tbody = document.getElementsByClassName('t_body')[0]
                var content = document.getElementsByClassName('content')[0]

                if (this.headTop == 0) {
                    if (thead) {
                        this.headTop = thead.offsetTop;
                    }
                }

                if (thead) {
                    // if(this.$refs.content.scrollTop-this.h>10){
//                    if (this.$refs.content.scrollTop - thead.offsetTop > -20 / 64 * parseInt(document.documentElement.style['font-size'])) {
                    if (this.$refs.content.scrollTop > this.headTop) {
                        thead.style.position = 'fixed'
                        thead.style.top = '2.3rem'
                        thead.style.left = '0.53rem'
                        thead.style.right = '0.53rem'
                        tbody.style.marginTop = '0.93rem'
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
                        thead.style.position = 'inherit'
                        tbody.style.marginTop = '0'
                        // thead.style.zIndex = '9999999'
                    }
                }
            },
            goback: function () {
                if(this.fromPageIsList==1){
                    var obj = urlParse();
                    if (obj.contentType) {
                        this.$router.push('/normalQuestion?contentType=' + obj.contentType)
                    } else if (obj.catId) {
                        this.$router.push('/articleList?catId=' + obj.catId)
                    }else if(obj.specType){
                        this.$router.go(-1);
                    } else {
                        this.$router.push('/');
                    }
                }else if(this.fromPageIsDetail==1){
                    var obj = urlParse();
                    if (obj.contentType) {
                        this.$router.push('/normalQuestion?contentType=' + obj.contentType)
                    } else if (obj.catId) {
                        this.$router.push('/articleList?catId=' + obj.catId)
                    }else if(obj.specType){
                        this.$router.go(-1);
                    } else {
                        this.$router.push('/');
                    }
                }else{
                    if (window.history.length > 1) {
                        this.$router.go(-1);
                    } else {
                        var obj = urlParse();
                        if (obj.contentType) {
                            this.$router.push('/normalQuestion?contentType=' + obj.contentType)
                        } else if (obj.catId) {
                            this.$router.push('/articleList?catId=' + obj.catId)
                        }else if(obj.specType){
                            this.$router.go(-1);
                        } else {
                            this.$router.push('/');
                        }
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
        mounted() {
            var _this = this;
            setTimeout(() => {
                count(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, _this.infoId, _this.majorId, _this.$store.state.viewSourceUrl).then(res => {
                });
            }, 1000)

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
            var userId = ''
            localStorage.setItem(this.infoId, this.infoId)
            if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
                userId = '&userId=' + JSON.parse(localStorage.user).id
            } else {

            }
            var state = this.$store.state
            this.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentDetail?infoId=' + this.infoId + userId + '&sCode=' + state.scode + '&parentId=' + this.catId)
                .then(res => {
                    var data = res.data.data
//                    this.content = data.content
                    if (data.content) {
                        this.content = data.content.replace(/<table.*?>.*?<\/table>/g, function (keyword) {
                            return '<div class="table-scroll-wrapper">' + keyword + '</div>'
                        })
                    }

                    this.title = data.title
                    this.publishTime = data.publishTime;
                    this.viewTimes = data.viewTimes;
                    this.secondCatName = data.secondCatName
                    this.specType = data.specType
//                    document.title = data.title
                    setTimeout(() => {
                        this.$store.commit('CHANGE_LOADINGFLAG', false)
                    }, 1000)


                    //    组件更新的时候配置微信SDK接口        *************************************************************************
                    var state = this.$store.state
                    var _this = this;


                    var url = state.host + state.baseUrl + '/getJsSign'
                    var data = {
                        url: location.href.indexOf('from=') > -1 ? location.href.split('&from=')[0] : location.href.split('#')[0]
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


//                            alert('state.allSchoolInfo.name:' + state.allSchoolInfo.name + ' ' + 'state.allSchoolInfo.professor:' + state.allSchoolInfo.professor + ' state.allSchoolInfo.schoolIcon:' + state.allSchoolInfo.schoolIcon)
//                            alert('分享链接为：'+urlAddToken(window.location.href));

                            wx.ready(function () {
                                wx.onMenuShareTimeline({
                                    title: state.allSchoolInfo.name + '-' + '文章详情', // 分享标题
                                    //link: state.currentHref, // 分享链接
//                            imgUrl: state.imgHost + iconUrl, // 分享图标
                                    success: function () {
                                        // 用户确认分享后执行的回调函数
                                    },
                                    cancel: function () {
                                        // 用户取消分享后执行的回调函数
                                    }
                                });

                                wx.onMenuShareAppMessage({
                                    title: state.allSchoolInfo.name + '-' + '文章详情', // 分享标题
                                    desc: '点击查看' + _this.title, // 分享描述
//                    desc:urlAddToken(window.location.href),
//                                link: state.currentHref, // 分享链接
                                    link: (window.location.href.split('#')[0] + '&redirectUrl=' + encodeURIComponent(urlAddToken(window.location.href))).replace('/build/index.html', '/weixin/index'),
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


                }, err => {
                    console.log(err)
                    this.$store.commit('CHANGE_LOADINGFLAG', false)
                })


        },
        created() {
            this.$store.state.currentHref = location.href;
            var reg = new RegExp("(^|&)scode=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                localStorage.scode = unescape(r[2])
                this.$store.commit('CHANGE_SCODE', unescape(r[2]))
            }
            this.$store.commit('CHANGE_LOADINGFLAG', true)
            // this.$store.commit('CHANGE_FOOTERTAB', -1)
            var state = this.$store.state
            var userId = ''
            var login = '&login=' + false
            localStorage.setItem(this.infoId, this.infoId)
            // if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
            if ((localStorage.user) || this.$store.state.isLogin) {
                userId = '&userId=' + JSON.parse(localStorage.user).id
                login = '&login=' + true
            }
            this.$http.get(state.host + state.baseUrl + '/index/getBaseInfo?sCode=' + state.scode + userId + login)
                .then(res => {
                    var data = res.data.data
                    this.$store.commit('CHANGE_MSGCOUNT', data.messageCount)
                    this.$store.commit('CHANGE_SCHOLL', data.school)
                    this.$store.commit('CHANGE_FOOTERMENU', data.footerMenu.length > 4 ? data.footerMenu.slice(0, 4) : data.footerMenu)
                    this.$store.commit('CHANGE_THEMECOLOR', '#' + data.school.themeColor)
                    // document.title = data.school.name
                    setTimeout(() => {
                        this.$store.commit('CHANGE_LOADINGFLAG', false)
                    }, 1000)

                    document.title = data.school.name + '-文章详情'
                    // piwik.initPiwik(state.identify, state.sid)
                    // this.$on('piwik', function(e) {
                    //     // console.info(e);
                    //     piwik.piwikReady(function() {
                    //         var tracker = Piwik.getAsyncTracker();
                    //         tracker.trackPageView(document.title); //参数可以加标题
                    //     }.bind(e));
                    // });
                }, err => {
                    console.log(err)
                })
        },
        updated() {
//            var u = navigator.userAgent;
//            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (document.getElementsByClassName('content').length) {
                var imgs = document.getElementsByClassName('content')[0].getElementsByTagName('img');

                if (imgs.length) {
                    for (let i = 0; i < imgs.length; i++) {
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
            let minHeight = parseFloat(bigHeight) - parseFloat(mHeaderHeight) - parseFloat(breadHeight) - parseFloat(bottomContentHeight);
            if (this.$refs.articleBody) {
                this.$refs.articleBody.style.minHeight = minHeight + 'px'
            }

        },
    }
</script>
<style lang="scss" scoped>
    @import "../css/common.scss";

    .title-container {
        padding-top: pxToRem(25);
        padding-bottom: pxToRem(25);
        border-bottom: 1px solid #ddd;
        /*height:pxToRem(140);*/
        .info {
            display: flex;
            margin-top: pxToRem(10);
            p {
                flex: 1;
                text-align: center;
                font-size: pxToRem(26);
                color: #777;
            }
        }
    }

    .article-title {
        text-align: center;
        font-size: pxToRem(34);
    }

    .path {
        z-index: 9999;
    }

    .path a {
        text-decoration: none !important;
    }

    .content {
        padding: pxToRem(30) pxToRem(40);
        table {
            max-width: 100% !important;
        }
        font-size: 1.3em;
    }

    .content img, p img {
        max-width: 100% !important;
        height: auto !important;
    }

    .dpath {
        a,
        span {
            white-space: nowrap;
        }
        span {
            width: 70%;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .emp_360 {
        height: pxToRem(360);
    }

    .gotop {
        position: fixed;
        right: pxToRem(30);
        bottom: pxToRem(100);
        width: pxToRem(100);
        height: pxToRem(100);
        line-height: pxToRem(80);
        text-align: center;
        background: url('../img/top.png') no-repeat center/cover;
        background-size: pxToRem(80);
        font-size: pxToRem(30);
        border-radius: 50%;
        // border: pxToRem(3) solid #000;
    }

    .copyright_container {
        width: 100%;
    }
</style>
