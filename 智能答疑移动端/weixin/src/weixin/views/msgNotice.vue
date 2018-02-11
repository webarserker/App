<template>
    <div>
        <!-- 面包屑 -->
        <div class="path breadPath">
            <i :style="{color: $store.state.themeColor}" class="comicon-17 icon1-return" @click="$router.push('/')"></i>
            <!--<a :style="{color: $store.state.themeColor}" href="javascript:void(0);" @click="$router.push('/')">首页</a>-->
            <!--<i class="comicon-07 icon1-link"></i>-->
            <span>招办回复</span>
        </div>
        <div class="container" v-scroll="scrollHandle">

            <div class="emp_60"></div>
            <div class="msgNotice_items">
                <div :class="idx==activeId?'msgNotice_item active':'msgNotice_item'" @click="changeItem(idx,list.length)"
                     v-for="(x,idx) of list">
                    <div class="title">
                        <span :class="x.isRead==1?'read':'unread'" v-text="x.isRead==0?'[未读]':'[已读]'"></span>
                        <p v-text="x.title"></p>
                    </div>
                    <div class="content">
                        <span>招办回复：</span>
                        <p v-text="x.content"></p>
                        <i :class="idx==activeId?'':'iconfont comicon-28'"></i>
                    </div>
                </div>
            </div>
            <div v-if="list.length==0" class="noMsg">
                暂无消息
            </div>
            <!--<v-loading v-show="ajaxFlag" :endFlag="endFlag"></v-loading>-->
        </div>



    </div>



</template>
<script type="text/javascript">
    import "../css/msgNotice.scss"
    import count from '../utils/count.js'
    import urlAddToken from '../utils/urlAddToken.js'

    export default {
        data() {
            return {
                list: [],
                curPage: 1,
                ajaxFlag: false,
                endFlag: false,
                activeId: 0
            }
        },
//        watch: {
//            activeId: function () {
//                this.readMsg()
//            }
//        },
        created() {
            var state = this.$store.state
            document.title = state.allSchoolInfo.name + '-消息'


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
            }







            // this.$store.commit('CHANGE_LOADINGFLAG', true)
            this.getDate()




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
                            title: state.allSchoolInfo.name + '-' + '消息', // 分享标题
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
                            title: state.allSchoolInfo.name + '-' + '消息', // 分享标题
                            desc: '招办回复', // 分享描述
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
        methods: {
            changeItem: function (idx) {
                this.activeId = idx;
                var item = this.list[idx]
                item.isRead = 1
                this.$set(this.list, idx, item)

                this.readMsg()

            },
            scrollHandle: function (e) {
                var h = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
                if (h < 10) {
                    if (this.endFlag) return;
                    this.getDate()
                }
            },
            gotoDetail: function (id, catId) {
                this.$router.push('/articleDetail?infoId=' + id + '&catId=' + catId)
            },
            getDate: function () {
                if (this.ajaxFlag) return;
                this.ajaxFlag = true
                var state = this.$store.state
                this.$http.get(state.host + state.baseUrl + '/user/findMessageInfoList?schoolCode=' + state.scode + '&curPage=' + this.curPage + '&pageSize=10&userId=' + JSON.parse(localStorage.user).id)
                    .then(res => {
                        this.list = this.list.concat(res.data.data)
                        if (res.data.data.length < 10) {
                            this.endFlag = true
                            return;
                        }
                        if (this.curPage == 1) {
                            this.readMsg()
                            this.changeItem(0)
                        }
                        this.ajaxFlag = false
                        this.curPage += 1
                        // setTimeout(() => {
                        //     this.$store.commit('CHANGE_LOADINGFLAG', false)
                        // }, 1000)
                    }, err => {
                        console.log(err)
                        // this.$store.commit('CHANGE_LOADINGFLAG', false)
                    })
            },
            readMsg: function () {
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/user/updateMessageToRead'
                var data = {
                    messageId: this.list[this.activeId].id
                }
                this.$http.post(url, data, {
                    emulateJSON: true
                }).then(
                    res => {
                        // console.log(res)
                    }, err => {
                        console.log(err)
                    }
                )
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
        }
    }
</script>
<style lang="scss" scoped>
    .breadPath {
        z-index: 99999;
    }

    .noMsg {
        text-align: center;
        color: #999;
    }
</style>
