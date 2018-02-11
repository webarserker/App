<template>
    <div class="container register">
        <!-- 面包屑 -->
        <div class="path">
            <div class="left">
                <i class="comicon-17 icon1-return" :style="{color:$store.state.themeColor}" @click="$router.go(-1)"></i>
                <a href="javascript:void(0);" :style="{color:$store.state.themeColor}" @click="$router.push('/')">首页</a>
                <i class="comicon-07 icon1-link"></i>
                <span>注册招录智能咨询系统</span>
            </div>
            <div class="right" @click="$router.push('/login')">
                <span>已有账号</span>
                <i class="comicon-07 icon1-link"></i>
            </div>
        </div>
        <!-- 注册框 -->
        <div class="register-container">
            <div class="login-box">
                <div class="ipt-wp mt30">
                    <span class="col-name"><i class="comicon-18 icon1-name"
                                              :style="{color:$store.state.themeColor}"></i></span>
                    <span class="col-ipt"><input v-model="data.nickName" type="text" class="ipt"
                                                 placeholder="昵称"/></span>
                </div>
                <div class="ipt-wp select-wp mt30">
                    <span class="col-name"><i class="comicon-21 icon1-name"
                                              :style="{color:$store.state.themeColor}"></i></span>
                    <span class="col-ipt">
                        <span class="col1">生源地</span>
                    <select class="select ipt col2" v-model="data.provinceId"
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
                    <span class="col-name"><i class="comicon-22 icon1-name"
                                              :style="{color:$store.state.themeColor}"></i></span>
                    <span class="col-ipt">
                        <span class="col1">科类</span>
                    <select class="select ipt col2" v-model="data.scienceClass"
                            :style="{backgroundColor:$store.state.themeColor}">
                        <option value="">请选择</option>
                        <option value="综合">综合</option>
                        <option value="文科">文科</option>
                        <option value="理科">理科</option>
                    </select>
                    <i class="comicon-28 icon1-pull"></i>
                    </span>
                </div>
                <div class="ipt-wp mt30">
                    <span class="col-name"><i class="comicon-20 icon1-name"
                                              :style="{color:$store.state.themeColor}"></i></span>
                    <span class="col-ipt"><input v-model="data.mobile" type="number" class="ipt"
                                                 placeholder="手机号码"/></span>
                </div>
                <div class="ipt-wp justy mt30">
                    <span class="col-name">&nbsp;</span>
                    <span class="col-ipt justy">
                        <span class="col1"><input v-model="data.mobileValidCode" type="number" class="ipt"
                                                  placeholder="手机验证码"/></span>
                    <span class="col2">
                            <validBtn ref="timerbtn" class="btn" :class="{disabled: validDisable}" :disabled="disabled"
                                      v-on:run="getValiCode" :style="{backgroundColor:$store.state.themeColor}"
                                      @on-state-change="onStateChange"></validBtn>
                        </span>
                    </span>
                </div>
                <div class="ipt-wp mt30">
                    <span class="col-name"><i class="comicon-25 icon1-name"
                                              :style="{color:$store.state.themeColor}"></i></span>
                    <span class="col-ipt"><input v-model="data.password" type="password" class="ipt"
                                                 placeholder="请输入密码"/></span>
                </div>
                <div class="ipt-wp mt30">
                    <span class="col-name">&nbsp;</span>
                    <span class="col-ipt"><input v-model="data.repassword" type="password" class="ipt"
                                                 placeholder="请再次输入密码"/></span>
                </div>
                <div class="mt45">
                    <button class="btn" v-bind:class="{disabled: submitDisable}" @click="regist"
                            :style="{backgroundColor:$store.state.themeColor}">注册
                    </button>
                </div>
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
    import "../css/register.scss"

    import urlAddToken from '../utils/urlAddToken.js'

    export default {
        data() {
            return {
                disabled: false,
                selProvinceOptions: [],
                data: {
                    nickName: '',
                    provinceId: '',
                    scienceClass: '',
                    mobile: '',
                    mobileValidCode: '',
                    password: '',
                    repassword: ''
                },
                endFlag: true,
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
            'v-tip': require('../component/tip.vue'),
            'validBtn': require('../component/validCodeBtn.vue')
        },
        computed: {
            validDisable: function () {
                return !this.data.mobile || this.disabled
            },
            submitDisable: function () {
                return !this.data.nickName || !this.data.provinceId || !this.data.scienceClass || !this.data.mobile || !this.data.mobileValidCode || !this.data.password || !this.data.repassword
            }
        },
        methods: {
            //注册
            regist: function () {
                if (this.submitDisable) {
                    return;
                }
                if (this.data.password != this.data.repassword) {
                    this.tip.options.content = '两次输入的密码不一致'
                    this.tip.show = true
                    return;
                }
                this.endFlag = false
                var state = this.$store.state
                var data = {
                    sCode: state.scode,
                    nickName: this.data.nickName,
                    provinceId: this.data.provinceId,
                    scienceClass: this.data.scienceClass,
                    mobile: this.data.mobile,
                    mobileValidCode: this.data.mobileValidCode,
                    password: this.data.password
                }
                var url = state.host + state.baseUrl + '/user/register'
                setTimeout(() => {
                    this.$http.post(url, data, {
                        emulateJSON: true
                    })
                        .then(res => {
                            this.endFlag = true
                            var data = res.data
                            this.tip.options.content = data.message
                            this.tip.show = true
                            if (res.data.code == '000000') {
                                //注册成功之后跳转到登录页面
                                this.$router.push({
                                    path: '/login'
                                })
                            }
                        }, err => {
                            this.endFlag = true
                            this.tip.options.content = err
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            //获取验证码
            getValiCode: function () {
                if (this.validDisable) {
                    return;
                }
                if (!(/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/.test(this.data.mobile))) {
                    this.tip.options.content = '请输入正确的手机号码'
                    this.tip.show = true
                    return;
                }
                //this.$refs.timerbtn.setDisabled(true); //设置按钮不可用
                this.disabled = true
                var state = this.$store.state
                var data = {
                    mobile: this.data.mobile,
                    codeType: 100
                }
                var url = state.host + state.baseUrl + '/common/sendMobileValidCode'
                setTimeout(() => {
                    this.$http.post(url, data, {
                        emulateJSON: true
                    })
                        .then(res => {
                            var data = res.data
                            if (data.code == '000000') {
                                this.$refs.timerbtn.start(); //启动倒计时
                                this.tip.options.content = '验证码发送成功'
                                this.tip.show = true
                            } else {
                                this.$refs.timerbtn.stop(); //停止倒计时
                                this.tip.options.content = data.message
                                this.tip.show = true
                            }
                        }, err => {
                            this.disabled = false
                            this.$refs.timerbtn.stop(); //停止倒计时
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
                            this.selProvinceOptions = res.data
                        }, err => {
                            this.tip.options.content = err
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            onResultChange: function () {
                this.tip.show = false
            },
            onStateChange: function (val) {
                this.disabled = val
            }
        },
        mounted() {
            this.getAreaInfo()
        },
        created() {
            var state = this.$store.state
            document.title = state.scholl.name + '-注册'


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
                            title: state.allSchoolInfo.name + '-' + '注册', // 分享标题
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
                            title: state.allSchoolInfo.name + '-' + '注册', // 分享标题
                            desc: '注册', // 分享描述
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
