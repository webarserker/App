<template>
    <div>
        <v-header></v-header>
        <router-view></router-view>
        <v-footer v-if="isShowFooter"></v-footer>
        <v-menuball></v-menuball>
        <v-loadingImg></v-loadingImg>
        <v-sdecode></v-sdecode>
        <v-sdecode2></v-sdecode2>
    </div>
</template>
<script type="text/javascript">
import {
    mapState,
} from 'vuex'
import piwik from "../utils/piwik.js"
export default {
    components: {
        "v-header": require('../component/Header.vue'),
        "v-footer": require('../component/Footer.vue'),
        "v-menuball": require('../component/Menuball.vue'),
        "v-loadingImg": require('../component/loadingImg.vue'),
        "v-sdecode": require('../component/sdecode.vue'),
        "v-sdecode2": require('../component/sdecode2.vue'),
    },
    computed: {
        ...mapState(['isShowFooter'])
    },
    created() {


        var reg = new RegExp("(^|&)scode=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            localStorage.scode = unescape(r[2])
            this.$store.commit('CHANGE_SCODE', unescape(r[2]))
        }else{
            location.href = this.$store.state.wxHost + "/weixin/index"
        }
        var state = this.$store.state
        var userId = ''
        var login = '&login=' + false
        var iconUrl = ''
        var schoolName = ''
        localStorage.setItem(this.infoId, this.infoId)
        // if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
        if (localStorage.user || Number(this.$store.state.isLogin)) {
            userId = '&userId=' + JSON.parse(localStorage.user).id
            login = '&login=' + true
        }



        /*********************************页脚的接口********************************/

//        this.$http.get(state.host+'/front/template/'+state.scode+'/'+state.mVersion+'/BottomMenu').then(res=>{
//            res=res.body;
//            var data=res.data;
//            if(res.data==null){
//                this.$store.commit('CHANGE_FOOTERMENU', [])
//            }else{
//                this.$store.commit('CHANGE_FOOTERMENU', data.length > 4 ? data.slice(0, 4) : data)
//
//            }
//
//        })

        /************************************************************************/

        this.$http.get(state.host + state.baseUrl + '/index/getBaseInfo?sCode=' + state.scode + userId + login)
            .then(res => {
                var data = res.data.data
                iconUrl = data.school.iconUrl
                schoolName = data.school.name
                this.$store.commit('CHANGE_MSGCOUNT', data.messageCount)
                this.$store.commit('CHANGE_IDENTIFY', data.school.identify)
                this.$store.commit('CHANGE_SID', data.school.id)
                this.$store.commit('CHANGE_SCHOLL', data.school)
                this.$store.commit('CHANGE_THEMECOLOR', '#' + data.school.themeColor)

                this.$store.commit('CHANGE_FOOTERMENU', data.footerMenu.length > 4 ? data.footerMenu.slice(0, 4) : data.footerMenu)
                document.title = data.school.professor
                setTimeout(() => {
                    this.$store.commit('CHANGE_LOADINGFLAG', false)
                }, 1000)

                // piwik.initPiwik(state.identify, state.sid)
                // var tracker = null
//
//                var url = state.host + state.baseUrl + '/getJsSign'
//                var data={
//                    url: location.href
//                }
//                this.$http.post(url, data, {
//                        emulateJSON: true
//                    })
//                    .then(res => {
//                        // console.log(res.data)
//                        var data = res.data
//                        alert('appId为：'+data.appId+' signature为：'+data.signature)
//                        wx.config({
//                            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//                            appId: data.appId, // 必填，公众号的唯一标识
//                            timestamp: data.timestamp, // 必填，生成签名的时间戳
//                            nonceStr: data.nonce, // 必填，生成签名的随机串
//                            signature: data.signature, // 必填，签名，见附录1
//                            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage','startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//                        });
////                        wx.ready(function() {
////                            wx.onMenuShareTimeline({
////                                title: schoolName+'-'+document.title, // 分享标题
////                                //link: state.currentHref, // 分享链接
////                                imgUrl: state.imgHost + iconUrl, // 分享图标
////                                success: function() {
////                                    // 用户确认分享后执行的回调函数
////                                },
////                                cancel: function() {
////                                    // 用户取消分享后执行的回调函数
////                                }
////                            });
////
////                            wx.onMenuShareAppMessage({
////                                title: schoolName+'-'+document.title, // 分享标题
////                                desc: window.location.href, // 分享描述
//////                                link: state.currentHref, // 分享链接
////                                imgUrl: state.imgHost + iconUrl, // 分享图标
////                                // type: 'music、video或link，不填默认为link', // 分享类型,music、video或link，不填默认为link
////                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
////                                success: function() {
////                                    // 用户确认分享后执行的回调函数
////                                },
////                                cancel: function() {
////                                    // 用户取消分享后执行的回调函数
////                                }
////                            });
////
////                        })
//                        wx.error(function(err) {
//                            // for (var i of Object.keys(err)) {
//                            //     alert(i + ' : ' + err[i])
//                            // }
//                        })
//                    }, err => {
//                        alert('签名请求失败')
//                    })
            }, err => {
                console.log(err)

            })
    }
}
</script>
