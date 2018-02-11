<template>
    <div class="schListCollected">
        <!--高考招录-->
        <div class="listSet" v-if="normalSchList.length!=0">
            <div class="listTit" v-on:click="switchSetOne" id="listTit1">
                <div class="plr-30"><span class="line"></span>高考招录<i class="comicon-28" :class="{up: switch1}"></i>
                </div>
            </div>
            <ul class="list" v-show="switch1">
                <li class="item" v-for="(obj,idx) of normalSchList" :class="{last: idx==(normalSchList.length-1) }"
                    @click="gotoSchool(obj.schoolCode)">
                    <div class="row">
                        <span class="col1"><img :src="$store.state.imgHost+obj.yrScholar"/></span>
                        <div class="col2">
                            <div>
                                <div class="schName">
                                    <span v-text="obj.name"></span>
                                    <div class="attribute" v-if="obj.recruitTypeList.length == 2">
                                        <span class="attr1"
                                              :class="{'gray': obj.recruitTypeList[0].status=='10'}">高招</span>
                                        <span class="attr2"
                                              :class="{'gray': obj.recruitTypeList[1].status=='10'}">研招</span>
                                    </div>
                                </div>
                                <div class="col22">
                                    <div class="left">
                                        <div class="schTyp">
                                            <span v-text="obj.type"></span> <span v-if="obj.type&&obj.property">|</span> <span
                                                v-text="obj.property"></span>
                                        </div>
                                        <div class="schDepart" v-text="obj.belongDepart"></div>
                                    </div>
                                    <span class="right btn btn-done" v-on:click.stop="cancelSubSch(obj, normalSchList)"><i
                                            class="comicon-33"></i>已关注</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="row" v-if="obj.platform">
                        <span class="col1">&nbsp;</span>
                        <div class="col2 border">
                            <div class="ellipsis"><i class="comicon-37 icon1-proTxt"></i>{{obj.platform}}</div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="noMore" v-show="switch1 && futureSchList.length==0 && schList.length==0">没有更多了...</div>
        </div>
        <!--研究生招录-->
        <div class="listSet" v-if="schList.length!=0">
            <div class="listTit" v-on:click="switchSetTwo" id="listTit2">
                <div class="plr-30"><span class="line"></span>研究生招录<i class="comicon-28" :class="{up: switch2}"></i>
                </div>
            </div>
            <ul class="list" v-show="switch2">
                <li class="item" v-for="(obj,idx) of schList" :class="{last: idx==(schList.length-1) }"
                    @click="gotoSchool(obj.schoolCode)">
                    <div class="row">
                        <span class="col1"><img :src="$store.state.imgHost+obj.yrScholar"/></span>
                        <div class="col2">
                            <div>
                                <div class="schName">
                                    <span v-text="obj.name"></span>
                                    <div class="attribute" v-if="obj.recruitTypeList.length == 2">
                                        <span class="attr1"
                                              :class="{'gray': obj.recruitTypeList[0].status=='10'}">高招</span>
                                        <span class="attr2"
                                              :class="{'gray': obj.recruitTypeList[1].status=='10'}">研招</span>
                                    </div>
                                </div>
                                <div class="col22">
                                    <div class="left">

                                        <div class="schTyp">
                                            <span v-text="obj.type"></span> <span v-if="obj.type&&obj.property">|</span> <span
                                                v-text="obj.property"></span>
                                        </div>
                                        <div class="schDepart" v-text="obj.belongDepart"></div>
                                    </div>
                                    <span class="right btn btn-done" v-on:click.stop="cancelSubSch(obj, schList)"><i
                                            class="comicon-33"></i>已关注</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="row" v-if="obj.platform">
                        <span class="col1">&nbsp;</span>
                        <div class="col2 border">
                            <div class="ellipsis"><i class="comicon-37 icon1-proTxt"></i>{{obj.platform}}</div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="noMore" v-show="switch2 && futureSchList.length==0">没有更多了...</div>
        </div>
        <!--即将上线系统-->
        <div class="listSet" v-if="futureSchList.length!=0">
            <div class="listTit" @click="switchSetThree" id="listTit3">
                <div class="plr-30"><span class="line"></span>即将上线系统<i class="comicon-28" :class="{up: switch3}"></i>
                </div>
            </div>
            <ul class="list" v-show="switch3">
                <li class="item" v-for="(obj,idx) of futureSchList" :class="{last: idx==(futureSchList.length-1) }"
                    :id="'anchor-'+obj.code" @click="gotoSchool(obj.schoolCode)">
                    <div class="row">
                        <span class="col1"><img :src="$store.state.imgHost+obj.yrScholar"/></span>
                        <div class="col2">
                            <div>
                                <div class="schName">
                                    <span v-text="obj.name"></span>
                                    <div class="attribute">
                                        <span class="attr1 gray"
                                              v-if="obj.recruitTypeList[0].recruitType == '0'">高招</span>
                                        <span class="attr2 gray"
                                              v-if="obj.recruitTypeList[0].recruitType == '1'">研招</span>
                                    </div>
                                </div>
                                <div class="col22">
                                    <div class="left">
                                        <div class="schTyp">
                                            <span v-text="obj.type"></span> <span v-if="obj.type&&obj.property">|</span> <span
                                                v-text="obj.property"></span>
                                        </div>
                                        <div class="schDepart" v-text="obj.belongDepart"></div>
                                    </div>
                                    <span class="right btn btn-done" v-on:click.stop="cancelSubSch(obj, futureSchList)"><i
                                            class="comicon-33"></i>已关注</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="row" v-if="obj.platform">
                        <span class="col1">&nbsp;</span>
                        <div class="col2 border">
                            <div class="ellipsis"><i class="comicon-37 icon1-proTxt"></i>{{obj.platform}}</div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="noMore" v-show="switch3">没有更多了...</div>
        </div>
        <div v-if="request1 && request2 && request3 && normalSchList.length==0 && schList.length==0 && futureSchList.length==0"
             class="noData">
            <div><i class="comicon-38 icon1-sorry"></i></div>
            <div class="text">抱歉！您还没有关注的高校哦~</div>
        </div>
        <div class="ajaxLoading">
            <div class="loadInner">
                <v-loading :endFlag="endFlag"></v-loading>
            </div>
        </div>
        <v-toast class="toast" :class="toast.type==1?toast.subStyle:toast.cancelStyle" :options=toast.options
                 :show="toast.show&&toast.type==1" @on-result-change="onToastResultChange">
            <div slot="tipIcon" class="left"><span class="iconWp"><i class="comicon-33"></i></span></div>
            <div slot="tip" class="right">
                <p class="tip">您已关注</p>
                <p>{{toast.options.content}}</p>
            </div>
        </v-toast>
        <v-toast class="toast" :class="toast.type==1?toast.subStyle:toast.cancelStyle" :options=toast.options
                 :show="toast.show&&toast.type==2" @on-result-change="onToastResultChange">
            <div slot="tipIcon" class="left"><span class="iconWp"><i class="comicon-34"></i></span></div>
            <div slot="tip" class="right">
                <p class="tip">您已取消关注</p>
                <p>{{toast.options.content}}</p>
            </div>
        </v-toast>
        <v-tip :options=tip.options :show=tip.show @on-result-change="onResultChange"></v-tip>
    </div>
</template>
<script type="text/javascript">
    import "../css/schListHeader.scss"
    import {mapActions} from "vuex"

    import urlAddToken from '../utils/urlAddToken.js'

    //import jquery from "jquery"

    export default {
        data() {
            return {
                switch1: true,
                switch2: true,
                switch3: true,
                normalSchList: [],//已关注高考招录学校列表
                schList: [],//已关注研究生招录学校列表
                futureSchList: [],//已关注即将上线学校列表
                ajaxFlag: false,
                request1: false,
                request2: false,
                request3: false,
                endFlag: true,
                tip: {
                    options: {
                        content: '',
                        autoClose: true
                    },
                    show: false
                },
                toast: {
                    options: {
                        content: '',
                        autoClose: true
                    },
                    show: false,
                    type: 1,
                    subStyle: 'subStyle',
                    cancelStyle: 'cancelStyle'
                },
                listPosition: [0, 0, 0]
            }
        },
        components: {
            'v-loading': require('../component/Loading.vue'),
            'v-tip': require('../component/tip.vue'),
            'v-toast': require('../component/toast.vue')
        },
        methods: {
            ...mapActions(['CHANGE_SCHLISTTAB']),
            ...mapActions(['CHANGE_SHOWFILTER']),
            switchSetOne: function () {
                this.switch1 = !this.switch1
            },
            switchSetTwo: function () {
                this.switch2 = !this.switch2
            },
            switchSetThree: function () {
                this.switch3 = !this.switch3
            },
            gotoSchool: function (code) {
                location.href = '/weixin/index?scode=' + code
            },
            //获取高考招录和研究生招录
            getSchListNormal: function () {
                var state = this.$store.state
                var url1 = state.host + state.baseUrl + '/school/findSubSchoolList?userId=' + localStorage.uid + '&isPostGraduate=0'
                var url2 = state.host + state.baseUrl + '/school/findSubSchoolList?userId=' + localStorage.uid + '&isPostGraduate=1'
                setTimeout(() => {
                    this.$http.get(url1, {
                        emulateJSON: true
                    })
                        .then(res => {
                            this.request1 = true
                            if (this.request1 && this.request2 && this.request3) {
                                this.endFlag = true
                            }
                            if (res.data.code == '000000') {
                                this.normalSchList = res.data.data.data
                            } else {
                                this.tip.options.content = res.data.message
                                this.tip.show = true
                            }
                        }, err => {
                            this.request1 = true
                            if (this.request1 && this.request12 && this.request3) {
                                this.endFlag = true
                            }
                            this.tip.options.content = '网络或系统繁忙...'
                            this.tip.show = true
                        })
                }, state.timeout)
                setTimeout(() => {
                    this.$http.get(url2, {
                        emulateJSON: true
                    })
                        .then(res => {
                            this.request2 = true
                            if (this.request1 && this.request2 && this.request3) {
                                this.endFlag = true
                            }
                            if (res.data.code == '000000') {
                                this.schList = res.data.data.data
                            } else {
                                this.tip.options.content = res.data.message
                                this.tip.show = true
                            }
                        }, err => {
                            this.request2 = true
                            if (this.request1 && this.request2 && this.request3) {
                                this.endFlag = true
                            }
                            this.tip.options.content = '网络或系统繁忙...'
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            //获取即将上线系统
            getFutureSchList: function () {
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/school/findToOnlineSubSchoolList?userId=' + localStorage.uid
                setTimeout(() => {
                    this.$http.get(url, {
                        emulateJSON: true
                    })
                        .then(res => {
                            this.request3 = true
                            if (this.request1 && this.request2 && this.request3) {
                                this.endFlag = true
                            }
                            this.futureSchList = res.data.data.data
                        }, err => {
                            this.request3 = true
                            if (this.request1 && this.request2 && this.request3) {
                                this.endFlag = true
                            }
                            this.tip.options.content = '网络或系统繁忙...'
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            //取消关注
            cancelSubSch: function (d, arr) {
                if (this.ajaxFlag) {
                    return
                }
                this.ajaxFlag = true
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/school/cancelSubSchool'
                var data = {
                    userId: localStorage.uid,
                    schoolCode: d.schoolCode
                }
                setTimeout(() => {
                    this.$http.post(url, data, {
                        emulateJSON: true
                    })
                        .then(res => {
                            //关注成功，按钮变成已关注的
                            if (res.data.code == '000000') {
                                var resultIndex
                                this.toast.type = 2
                                this.toast.options.content = d.name
                                this.toast.show = true
                                arr.find(function (value, index, arr) {
                                    if (value.identify == d.identify) {
                                        resultIndex = index
                                    }
                                })
                                arr.splice(resultIndex, 1)
                                this.$store.commit('CHANGE_COLLECTEDSCHNUM', state.collectedSchNum - 1)
                            } else {
                                this.tip.options.content = res.data.message
                                this.tip.show = true
                            }
                            this.ajaxFlag = false
                        }, err => {
                            this.tip.options.content = '网络或系统繁忙...'
                            this.tip.show = true
                            this.ajaxFlag = false
                        })
                }, state.timeout)
            },
            onScroll: function () {

            },
            onResultChange: function () {
                this.tip.show = false
            },
            onToastResultChange: function () {
                this.toast.show = false
            }
        },
        created: function () {
            this.getSchListNormal()
            this.getFutureSchList()
            //tab切换时，筛选条件重置为空
            this.$store.commit('CHANGE_FILTERPROVINCE', '')
            this.$store.commit('CHANGE_FILTERRECRUIT', '')
            this.$store.commit('CHANGE_FILTERSHCOOL', '')


        },
        mounted: function () {
            var me = this
            this.CHANGE_SCHLISTTAB(0)
            this.CHANGE_SHOWFILTER(false)
            this.endFlag = false
            /*setTimeout(function(){
                if(me.$el.querySelector('#listTit1')) {
                    me.listPosition[0] = me.$el.querySelector('#listTit1').offsetTop
                }
                if(me.$el.querySelector('#listTit2')) {
                    me.listPosition[1] = me.$el.querySelector('#listTit2').offsetTop - me.$el.querySelector('#listTit2').offsetHeight*2
                }
                if(me.$el.querySelector('#listTit3')) {
                    me.listPosition[2] = me.$el.querySelector('#listTit3').offsetTop - me.$el.querySelector('#listTit3').offsetHeight*3
                }
                me.$nextTick(function () {
                  window.addEventListener('scroll', me.onScroll)
                })
            },500) */


            var state = this.$store.state;

//
//            var url = state.host + state.baseUrl + '/getJsSign'
//            var data = {
//                url: location.href
//            }
//            this.$http.post(url, data, {
//                emulateJSON: true
//            })
//                .then(res => {
//                    // console.log(res.data)
//                    var data = res.data
//                    alert('appId为：'+data.appId+' signature为：'+data.signature)
//                    wx.config({
//                        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//                        appId: data.appId, // 必填，公众号的唯一标识
//                        timestamp: data.timestamp, // 必填，生成签名的时间戳
//                        nonceStr: data.nonce, // 必填，生成签名的随机串
//                        signature: data.signature, // 必填，签名，见附录1
//                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//                    });
//
//                    wx.ready(function () {
//                        wx.onMenuShareTimeline({
//                            title: state.allSchoolInfo.name + '-' + '高校列表', // 分享标题
//                            //link: state.currentHref, // 分享链接
//                            imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
//                            success: function () {
//                                // 用户确认分享后执行的回调函数
//                            },
//                            cancel: function () {
//                                // 用户取消分享后执行的回调函数
//                            }
//                        });
//
//                        wx.onMenuShareAppMessage({
//                            title: state.allSchoolInfo.name + '-' + '高校列表', // 分享标题
//                            desc: '高校列表', // 分享描述
////                    desc:urlAddToken(window.location.href),
////                                link: state.currentHref, // 分享链接
//                            link: urlAddToken(window.location.href),
//                            imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
//                            // type: 'music、video或link，不填默认为link', // 分享类型,music、video或link，不填默认为link
//                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
//                            success: function () {
//                                // 用户确认分享后执行的回调函数
//                            },
//                            cancel: function () {
//                                // 用户取消分享后执行的回调函数
//                            }
//                        });
//                    })
//                    wx.error(function (err) {
//                        // for (var i of Object.keys(err)) {
//                        //     alert(i + ' : ' + err[i])
//                        // }
//                    })
//                }, err => {
//                    console.log(err)
//                })

        },
        updated() {

        }
    }
</script>
