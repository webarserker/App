<template>
    <div class="home-container">
        <div class="normalQuestion_item" v-for="(obj,f_idx) of titleList">
            <div v-if="f_idx==first_idx">
                <div class="normalQuestion_title active" :style="{color: $store.state.themeColor}"
                     @click="titleTap(f_idx,obj.catId)">
                    <span v-text="obj.name"></span>
                    <i class="iconfont comicon-16"></i>
                </div>
                <div class="normalQuestion_list" v-for="x of articleList" @click="goToDetail(x.infoId)">
                    <span></span>
                    <div class="normalQuestion_text" v-text="x.title"></div>
                    <i class="iconfont comicon-28"></i>

                </div>
            </div>
            <div v-else>
                <div class="normalQuestion_title" @click="titleTap(f_idx,obj.catId)">
                    <span v-text="obj.name"></span>
                    <i class="iconfont comicon-15"></i>
                </div>
            </div>
        </div>
        <div class="emp_60"></div>
    </div>
</template>
<script type="text/javascript">
    import "../css/normalQuestion.scss"
    import count from '../utils/count.js'
    import urlAddToken from '../utils/urlAddToken.js'

    export default {
        updated() {

        },
        data() {
            return {
                first_idx:sessionStorage.getItem('firstIdx')||0,
                titleList: [],
                articleList: [],
                catId: 0,
            }
        },
        computed: {
            contentType: function () {
                return this.$route.query.contentType
            }
        },
        watch: {
            contentType: function () {
                this.getInit()
            }
        },
        methods: {
            getInit: function () {
                this.$store.commit('CHANGE_FOOTERTAB', this.contentType == 2 ? 1 : 3)
                var state = this.$store.state
                this.$http.get(state.host + state.baseUrl + '/infoCat/getInfoCatListbyType?sCode=' + state.scode + '&contentType=' + this.contentType)
                    .then((res) => {
                        // console.log(res.body.data)
                        this.titleList = res.body.data
                        if(this.titleList){
                            this.catId = this.titleList[0].catId
                        }

                        this.getArticleList()
                        setTimeout(() => {
                            this.$store.commit('CHANGE_LOADINGFLAG', false)
                        }, 1000)
                    }, (res) => {
                        console.log(res)
                        this.$store.commit('CHANGE_LOADINGFLAG', false)
                    })
            },
            getArticleList: function () {
                var state = this.$store.state
                this.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentlist?catId=' + this.catId + '&curPage=1')
                    .then((res) => {
                        this.articleList = res.body.data
                    }, (res) => {
                        console.log(res)
                    })
            },
            titleTap: function (idx, catId) {
                if (this.first_idx == idx) {
                    this.first_idx = -1;
                    return;
                }
                this.first_idx = idx
                this.catId = catId
                sessionStorage.setItem('firstIdx',this.first_idx);

                this.getArticleList()
            },
            goToDetail: function (id) {
                this.$router.push('/articleDetail?catId=' + this.catId + '&infoId=' + id + '&contentType=' + this.contentType)
            }
        },
        mounted() {
            this.getInit()
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
                            title: state.allSchoolInfo.name + '-' + '常见问题', // 分享标题
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
                            title: state.allSchoolInfo.name + '-' + '常见问题', // 分享标题
                            desc: '点击查看常见问题', // 分享描述
//                    desc:urlAddToken(window.location.href),
//                                link: state.currentHref, // 分享链接
                            link:(window.location.href.split('#')[0]+'&redirectUrl='+encodeURIComponent(urlAddToken(window.location.href))).replace('/build/index.html','/weixin/index'),
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
        created() {
            this.$store.commit('CHANGE_LOADINGFLAG', true)
            var state = this.$store.state
            document.title = state.allSchoolInfo.name
        }
    }
</script>
