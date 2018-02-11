<template>
    <div>
        <!-- 面包屑 -->
        <div class="path">
            <i :style="{color: $store.state.themeColor}" class="comicon-17 icon1-return" @click="$router.push('/')"></i>
            <!--<a :style="{color: $store.state.themeColor}" href="javascript:void(0);" @click="$router.push('/')">首页</a>-->
            <!--<i class="comicon-07 icon1-link"></i>-->
            <span>留言咨询</span>
        </div>
        <div class="container">
            <div class="emp_60"></div>
            <div class="sendQuestion_container">
                <p>请输入你要咨询的问题</p>
                <textarea placeholder="请描述你想要咨询的问题" v-model="questionMsg"></textarea>
                <button :style="{background: $store.state.themeColor,opacity:this.questionMsg.length>0?1:0.5}"
                        @click="btnAction">提交
                </button>
            </div>
            <div v-show="endMsg" class="endMsg">发送成功</div>
        </div>

    </div>

</template>
<script type="text/javascript">
    import "../css/sendQuestion.scss"
    import count from '../utils/count.js'

    export default {
        data() {
            return {
                questionMsg: '',
                timer: null,
                endMsg: false,
            }
        },
        methods: {
            btnAction: function () {
                this.endMsg = false
                clearTimeout(this.timer)
                if (this.questionMsg.length == 0) return;
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/user/saveAnsweringLog'
                var user = JSON.parse(localStorage.user)
                var question = this.questionMsg
                this.questionMsg = ''
                var data = {
                    schoolCode: state.scode,
                    forwordUser: user.id,
                    creator: user.creator,
                    question: question
                }
                this.$http.post(url, data, {
                    emulateJSON: true
                }).then(res => {
                    this.endMsg = true
                    this.timer = setTimeout(() => {
                        this.endMsg = false
                    }, 1500)
                }, err => {
                    console.log(err)
                })
            }
        },
        created() {
            var state = this.$store.state
            document.title = state.scholl.name + '-咨询'

        },
        mounted() {
            var _this = this;
            setTimeout(() => {
                count(remote_ip_info.province, remote_ip_info.city, localStorage.scode, location.href, null, null, _this.$store.state.viewSourceUrl).then(res => {
                });
            }, 1000)


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
                            title: state.allSchoolInfo.name + '-' + '留言咨询', // 分享标题
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
                            title: state.allSchoolInfo.name + '-' + '留言咨询', // 分享标题
                            desc: '留言咨询', // 分享描述
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

    import urlAddToken from

    '../utils/urlAddToken.js'

    .endMsg {
        position: fixed;
        left: 0;
        right: 0;
        top: 50%;
        margin: 0 auto;
        background: rgba(0, 0, 0, .5);
        color: #fff;
        font-size: pxToRem(30);
        text-align: center;
        width: pxToRem(200);
        height: pxToRem(44);
        line-height: pxToRem(44);
    }
</style>
