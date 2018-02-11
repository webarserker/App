<template>
    <div>
        <div class="second_navs" :style="{'border-bottom': '2px solid '+$store.state.themeColor}">
            <span>
                {{$route.query.name}}
            </span>
        </div>
        <div class="article_list top3" v-scroll="scrollHandle" ref="article_list">
            <div class="article_link" v-for="(x,idx) in subConData" @click="gotoDetail(x.contentLink,x.infoId,x.catId)">
                <span v-text="x.title"></span>
                <i class="iconfont comicon-28"></i>
            </div>
            <v-loading v-show="ajaxFlag" :endFlag="endFlag"></v-loading>
        </div>
    </div>

</template>
<script type="text/javascript">
    import count from '../utils/count.js'
    import urlAddToken from '../utils/urlAddToken.js'

    export default {
        updated() {

        },
        data() {
            return {
                curPage: 1,
                subConData: [],
                endFlag: false,
                ajaxFlag: false
            }
        },
        computed: {},
        created() {
            this.$store.commit('CHANGE_LOADINGFLAG', true)
            this.getDate()
            var state = this.$store.state
            document.title = state.scholl.name
        },
        methods: {
            scrollHandle: function (e) {
                var h = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
                if (h < 10) {
                    if (this.endFlag) return;
                    this.getDate()
                }
            },
            gotoDetail: function (link, id, catId) {
                if (link) {
                    window.location.href = link;
                } else {
                    this.$router.push('/articleDetail?infoId=' + id + '&catId=' + catId)
                }
            },
            getDate: function () {
                if (this.ajaxFlag) return;
                this.ajaxFlag = true
                var state = this.$store.state
                this.$http.get(state.host + state.baseUrl + '/index/noticeList?sCode=' + state.scode + '&curPage=' + this.curPage + '&pageSize=20')
                    .then(res => {
                        // console.log(res.data.data)
                        setTimeout(() => {
                            this.$store.commit('CHANGE_LOADINGFLAG', false)
                        }, 1000)
                        this.subConData = this.subConData.concat(res.data.data)
                        console.log('招录公告列表页面\n', this.subConData);
                        if (res.data.data.length < 20) {
                            this.endFlag = true
                            return;
                        }
                        this.curPage += 1
                        this.ajaxFlag = false
                    }, err => {
                        console.log(err)
                        this.$store.commit('CHANGE_LOADINGFLAG', false)
                    })
            }
        },
        components: {
            "v-loading": require('../component/Loading.vue')
        },
        mounted() {
            var _this = this;
            setTimeout(() => {
                count(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, null, null, _this.$store.state.viewSourceUrl).then(res => {
                });
            }, 1000)


            var state = this.$store.state;
            var _this = this;


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
                            title: state.allSchoolInfo.name + '-' + _this.$route.query.name, // 分享标题
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
                            title: state.allSchoolInfo.name + '-' + _this.$route.query.name, // 分享标题
                            desc: '点击查看' + _this.$route.query.name, // 分享描述
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
        }
    }
</script>
<style lang="scss" scoped>
    @import "../css/common.scss";

    .top3 {
        top: pxToRem(180);
    }

    .second_navs span {
        padding: 0 pxToRem(35);
        font-size: pxToRem(30);
    }
</style>
