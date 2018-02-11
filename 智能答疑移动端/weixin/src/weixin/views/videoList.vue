<template>
    <div>
        <!-- 面包屑 -->
        <div class="path" style="z-index: 999">
            <i :style="{color: $store.state.themeColor}" class="comicon-17 icon1-return" @click="$router.push('/')"></i>
            <a :style="{color: $store.state.themeColor}" href="javascript:void(0);" @click="$router.push('/')">首页</a>
            <i class="comicon-07 icon1-link"></i>
            <span>视频列表</span>
        </div>
        <div class="container" v-scroll="scrollHandle">
            <div class="emp_60"></div>
            <div class="videoList_items">
                <div class="videoList_item" v-for="(obj,idx) of videoList" @click="gotoVideo(obj.vidoUrl)">
                    <div class="left">
                        <img :src="$store.state.imgHost+obj.imgUrl">
                        <img src="../img/play.png">
                    </div>
                    <div class="right">
                        <h3 :style="{color:$store.state.themeColor}" v-text="obj.title"></h3>
                        <p v-text="obj.desc"></p>
                    </div>
                </div>
                <v-loading :endFlag="endFlag" :showEnd="ajaxFlag"></v-loading>
            </div>
        </div>
    </div>

</template>
<script type="text/javascript">
    import "../css/videoList.scss"
    import count from '../utils/count.js'
    import urlAddToken from '../utils/urlAddToken.js'

    export default {
        data() {
            return {
                videoList: [],
                curPage: 1,
                endFlag: false,
                ajaxFlag: false
            }
        },
        components: {
            "v-loading": require('../component/Loading.vue')
        },
        created() {
            this.$store.commit('CHANGE_LOADINGFLAG', true)
            var state = this.$store.state
            document.title = state.scholl.name + '-视频列表'


        },
        methods: {
            gotoVideo: function (link) {
                if (link != '' && link != null) {
                    if (link.substr(0, 4) != 'http') {
                        link = this.$store.state.imgHost + link;
                    }
                    location.href = link
                }
            },
            getData: function () {
                if (this.ajaxFlag) return;
                this.ajaxFlag = true
                var state = this.$store.state
                var _this = this;
                var url = state.host + state.baseUrl + '/schoolVidoList/getSchoolVidoList?sCode=' + state.scode + '&curPage=' + this.curPage
                setTimeout(() => {
                    this.$http.get(url)
                        .then(res => {
                            var data = res.data.data
                            this.videoList = this.videoList.concat(res.data.data)
                            if (data.length < 10) {
                                this.endFlag = true
                            } else {
                                this.curPage += 1
                                // this.videoList = Object.assign(this.videoList,res.data.data)
                                this.ajaxFlag = false
                            }
                            setTimeout(() => {
                                this.$store.commit('CHANGE_LOADINGFLAG', false)
                            }, 1000)


                            setTimeout(() => {
                                count(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, null, null, _this.$store.state.viewSourceUrl).then(res => {
                                });
                            }, 1000)

                        }, err => {
                            console.log(err)
                            this.$store.commit('CHANGE_LOADINGFLAG', false)
                        })
                }, state.timeout)
            },
            scrollHandle: function (e) {
                var h = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
                // console.log(h)
                if (h < 100) {
                    this.getData()
                }
            }
        },
        mounted() {
            this.getData()


            var state = this.$store.state;


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

                    wx.ready(function () {
                        wx.onMenuShareTimeline({
                            title: state.allSchoolInfo.name + '-' + '视频列表', // 分享标题
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
                            title: state.allSchoolInfo.name + '-' + '视频列表', // 分享标题
                            desc: '视频列表', // 分享描述
//                    desc:urlAddToken(window.location.href),
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
        },
    }
</script>
