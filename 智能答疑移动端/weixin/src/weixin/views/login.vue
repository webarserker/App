<template>

    <div>
        <!-- 面包屑 -->
        <div class="path">
            <i class="comicon-17 icon1-return" :style="{color:$store.state.themeColor}" @click="$router.go(-1)"></i>
            <a href="javascript:void(0);" @click="$router.push('/')" :style="{color:$store.state.themeColor}">首页</a>
            <i class="comicon-07 icon1-link"></i>
            <span>登录招录智能咨询系统</span>
        </div>


        <div class="container login">
            <div class="text"><img :src="textImgsrc" /></div>
            <!-- 登录框 -->
            <div class="login-container">
                <div class="login-box">
                    <div>
                        <input v-model="name" type="number" class="ipt" placeholder="请输入手机号" />
                    </div>
                    <div>
                        <input v-model="password" type="password" class="ipt" placeholder="请输入密码" />
                    </div>
                    <div class="login-help">
                        <!--<input type="checkbox" v-model="isRemember" class="chk-ipt" id="autoLoginChk" /><label class="chk-lab" for="autoLoginChk">下次自动登录</label>-->
                        <a href="javascript:void(0);" @click="$router.push('/updatePwd')" class="forget-psd" :style="{color:$store.state.themeColor}">忘记密码？</a>
                    </div>
                    <div>
                        <button class="btn" v-bind:class="{disabled: isActive}" @click="login" :style="{backgroundColor:$store.state.themeColor}">登录</button>
                    </div>
                    <div class="other-link"><a @click="wxLogin" class="login-webchat" :style="{color:$store.state.themeColor}">微信账号登录</a><a href="javascript:void(0);" @click="$router.push('/register')" class="sign-up" :style="{color:$store.state.themeColor}">免费注册>></a></div>
                </div>
            </div>
            <div class="ajaxLoading">
                <div class="loadInner">
                    <v-loading :endFlag="endFlag"></v-loading>
                </div>
            </div>
            <v-tip :options=tip.options :show=tip.show @on-result-change="onResultChange"></v-tip>
        </div>

    </div>

</template>
<script type="text/javascript">
import "../css/login.scss"
import piwik from '../utils/piwik.js'
import urlAddToken from '../utils/urlAddToken.js'

export default {
    data() {
            return {
                name: '',
                password: '',
                endFlag: true,
                textImgsrc: require('../img/login_text_' + this.$store.state.themeColor + '.png'),
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
            isActive: function() {
                return !this.name || !this.password
            }
        },
        methods: {
            wxLogin:function(){
                window.location.href=this.$store.state.wxHost+'/weixin/index?scode='+this.$store.state.scode+'&spreadToken='+sessionStorage.getItem('spreadToken');
            },
            login: function() {
                if (this.isActive) {
                    return;
                }
                if (!(/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/.test(this.name))) {
                    this.tip.options.content = '请输入正确的手机号码'
                    this.tip.show = true
                    return
                }
                this.endFlag = false
                var state = this.$store.state
                var data = {
                    account: this.name,
                    password: this.password
                }
                var url = state.host + state.baseUrl + '/user/login'
                setTimeout(() => {
                    this.$http.post(url, data, {
                            emulateJSON: true
                        })
                        .then(res => {
                            this.endFlag = true
                            if (res.data.data != null) {
                                localStorage.setItem('user', JSON.stringify(res.data.data))
                                this.$store.commit('CHANGE_ISLOGIN', 1)

                                sessionStorage.setItem('isLogin',1);


                                this.$router.push({
                                    path: '/'
                                })
                            } else {
                                this.tip.options.content = res.data.message
                                this.tip.show = true
                            }
                        }, err => {
                            this.endFlag = true
                            this.tip.options.content = err
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            onResultChange: function() {
                this.tip.show = false
            }
        },
        created() {
            var state = this.$store.state;
            document.title = state.allSchoolInfo.name + '-登录';
            state.currentHref = location.href;
            // piwik.initPiwik(state.identify, state.sid)


            var state=this.$store.state;
            wx.ready(function() {
                wx.onMenuShareTimeline({
                    title: state.allSchoolInfo.name+'-'+'登陆', // 分享标题
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
                    title: state.allSchoolInfo.name+'-'+'登陆', // 分享标题
                    desc: '登陆', // 分享描述
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
