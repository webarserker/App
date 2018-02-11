<template>
    <div>
        <!-- 内容区域 -->
        <div class="home-container v2-container">
            <!-- banner -->
            <div class="v2-banner">
                <div class="swiper-container banner-swiper">
                    <div class="swiper-wrapper">
                        <div v-for="(item,index) in banner" :key="index" class="swiper-slide"
                             :style="{'background-image': 'url('+$store.state.imgHost+item.imgUrl+')'}"
                             @click="bannerClick(item.link)">
                            <!--<p v-text="obj.title"></p>-->
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
            </div>
            <div class="v2-sections" v-show="modules.length>=3&&modules.length<=5">
                <div v-for="(item,index) in modules" :class="['num'+modules.length,'div'+index]"
                     v-if="modules.length==3" @click="index==0?gotoOnline():jump(item.url)">
                    <div :class="{'two':index==1,'three':index==2}">
                        <div class="icon-container">
                            <i :class="[item.icon?item.icon:'usericon-webicon-01',{'usericon-webicon-48':index==0}]"></i>
                        </div>
                        <div :class="{'right':index!=0}">
                            <h2>{{item.title}}</h2>
                            <p>{{item.desc}}</p>
                        </div>
                    </div>
                </div>
                <div v-for="(item,index) in modules" :class="['num'+modules.length,'div'+index]"
                     v-if="modules.length==4" @click="index==0?gotoOnline():jump(item.url)">
                    <div :class="{'one':index==0,'two':index==1,'three':index==2,'four':index==3}">
                        <div class="icon-container">
                            <i :class="item.icon?item.icon:'usericon-webicon-01'"></i>
                        </div>
                        <div class="right">
                            <h2>{{item.title}}</h2>
                            <p>{{item.desc}}</p>
                        </div>
                    </div>
                </div>

                <div v-for="(item,index) in modules" :class="['num'+modules.length,'div'+index]"
                     v-if="modules.length==5" @click="index==0?gotoOnline():jump(item.url)">
                    <div :class="{'one':index==0,'two':index==1,'three':index==2,'four':index==3,'five':index==4}">
                        <div class="icon-container">
                            <i :class="item.icon?item.icon:'usericon-webicon-01'"></i>
                        </div>
                        <div class="right">
                            <h2>{{item.title}}</h2>
                            <p v-show="index==0">{{item.desc}}</p>
                        </div>
                    </div>
                </div>

            </div>
            <div class="v2-more-sections" ref="scrollWrapper">
                <ul ref="sectionWrapper">
                    <li v-for="(item,index) in baokao" :class="'bg'+index"
                        @click="$router.push('/articleList?catId='+item.id)">
                        <div>
                            <i :class="item.icon?item.icon:'usericon-webicon-01'"></i>
                            <h3 v-text="item.title"></h3>
                        </div>
                    </li>
                </ul>
            </div>


            <div id="slider-wrapper">
                <Slider>
                    <div class="fastNews">
                        <ul>
                            <li v-for="(item,index) in newsList"
                                @click="goToDetail(item.contentLink,item.infoId,newsCatId)">
                                <div class="img-container" v-if="item.img">
                                    <img :src="$store.state.imgHost+item.img">
                                </div>
                                <div :class="['text-container',{'noImg':!item.img}]">
                                    <i class="icon-lingdang-v2" v-if="!item.isRead"></i>
                                    <div class="title">
                                        {{item.name}}
                                    </div>

                                    <div class="release-time">
                                        <span :style="{backgroundColor:$store.state.themeColor}"
                                              v-text="getYear(item.date)"></span>
                                        <span :style="{backgroundColor:$store.state.themeColor}"
                                              v-text="getMonthAndDay(item.date)"></span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="see-more" @click="$router.push('/articleList?catId='+newsCatId)">
                            查看更多
                        </div>
                    </div>
                    <div class="noticeBoard">
                        <ul>
                            <li v-for="(item,index) in noticeList"
                                @click="goToDetail(item.contentLink,item.infoId,item.catId)">
                                <div class="img-container" v-if="item.img">
                                    <img :src="$store.state.imgHost+item.img">
                                </div>
                                <div :class="['text-container',{'noImg':!item.img}]">
                                    <i class="icon-lingdang-v2" v-if="!item.isRead"></i>
                                    <div class="title">
                                        {{item.title}}
                                    </div>

                                    <div class="release-time">
                                        <span :style="{backgroundColor:$store.state.themeColor}"
                                              v-text="getYear(item.date)"></span>
                                        <span :style="{backgroundColor:$store.state.themeColor}"
                                              v-text="getMonthAndDay(item.date)"></span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="see-more" @click="$router.push('/noticeList?name=招录公告')">
                            查看更多
                        </div>
                    </div>
                    <div class="vedios">
                        <ul>
                            <li v-for="(item,index) in video">
                                <div class="vedio-container" @click="bannerClick(item.vidoUrl)">
                                    <div class="bg-img"
                                         :style="{'background':'url('+$store.state.imgHost+item.imgUrl+') 0 0 no-repeat','background-size':'100% 100%'}">

                                    </div>
                                    <img src="../../img/play.png" alt="">
                                    <div class="mask">
                                        <h3>{{item.title}}</h3>
                                        <p>{{item.desc}}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>


                        <div class="see-more" @click="$router.push('/videoList')">
                            查看更多
                        </div>
                    </div>
                </Slider>
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
        <Move v-if="Number(showMove)" :top="top" :height="height" @close="closeMove"></Move>
    </div>
</template>
<script type="text/javascript">

    import BScroll from 'better-scroll'
    import "./css/index_v3.scss"
    import {
        mapActions
    } from "vuex"
    import piwik from '../../utils/piwik.js'
    import Move from './move.vue'
    import Slider from './slider.vue'
    import count from '../../utils/count.js'
    import cutUid from '../../utils/cutUid.js'
    import urlAddToken from '../../utils/urlAddToken.js'

    export default {
        data() {
            return {
                newsList: [],
                newsCatId: '',
                noticeList: [],
                banner: [],
                baokao: [],
                video: [],
                top: '50%',
                height: 0,
                showMove: localStorage.getItem('zndy_showMove'),
                modules: [],
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
                    //location.href = state.talkHost + '/users?id=' + user.id + '&sCode=' + state.scode + '&name=' + user.nickName + '&professor=' + state.scholl.professor + '&school=' + state.scholl.name;
//                    location.href = '/robot.html?scode=' + state.scode;
//                    location.href = state.talkHost + '/users?id=' + user.id + '&sCode=' + state.scode + '&name=' + user.nickName + '&professor=' + state.scholl.professor + '&school=' + state.scholl.name
                    location.href = 'http://robot.zhinengdayi.com:3000/users?source=1&id=' + user.id + '&sCode=' + state.scode + '&name=' + user.nickName + '&professor=' + state.scholl.professor + '&school=' + state.scholl.name;
                } else {
                    localStorage.needOpen=1;
                    this.$router.push('/login')
                }
            },
            getTop: function (elem) {
                var sum = elem.offsetTop;
                //反复判断elem的offsetParent不等于null,
                while (elem.offsetParent) {
                    //将elem.offsetParent的offsetTop累加到sum上
                    sum += elem.offsetParent.offsetTop;
                    elem = elem.offsetParent;//将elem换成elem的offsetParent
                }//(遍历结束)
                return sum;//返回sum
            },
            closeMove: function () {
                this.showMove = false;
                localStorage.setItem('zndy_showMove', 0);
            },
            jump(url) {
                window.location.href = url;
            },
            goToDetail: function (link, infoId, catId) {
                if (link) {
                    window.location.href = link;
                } else {
                    this.$router.push('/articleDetail?infoId=' + infoId + '&catId=' + catId)
                }
            }
        },
        components: {
            Move, Slider
        },
        created() {
            var state = this.$store.state




//            if(localStorage.user&&localStorage.needOpen==1){
//                localStorage.needOpen=2;
//                var user = JSON.parse(localStorage.user)
//
//                location.href = 'http://robot.zhinengdayi.com:3000/users?id=' + user.id + '&sCode=' + state.scode + '&name=' + user.nickName + '&professor=' + state.scholl.professor + '&school=' + state.scholl.name;
//
//            }








            if (localStorage.zndy_showMove === null) {
                localStorage.setItem('zndy_showMove', 1);
            }
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

                        sessionStorage.setItem('isLogin',1);

                    }, err => {
                        console.log(err)
                    })



                /***************************进入首页时携带uid的话就直接关注该学校**********************/
                this.$http.post(state.host + state.baseUrl + '/school/addSubSchool',{
                    userId: localStorage.uid,
                    schoolCode: state.scode
                },{
                    emulateJSON: true
                })


                /*********************************************************************************/



            }

            /*********************************积木板块的接口*******************************/
//            this.$http.get(state.host + state.baseUrl + '/quickEntry/getQuickEntry' + '?sCode=' + state.scode)
//                .then(res => {
//                    console.log(res);
//                })
            this.$http.get(state.host + state.baseUrl + '/index/getQuickEntry' + '?sCode=' + state.scode)
                .then(res => {
                    this.modules = res.data.data;
                })


            /*********************************************************************************/

            this.$http.get(state.host + state.baseUrl + '/infoContent/commonQuery?sCode=' + state.scode + '&icontentType=-2&catSize=1&infoSize=3')
                .then(res => {
                    this.newsList = res.data.data[0].children;
                    this.newsCatId = res.data.data[0].catId

                    setTimeout(function(){
                        var currentItem=document.getElementsByClassName('slider-item')[0];
                        var currentItemHeight=currentItem.offsetHeight;
                        document.getElementsByClassName('slider-group')[0].style.height=currentItemHeight+'px';

                        var linkHeight=document.getElementsByClassName('section-links')[0].offsetHeight;
                        document.getElementById('slider-wrapper').style.height=(currentItemHeight+linkHeight)+'px'
                    },60);



                }, err => {
                    console.log(err)
                })
            var userId = ''
            var login = '&login=' + false
            localStorage.setItem(this.infoId, this.infoId)
            if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
                userId = '&userId=' + JSON.parse(localStorage.user).id
                login = '&login=' + true
            }
            //以下请求放到了noticeBoard.vue里面
            this.$http.get(state.host + state.baseUrl + '/index/noticeList?sCode=' + state.scode + userId)
                .then(res => {
                    this.noticeList = res.data.data
                }, err => {
                    console.log(err)
                })
            this.$http.get(state.host + state.baseUrl + '/index/getBaseInfo?sCode=' + state.scode + userId + login)
                .then(res => {
                    var data = res.data.data
                    this.banner = data.banner
                    this.baokao = data.baokao
                    this.video = data.video;
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
                        pagination: '.swiper-pagination',
                        slidesPerView: 1,
                        paginationClickable: true,
                        spaceBetween: 0,
                        loop: true,
                        autoplay: 2000,
                        autoplayDisableOnInteraction: false,
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


//                    alert('state.allSchoolInfo.name:'+state.allSchoolInfo.name+' '+'state.allSchoolInfo.professor:'+state.allSchoolInfo.professor+' state.allSchoolInfo.schoolIcon:'+state.allSchoolInfo.schoolIcon)
//                    alert('去掉uid后的url为：'+_this.cutUidUrl);
//                    alert('sessionStorage中的spreadToken为：'+sessionStorage.spreadToken);
//                    alert('分享链接为：' + _this.cutUidUrl)
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
                            link:_this.cutUidUrl,

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


        },
        updated() {


            if (this.$refs.sectionWrapper) {
                var aLi = this.$refs.sectionWrapper.getElementsByTagName('li');
                if (aLi[0]) {
                    var liHeight = parseFloat(getComputedStyle(aLi[0]).height);
                    var paddingTop = parseFloat(getComputedStyle(this.$refs.sectionWrapper).paddingTop);
                    this.height = liHeight + paddingTop * 2 + 'px';
                    this.top = this.getTop(this.$refs.sectionWrapper) + 'px';
                    var liWidth = parseFloat(getComputedStyle(aLi[0]).width);
                    var ml = parseFloat(getComputedStyle(aLi[0]).marginLeft);
                    this.$refs.sectionWrapper.style.width = liWidth * aLi.length + ml * (aLi.length + 1) + 'px';

                    this.sectionScroll = new BScroll(this.$refs.scrollWrapper, {
                        scrollX: true,
                        eventPassthrough: 'vertical',
                        click: true
                    })
                }
            }

        }
    }
</script>
<style lang="scss" scoped>


</style>