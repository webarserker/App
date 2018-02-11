<template>
    <div class="container update-pwd">
        <!-- 面包屑 -->
        <div class="path">
            <i class="comicon-17 icon1-return" :style="{color:$store.state.themeColor}" @click="$router.go(-1)"></i>
            <a href="javascript:void(0);" @click="$router.push('/')" :style="{color:$store.state.themeColor}">首页</a>
            <i class="comicon-07 icon1-link"></i>
            <span>找回密码</span>
        </div>
        <div class="text"><img :src=textImgsrc /></div>
        <!-- 更新密码框 -->
        <div class="updatepwd-container">
            <div class="login-box">
                <div>
                    <input v-model="mobile" type="number" class="ipt" placeholder="请输入手机号" />
                </div>
                <div class="val-ipt-wp mt30">
                    <input v-model="mobileValidCode" type="number" class="ipt" placeholder="请输入验证码" />
                    <validBtn ref="timerbtn" class="btn" :class="{disabled: validDisable}" :disabled="disabled" v-on:run="getValiCode" :style="{backgroundColor:$store.state.themeColor}" @on-state-change="onStateChange"></validBtn>
                </div>
                <div class="mt30">
                    <input v-model="password" type="password" class="ipt" placeholder="请输入密码" />
                </div>
                <div class="mt30">
                    <input v-model="repassword" type="password" class="ipt" placeholder="请再次输入密码" />
                </div>
                <div class="mt45">
                    <button class="btn" v-bind:class="{disabled: submitDisable}" @click="update" :style="{backgroundColor:$store.state.themeColor}">确定</button>
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
import "../css/updatePwd.scss"

import urlAddToken from '../utils/urlAddToken.js'

export default {
    data() {
            return {
                disabled: false,
                mobile: '',
                mobileValidCode: '',
                password: '',
                repassword: '',
                textImgsrc: require('../img/login_text_' + this.$store.state.themeColor + '.png'),
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
            validDisable: function() {
                return !this.mobile || this.disabled
            },
            submitDisable: function() {
                return !this.mobile || !this.mobileValidCode || !this.password || !this.repassword
            }
        },
        methods: {
            getValiCode: function() {
                if (this.validDisable) {
                    return;
                }
                if (!/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/.test(this.mobile)) {
                    this.tip.options.content = '请填写正确的手机号码'
                    this.tip.show = true
                    return;
                }
                //this.$refs.timerbtn.setDisabled(true); //设置按钮不可用
                this.disabled = true
                var state = this.$store.state
                var data = {
                    mobile: this.mobile,
                    codeType: 101
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
                            } else if(data.code=='020001'){
                                this.$refs.timerbtn.stop(); //停止倒计时
                                this.tip.options.content = data.message
                                this.tip.show = true
                            }
                        }, err => {
                            this.disabled = false
                            this.$refs.timerbtn.stop(); //停止倒计时
//                            this.tip.options.content = err
                            this.tip.options.content = '服务器异常，请重试'
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            update: function() {
                if (this.submitable) {
                    return;
                }
                if (this.password != this.repassword) {
                    this.tip.options.content = '两次输入的密码不一致'
                    this.tip.show = true
                    return;
                }
                this.endFlag = false
                var state = this.$store.state
                var data = localStorage.getItem('user')?{
                    id: JSON.parse(localStorage.getItem('user')).id,
                    mobile: this.mobile,
                    mobileValidCode: this.mobileValidCode,
                    password: this.password
                }:{
                    mobile: this.mobile,
                    mobileValidCode: this.mobileValidCode,
                    password: this.password
                }
                var url = state.host + state.baseUrl + '/user/updatePassword'
                var _this=this;
//                setTimeout(() => {
                    this.$http.post(url, data, {
                            emulateJSON: true
                        })
                        .then(res => {
                            this.endFlag = true
                            var data = res.data
//                            this.tip.options.content = data.message
                            this.tip.options.content='修改成功，即将跳转登陆页'
                            this.tip.show = true
                            setTimeout(function(){
                                _this.$router.push({'path':'/login'})
                            },2000)
                        }, err => {
                            this.endFlag = true
                            this.tip.options.content = err
                            this.tip.show = true
                        })
//                }, state.timeout)
            },
            onResultChange: function() {
                this.tip.show = false
            },
            onStateChange: function(val) {
                this.disabled = val
            }
        },
        created() {
            var state = this.$store.state
            document.title = state.allSchoolInfo.name + '-修改密码'


        },
        mounted(){





            var state=this.$store.state;
            wx.ready(function() {
                wx.onMenuShareTimeline({
                    title: state.allSchoolInfo.name+'-'+'修改密码', // 分享标题
                    //link: state.currentHref, // 分享链接
                    imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareAppMessage({
                    title: state.allSchoolInfo.name+'-'+'修改密码', // 分享标题
                    desc: '修改密码', // 分享描述
//                    desc:urlAddToken(window.location.href),
//                                link: state.currentHref, // 分享链接
                    link:(window.location.href.split('#')[0]+'&redirectUrl='+encodeURIComponent(urlAddToken(window.location.href))).replace('/build/index.html','/weixin/index'),
                    imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
                    // type: 'music、video或link，不填默认为link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });
            })
        }
}
</script>
