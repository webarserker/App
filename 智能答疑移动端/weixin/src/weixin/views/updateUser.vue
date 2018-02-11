<template>
    <div class="container update-user">
        <!-- 面包屑 -->
        <div class="path">
            <i class="comicon-17 icon1-return" :style="{color:$store.state.themeColor}" @click="$router.go(-1)"></i>
            <a href="javascript:void(0);" @click="$router.push('/')" :style="{color:$store.state.themeColor}">首页</a>
            <i class="comicon-07 icon1-link"></i>
            <span>个人中心</span>
        </div>
        <!-- 更新个人信息 -->
        <div class="updateuser-container">
            <div class="ipt-wp mt30">
                <span class="col-name"><i class="comicon-18 icon1-name" :style="{color:$store.state.themeColor}"></i>昵&nbsp;&nbsp;称<b
                        style="color:red">*</b></span>
                <span class="col-ipt"><input v-model="data.nickName" type="text" class="ipt"/></span>
            </div>
            <div class="ipt-wp mt30">
                <span class="col-name"><i class="comicon-19 icon1-name" :style="{color:$store.state.themeColor}"></i>邮&nbsp;&nbsp;箱</span>
                <span class="col-ipt"><input v-model="data.email" type="text" class="ipt" disabled="disabled"/></span>
            </div>
            <div class="ipt-wp mt30" v-if="data.mobile">
                <span class="col-name"><i class="comicon-20 icon1-name" :style="{color:$store.state.themeColor}"></i>手机号</span>
                <span class="col-ipt"><input v-model="data.mobile" type="text" class="ipt" disabled="disabled"/></span>
            </div>
            <div class="ipt-wp select-wp mt30">
                <span class="col-name"><i class="comicon-21 icon1-name" :style="{color:$store.state.themeColor}"></i>生源地<b
                        style="color:red">*</b></span>
                <span class="col-ipt">
                    <select class="select ipt" v-model="data.provinceId"
                            :style="{backgroundColor:$store.state.themeColor}">
                        <option value="">请选择</option>
                        <option v-for="option in selProvinceOptions" v-bind:value="option.id">  
                            {{ option.name }}  
                        </option>  
                    </select>
                    <i class="comicon-28 icon1-pull"></i>
                </span>
            </div>
            <div class="ipt-wp select-wp mt30">
                <span class="col-name"><i class="comicon-22 icon1-name" :style="{color:$store.state.themeColor}"></i>科&nbsp;&nbsp;类</span>
                <span class="col-ipt">
                    <select class="select ipt" v-model="data.scienceClass"
                            :style="{backgroundColor:$store.state.themeColor}">
                        <option value="">请选择</option>
                        <option value="综合">综合</option>
                        <option value="文科">文科</option> 
                        <option value="理科">理科</option>   
                    </select>
                    <i class="comicon-28 icon1-pull"></i>
                </span>
            </div>
            <div class="ipt-wp select-wp mt30">
                <span class="col-name"><i class="comicon-23 icon1-name" :style="{color:$store.state.themeColor}"></i>招生类型</span>
                <span class="col-ipt">
                    <select class="select ipt" v-model="data.sourceType"
                            :style="{backgroundColor:$store.state.themeColor}">
                        <option value="">请选择</option>
                        <option v-for="option in selSourceOptions" v-bind:value="option.id">  
                                {{ option.name }}  
                            </option>  
                    </select>
                    <i class="comicon-28 icon1-pull"></i>
                </span>
            </div>
            <div class="ipt-wp mt30">
                <span class="col-name"><i class="comicon-24 icon1-name" :style="{color:$store.state.themeColor}"></i>高考分数</span>
                <span class="col-ipt"><input v-model="data.score" type="number" class="ipt"/></span>
            </div>
            <div class="ipt-wp mt30" v-if="data.mobile">
                <span class="col-name"><i class="comicon-25 icon1-name" :style="{color:$store.state.themeColor}"></i>密&nbsp;&nbsp;码</span>
                <span class="col-ipt tac"><a href="javascript: void(0)" @click="$router.push('/updatePwd')"
                                             :style="{color:$store.state.themeColor}">修改密码</a></span>
            </div>
            <div class="mt45">
                <button v-bind:class="{disabled: isActive}" class="btn" @click="update"
                        :style="{backgroundColor:$store.state.themeColor}">确定
                </button>
            </div>
        </div>
        <div class="ajaxLoading">
            <div class="loadInner">
                <v-loading :endFlag="endFlag"></v-loading>
            </div>
        </div>
        <v-tip :options=tip.options :show=tip.show @on-result-change="onResultChange"></v-tip>
    </div>
</template>
<script type="text/javascript">
    import "../css/updateUser.scss"

    import urlAddToken from '../utils/urlAddToken.js'

    export default {
        data() {
            return {
                flag1: false,
                flag2: false,
                endFlag: true,
                selProvinceOptions: [],
                selSourceOptions: [],
                data: {
                    nickName: '',
                    email: '',
                    mobile: '',
                    provinceId: '',
                    scienceClass: '',
                    sourceType: '',
                    score: '',
                    password: ''
                },
                tip: {
                    options: {
                        content: '',
                        autoClose: true
                    },
                    show: false
                }
            }
        },
        components: {
            'v-loading': require('../component/Loading.vue'),
            'v-tip': require('../component/tip.vue')
        },
        computed: {
            isActive: function () {
                return !this.data.nickName || !this.data.provinceId
            }
        },
        methods: {
            //更新个人信息
            update: function () {
                if (this.isActive) {
                    return;
                }
                //高考分数
                if (this.data.score && !(/^\d+$/.test(this.data.score))) {
                    this.tip.options.content = '请输入正确的高考分数'
                    this.tip.show = true
                    return
                }
                this.endFlag = false
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/user/updateUserInfo'
                setTimeout(() => {
                    this.$http.post(url, {
                        id: JSON.parse(localStorage.getItem('user')).id,
                        nickName: this.data.nickName,
                        provinceId: this.data.provinceId,
                        mobile: this.data.mobile,
                        scienceClass: this.data.scienceClass,
                        sourceType: this.data.sourceType,
                        score: this.data.score
                    }, {
                        emulateJSON: true
                    })
                        .then(res => {
                            this.endFlag = true
                            this.tip.options.content = res.data.message
                            this.tip.show = true
                        }, err => {
                            this.endFlag = true
                            this.tip.options.content = err
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            //获取用户信息
            getUserInfo: function () {
                this.endFlag = false
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/user/getUserInfoById?userId=' + JSON.parse(localStorage.getItem('user')).id
                setTimeout(() => {
                    this.$http.get(url, {
                        emulateJSON: true
                    })
                        .then(res => {
                            this.endFlag = true
                            this.data = res.data.data
                            //修改3个下拉框的值，当没有有意义的值时，统一复制为空，select显示“请选择”
                            if (!this.data.provinceId || this.data.provinceId == null || this.data.provinceId == 'null' || this.data.provinceId == undefined || this.data.provinceId == 'undefined') {
                                this.data.provinceId = ''
                            }
                            if (!this.data.scienceClass || this.data.scienceClass == null || this.data.scienceClass == 'null' || this.data.scienceClass == undefined || this.data.scienceClass == 'undefined') {
                                this.data.scienceClass = ''
                            }
                            if (!this.data.sourceType || this.data.sourceType == null || this.data.sourceType == 'null' || this.data.sourceType == undefined || this.data.sourceType == 'undefined') {
                                this.data.sourceType = ''
                            }
                        }, err => {
                            this.endFlag = true
                            this.tip.options.content = err
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            //获取省信息
            getAreaInfo: function () {
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/common/findProvinceList'
                setTimeout(() => {
                    this.$http.get(url, {
                        emulateJSON: true
                    })
                        .then(res => {
                            this.flag1 = true
                            if (this.flag1 && this.flag2) {
                                this.getUserInfo()
                            }
                            this.selProvinceOptions = res.data
                            localStorage.setItem('selProvinceOptions', JSON.stringify(res.data))
                        }, err => {
                            this.tip.options.content = err
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            //获取招生类型信息
            getSourceType: function () {
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/common/findSourceTypeList?sCode=' + state.scode
                setTimeout(() => {
                    this.$http.get(url, {
                        emulateJSON: true
                    })
                        .then(res => {
                            this.flag2 = true
                            if (this.flag1 && this.flag2) {
                                this.getUserInfo()
                            }
                            this.selSourceOptions = res.data
                            localStorage.setItem('selSourceOptions', JSON.stringify(res.data))
                        }, err => {
                            this.tip.options.content = err
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            onResultChange: function () {
                this.tip.show = false
            }

        },
        mounted() {
            /*if(localStorage.getItem('selProvinceOptions')) {
                this.selProvinceOptions = JSON.parse(localStorage.getItem('selProvinceOptions'));
            } else {
                this.getAreaInfo()
            }
            if(localStorage.getItem('selSourceOptions')) {
                this.selSourceOptions = JSON.parse(localStorage.getItem('selSourceOptions'));
            } else {
                this.getSourceType()
            }*/
            this.getAreaInfo()
            this.getSourceType()


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
                            title: state.allSchoolInfo.name + '-' + '个人中心', // 分享标题
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
                            title: state.allSchoolInfo.name + '-' + '个人中心', // 分享标题
                            desc: '个人中心', // 分享描述
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
        created() {
            var state = this.$store.state
            document.title = state.scholl.name + '-个人中心'


        }
    }
</script>
