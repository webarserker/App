<template>
    <div class="home-container" v-scroll="scrollHandle">
        <div class="search">
            <div class="search_header" :style="{borderBottom:'1px solid '+$store.state.themeColor}">
                <input type="text" class="search_inp" placeholder="请输入搜索" v-model="inpVal"/>
                <span v-show="!showVoice" @click="showVoice=true;inpVal='';list=[];"
                      class="iconfont comicon-26 speech_inp_icon" :style="{color:$store.state.themeColor}"></span>
                <button class="search_btn" :style="{background:$store.state.themeColor}" @click="searchAction">搜索
                </button>
            </div>
            <ul class="search_content">
                <li v-for="(val,idx) in list" v-if="val.title.length>0" class="search_item"
                    @click="gotoDetail(val.infoId,val.catId)">
                    <span class="search_item_order">{{idx + 1}}、</span>
                    <span class="search_item_con" v-html="val.title"></span>
                    <span class="search_item_more iconfont comicon-28"></span>
                </li>
            </ul>

            <div class="list-none" v-show="list.length==0&&inpVal&&endFlag">
                没有找到您要的内容
            </div>

            <div v-show="showVoice" class="search_voice_box">
                <p>{{tip}}</p>
                <span class="cancel" @click="saying=false;showVoice=false;">取消</span>
                <div class="left_ani">
                    <b v-for="i of 9"
                       :style="{background: $store.state.themeColor,animation:saying?'ani .9s infinite':''}"></b>
                </div>
                <i class="comicon-26 icon"
                   :style="{color:saying?'#fff':$store.state.themeColor,background:!saying?'#fff':$store.state.themeColor,border:'1px solid '+$store.state.themeColor}"
                   @touchstart.stop.prevent="sayingStart" @touchend.stop.prevent="sayingEnd"></i>
                <div class="right_ani">
                    <b v-for="i of 9"
                       :style="{background: $store.state.themeColor,animation:saying?'ani .9s infinite':''}"></b>
                </div>
                <span class="ensure" @click="saying=false;showVoice=false;searchAction()">确定</span>
            </div>
            <v-loading v-show="ajaxFlag" :endFlag="endFlag"></v-loading>
        </div>
    </div>
</template>
<script type="text/javascript">
    import "../css/search.scss";
    import count from '../utils/count.js'
    import urlAddToken from '../utils/urlAddToken.js'

    export default {
        created() {

            document.title = this.$store.state.allSchoolInfo.name + '-搜索'

        },
        data() {
            return {
                tip: '',
                showVoice: false,
                inpVal: "",
                saying: false,
                list: [],
                endFlag: false,
                ajaxFlag: false,
                curPage: 1,
            }
        },
        watch: {
            inpVal: function () {
                this.curPage = 1;
                this.searchAction();
            }
        },
        methods: {
            sayingStart: function () {
                this.saying = true

//                this.play()


                wx.startRecord();
            },
            sayingEnd: function () {
                this.saying = false
//                this.session.stop()


                var _this = this;

                wx.stopRecord({
                    success: function (res) {
                        var localId = res.localId;
                        wx.translateVoice({
                            localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
//                alert(res.translateResult); // 语音识别的结果
                                var result = res.translateResult;
                                if (!result) {
                                    _this.tip = '抱歉，没有识别出您的语音';
                                    result = '';
                                } else {
                                    _this.tip = '';
                                }

                                _this.inpVal += result;

                            }
                        });

                    },
                    fail: function () {
                        alert('录音失败')
                    }
                });
            },
            searchAction: function (e, f) {
                // if (this.ajaxFlag) return;
                if (!f) {
                    this.list = []
                }
                this.ajaxFlag = true
                this.endFlag = false
                var state = this.$store.state
                this.$http.get(state.host + state.baseUrl + '/infoContent/quikQueryInfoTitle?sCode=' + state.scode + '&pageSize=20&curPage=' + this.curPage + '&question=' + this.inpVal)
                    .then(res => {
                        var data = res.data.data
                        if (data == null ||this.inpVal==null|| this.inpVal.length == 0) {
                            this.ajaxFlag = false
                        } else {
                            if (data.length == 0) {
                                this.endFlag = true
                                // this.ajaxFlag = true
                            } else {
                                if (f) {
                                    this.list = this.list.concat(data)
                                } else {
                                    this.list = data
                                }
                                this.ajaxFlag = false
                            }
                        }
                    }, err => {
                        console.log(err)
                        this.ajaxFlag = false
                    })
            },
            scrollHandle: function (e) {
                if (this.ajaxFlag || this.inpVal.length == 0) return;
                var h = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
                if (h < 100) {
                    this.curPage += 1
                    this.searchAction(e, true)
                }
            },
            gotoDetail: function (id, cid) {
                sessionStorage.setItem('inpVal', this.inpVal);
                this.$router.push('/articleDetail?infoId=' + id + '&catId=' + cid)
            }
        },
        updated() {
            var state = this.$store.state
            document.title = state.allSchoolInfo.name + '-搜索'
        },
        mounted() {
            this.inpVal = sessionStorage.getItem('inpVal')
            if (this.inpVal) {
                this.searchAction();

            }


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
                            title: state.allSchoolInfo.name + '-' + '搜索', // 分享标题
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
                            title: state.allSchoolInfo.name + '-' + '搜索', // 分享标题
                            desc: '点击查看首页', // 分享描述
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
        components: {
            "v-loading": require('../component/Loading.vue'),
        },
        computed: {
            searList() {
                var arr = []
                var that = this
                if (this.inpVal) {
                    this.list.forEach((val, idx) => {
                        var inpVal = this.inpVal
                        if (val.title.indexOf(inpVal) != -1) {
                            var tempItem = val.title.split(inpVal);
                            arr.push(tempItem.join("<span style='color:" + that.$store.state.themeColor + "'>" + inpVal + "</span>"))
                        }
                    })
                }
                return arr;
            }
        }

    }
</script>
