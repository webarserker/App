<template>
    <div>
        <!-- 内容区域 -->
        <div class="home-container">
            <!-- banner -->
            <div class="banner">
                <div class="swiper-container banner-swiper">
                    <div class="swiper-wrapper">
                        <div v-for="(obj,idx) of banner" :key="idx" class="swiper-slide"
                             :style="{'background-image': 'url('+$store.state.imgHost+obj.imgUrl+')'}"
                             @click="bannerClick(obj.link)">
                            <p v-text="obj.title"></p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 报考指南模块 -->
            <div class="guide_container" v-show="baokao.length!=0">
                <div class="guide_prev"></div>
                <div class="swiper-container guide-swiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(x,idx) of baokao" @click="goToList(x.refUrl,x.catId)">
                            <i v-if="x.icon" :class="x.icon"></i>
                            <!--<img v-else :src="$store.state.imgHost+x.imgUrl" />-->
                            <i v-else :class="['usericon-webicon-01','iconfont']"></i>
                            <span v-text="x.name"></span>
                        </div>
                    </div>
                </div>
                <div class="guide_next"></div>
            </div>
            <!-- 视频在线模块 -->
            <div class="video_container" v-show="video.length!=0">
                <h2 class="title_carousel" @click="$router.push('/videoList')">
                    <b :style={background:$store.state.themeColor}></b>
                    <span>视频在线</span>
                    <i class="more"></i>
                    <s>more</s>
                </h2>
                <div class="flex_box">
                    <div class="video_prev"></div>
                    <div class="swiper-container video-swiper">
                        <div class="swiper-wrapper">
                            <div v-for="(x,idx) of video" class="swiper-slide"
                                 :style="{'background-image': 'url('+$store.state.imgHost+x.imgUrl+')'}"
                                 @click="bannerClick(x.videoUrl)">
                                <img src="../../img/play.png">
                                <span v-text="x.title"></span>
                                <div class="vmask"></div>
                            </div>
                        </div>
                    </div>
                    <div class="video_next"></div>
                </div>
            </div>
            <!-- 招录公告模块 -->
            <div class="notice_container" v-show="noticeList.length!=0">
                <h2 class="title_carousel"
                    @click="noticeCatId?$router.push('/articleList?catId='+noticeCatId):$router.push('/noticeList?name='+noticeCatName)">
                    <b :style={background:$store.state.themeColor}></b>
                    <span>{{noticeCatName}}</span>
                    <i class="more"></i>
                    <s>more</s>
                </h2>
                <div class="notice_items">
                    <div class="notice_item" v-for="obj of noticeList" @click="goToDetail(obj.refUrl,obj.id,obj.catId)">
                        <div class="datetime">
                            <span v-text="getMonthAndDay(obj.date)"></span>
                            <span v-text="getYear(obj.date)"></span>
                        </div>
                        <p v-text="obj.name"></p>
                        <span v-if="!obj.isRead" class="comicon-08 unread"></span>
                    </div>
                </div>
            </div>
            <!-- 智能在线答疑模块 -->
            <div class="question_container" @click="gotoOnline" :style={background:$store.state.themeColor}>
                <!-- <img src="../img/service.png" /> -->
                <i class="comicon-10 iconImg" :style="{color:$store.state.themeColor}"></i>
                <div class="question_msg">
                    <p>智能在线答疑</p>
                    <p>365*24小时，有问必答，不漏掉每一个考生的声音</p>
                </div>
                <span @click="gotoOnline" class="question_link" :style={color:$store.state.themeColor}>答疑快速通道</span>
            </div>
            <!-- 热点信息模块 -->
            <div class="hot_container" v-show="newsList.length!=0">
                <h2 class="title_carousel" @click="$router.push('/articleList?catId='+newsCatId)">
                    <b :style={background:$store.state.themeColor}></b>
                    <span>{{newsCatName}}</span>
                    <i class="more"></i>
                    <s>more</s>
                </h2>
                <div class="news_items">
                    <div class="news_item" v-for="obj of newsList" @click="goToDetail(obj.refUrl,obj.id,newsCatId)">
                        <h3 v-html="obj.name"></h3>
                        <p v-html="obj.desc"></p>
                        <div class="datetime" v-text="getLocalTime(obj.date)"></div>
                    </div>
                </div>
            </div>
            <!-- 版权模块 -->
            <div class="copyright_container" :style={background:$store.state.themeColor}>
                <div class="dcode_area">
                    <div class="dcode_item">
                        <img v-if="$store.state.allSchoolInfo"
                             :src="$store.state.imgHost+$store.state.allSchoolInfo.wxSchoolOfficeQrcode" title="qrcode"
                             alt="qrcode" @click="$store.state.sdecode=true"/>
                        <span v-if="$store.state.allSchoolInfo" v-text="$store.state.allSchoolInfo.name"></span>
                    </div>
                    <!-- <div class="dcode_item">
                        <img @click="$store.state.sdecode2=true" src="../img/dcode.png" title="qrcode" alt="qrcode" />
                        <img src="../img/dcode.png" title="qrcode" alt="qrcode" />
                        <span>招办汇二维码</span>
                    </div> -->
                </div>
                <p v-if="$store.state.allSchoolInfo">© 版权所有 : {{$store.state.allSchoolInfo.name}}</p>
                <p>Copyright 2017 ALL RIGHTS RESERVED</p>
                <p>北京闻道卓越教育科技有限公司技术支持|京ICP备16030849号</p>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
    import "../../css/index.scss"
    import {
        mapActions
    } from "vuex"
    import piwik from '../../utils/piwik.js'
    import count from '../../utils/count.js'
    import cutUid from '../../utils/cutUid.js'
    import urlAddToken from '../../utils/urlAddToken.js'

    export default {
        updated() {


        },
        data() {
            return {
                newsList: [],
                newsCatId: '',
                noticeList: [],
                banner: [],
                baokao: [],
                video: [],
                noticeCatId: '',
                newsCatName: '',
                noticeCatName: '',
                cutUidUrl: cutUid()

            }
        },
        methods: {
            ...mapActions(['CHANGE_SHOWFOOTER', 'CHANGE_FOOTERTAB']),
            getLocalTime: function (date) {
                var time = new Date(parseInt(date))
                var y = time.getFullYear()
                var m = time.getMonth() + 1
                var d = time.getDate()
                return y + '-' + (m > 9 ? m : '0' + m) + '-' + (d > 9 ? d : '0' + d);
            },
            getMonthAndDay: function (date) {
                var time = new Date(parseInt(date))
                var m = time.getMonth() + 1
                var d = time.getDate()
                return (m > 9 ? m : '0' + m) + '.' + (d > 9 ? d : '0' + d);
            },
            getYear: function (date) {
                return (new Date(parseInt(date))).getFullYear();
            },
            isRead: function (obj) {
                if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
                    return !(localStorage.getItem(obj.infoId) || obj.isRead)
                } else {
                    return !localStorage.getItem(obj.infoId)
                }
            },
            bannerClick: function (link) {
                if (link != '' && link != null) {
                    if (link.substr(0, 4) != 'http') {
                        link = this.$store.state.imgHost + link;
                    }
                    location.href = link
                }
            },
            gotoOnline: function () {
                if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
                    var user = JSON.parse(localStorage.user)
                    var state = this.$store.state
                    //http://60.205.149.102:3000/users?id=17165&sCode=NLGYFE&name=web_oT2HWvxz5PNctwha5OpszfLGDH-Q&professor=%E6%99%BA%E8%83%BD%E6%8B%9B%E5%8A%9E&school=%E5%AF%B9%E5%A4%96%E7%BB%8F%E6%B5%8E%E8%B4%B8%E6%98%93%E5%A4%A7%E5%AD%A6
                    location.href = 'http://robot.zhinengdayi.com:3000/users?source=1&id=' + user.id + '&sCode=' + state.scode + '&name=' + user.nickName + '&professor=' + state.scholl.professor + '&school=' + state.scholl.name;
                    //location.href = '/robot.html?scode=' + state.scode;
                } else {
                    localStorage.needOpen = 1;
                    this.$router.push('/login')
                }
            },
            goToList: function (link, catId) {
                if (link) {
                    window.location.href = link;
                } else {
                    this.$router.push('/articleList?catId=' + catId)
                }
            },
            goToDetail: function (link, infoId, catId) {
                if (link) {
                    window.location.href = link;
                } else {
                    this.$router.push('/articleDetail?infoId=' + infoId + '&catId=' + catId)
                }
            }
        },
        components: {},
        created() {


            var state = this.$store.state


//
//            if(localStorage.user&&localStorage.needOpen==1){
//                localStorage.needOpen=2;
//                var user = JSON.parse(localStorage.user)
//
//                location.href = 'http://robot.zhinengdayi.com:3000/users?id=' + user.id + '&sCode=' + state.scode + '&name=' + user.nickName + '&professor=' + state.scholl.professor + '&school=' + state.scholl.name;
//
//            }
//
//


            /*******************************轮播图接口*******************************/
            this.$http.get(state.host + '/front/template/' + state.scode + '/' + state.mVersion + '/Banner').then(res => {
                res = res.body;
                this.banner = res.data;
            })
            /***************************************************************************/


            /*******************************快捷入口接口*******************************/
            this.$http.get(state.host + '/front/template/' + state.scode + '/' + state.mVersion + '/QuickEnter').then(res => {
                res = res.body;
                if (res.data == null) {
                    this.baokao = []
                } else {
                    this.baokao = res.data;
                }
            })
            /***************************************************************************/

            /*******************************视频在线接口*******************************/
            this.$http.get(state.host + '/front/template/' + state.scode + '/' + state.mVersion + '/Video').then(res => {
                res = res.body;
                if (res.data == null) {
                    this.video = []
                } else {
                    this.video = res.data;
                }
            })
            /***************************************************************************/


            this.$store.commit('CHANGE_LOADINGFLAG', true)
            // if (this.$route.query.scode) {
            //     localStorage.scode = this.$route.query.scode
            //     this.$store.commit('CHANGE_SCODE', this.$route.query.scode)
            // }
            if (this.$route.query.uid) {
                localStorage.uid = this.$route.query.uid
                var url = state.host + state.baseUrl + '/user/getUserInfoById?userId=' + this.$route.query.uid
                this.$http.get(url)
                    .then(res => {
                        localStorage.user = JSON.stringify(res.data.data)
                        this.$store.commit('CHANGE_ISLOGIN', 1)

                        sessionStorage.setItem('isLogin', 1);

                    }, err => {
                        console.log(err)
                    })


                /***************************进入首页时携带uid的话就直接关注该学校**********************/
                this.$http.post(state.host + state.baseUrl + '/school/addSubSchool', {
                    userId: localStorage.uid,
                    schoolCode: state.scode
                }, {
                    emulateJSON: true
                })


                /*********************************************************************************/

            }

            //老的快讯接口
//            this.$http.get(state.host + state.baseUrl + '/infoContent/commonQuery?sCode=' + state.scode + '&icontentType=-2&catSize=1&infoSize=3')
//                .then(res => {
//                    this.newsList = res.data.data[0].children;
//                    this.newsCatId = res.data.data[0].catId
//                }, err => {
//                    console.log(err)
//                })


            var userId = ''
            var userId2 = ''
            var login = '&login=' + false
            localStorage.setItem(this.infoId, this.infoId)
            if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
                userId = '&userId=' + JSON.parse(localStorage.user).id
                userId2 = '?userId=' + JSON.parse(localStorage.user).id
                login = '&login=' + true
            }
//            this.$http.get(state.host + state.baseUrl + '/index/noticeList?sCode=' + state.scode + userId)
//                .then(res => {
//                    this.noticeList = res.data.data
//                }, err => {
//                    console.log(err)
//                })

            /******************************招录公告接口**********************************/
            this.$http.get(state.host + '/front/template/' + state.scode + '/' + state.mVersion + '/Notice' + userId2).then(res => {
                res = res.body;
                if (res.data == null) {
                    this.noticeList = []
                } else {
                    this.noticeCatId = res.data[0].catId;
                    this.noticeList = res.data[0].children;
                    this.noticeCatName = res.modelName;
                }
            })


            /*********************************************************************************/

            /*******************************快讯接口*******************************/
            this.$http.get(state.host + '/front/template/' + state.scode + '/' + state.mVersion + '/News' + userId2).then(res => {
                res = res.body;

                if (res.data == null) {
                    this.newsList = []
                } else {
                    this.newsList = res.data[0].children;
                    this.newsCatId = res.data[0].catId;
                    this.newsCatName = res.modelName ? res.modelName : '快讯';
                }
            })
            /***************************************************************************/


            this.$http.get(state.host + state.baseUrl + '/index/getBaseInfo?sCode=' + state.scode + userId + login)
                .then(res => {
                    var data = res.data.data
//                    this.banner = data.banner
//                    this.baokao = data.baokao
//                    this.video = data.video
                    // this.$store.commit('CHANGE_MSGCOUNT', data.messageCount)
                    // this.$store.commit('CHANGE_SCHOLL', data.school)
                    // this.$store.commit('CHANGE_FOOTERMENU', data.footerMenu.length > 4 ? data.footerMenu.slice(0, 4) : data.footerMenu)
                    // this.$store.commit('CHANGE_THEMECOLOR', '#' + data.school.themeColor)
                    setTimeout(() => {
                        this.$store.commit('CHANGE_LOADINGFLAG', false)
                    }, 1000)

                    document.title = data.school.professor
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
                    this.$store.commit('CHANGE_LOADINGFLAG', false)
                })
        },
        watch: {
            banner: function () {
                if (this.banner.length == 0) return;
                setTimeout(() => {
                    new Swiper('.banner-swiper', {
                        effect: 'coverflow',
                        centeredSlides: true,
                        slidesPerView: 'auto',
                        loop: true,
                        spaceBetween: 60 / 64 * parseInt(document.getElementsByTagName('html')[0].style['font-size']),
                        autoplay: 3000,
                        autoplayDisableOnInteraction: false,
                        coverflow: {
                            rotate: 30,
                            stretch: 0,
                            depth: 180,
                            modifier: 1,
                            slideShadows: false
                        },
                    })
                }, 0)

            },
            baokao: function () {
                if (this.baokao.length == 0) return;
                setTimeout(() => {
                    new Swiper('.guide-swiper', {
                        slidesPerView: 4,
                        // slidesPerGroup: 4,
                        // loop: true,
                        prevButton: '.guide_prev',
                        nextButton: '.guide_next',
                    })
                }, 0)
            },
            video: function () {
                if (this.video.length == 0) return;
                setTimeout(() => {
                    new Swiper('.video-swiper', {
                        slidesPerView: 3,
                        spaceBetween: 10 / 640 * window.innerWidth,
                        // slidesPerGroup: 3,
                        // loop: true,
                        prevButton: '.video_prev',
                        nextButton: '.video_next',
                    })
                }, 0)
            }
        },
        mounted() {
            this.CHANGE_SHOWFOOTER(true)
            this.CHANGE_FOOTERTAB(0)
            var _this = this;
            setTimeout(() => {
                count(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, null, null, _this.$store.state.viewSourceUrl).then(res => {
                });
            }, 1000)


            var _this = this;
            var state = this.$store.state;
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
//                    alert('appId为：'+data.appId+' signature为：'+data.signature)
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appId, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.nonce, // 必填，生成签名的随机串
                        signature: data.signature, // 必填，签名，见附录1
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });


//
//                    alert('state.allSchoolInfo.name:'+state.allSchoolInfo.name+' '+'state.allSchoolInfo.professor:'+state.allSchoolInfo.professor+' state.allSchoolInfo.schoolIcon:'+state.allSchoolInfo.schoolIcon)
//                    alert('分享链接为：'+_this.cutUidUrl)
                    wx.ready(function () {
                        wx.onMenuShareTimeline({
                            title: state.allSchoolInfo.name + '-' + state.allSchoolInfo.professor, // 分享标题
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
                            title: state.allSchoolInfo.name + '-' + state.allSchoolInfo.professor, // 分享标题
                            desc: '点击查看首页', // 分享描述
//                    desc:urlAddToken(_this.cutUidUrl),
//                                link: state.currentHref, // 分享链接
                            link: _this.cutUidUrl,
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
//                        alert('签名错误')
                    })
                }, err => {
                    console.log(err)
                })


        }
    }
</script>
