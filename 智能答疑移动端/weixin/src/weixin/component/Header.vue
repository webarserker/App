<template>
    <header id="m-header" :style="{background: $store.state.themeColor}">
        <div class="header_search_btn" @click="$router.push('/search')"></div>
        <img class="header_logo" v-if="$store.state.scholl" :src="$store.state.imgHost+$store.state.scholl.logoUrl" @click="$router.push('/')">
        <div v-if="isLogin" class="header_setting_btn" @click="user_items_flag=!user_items_flag">
            <span class="header_setting_point" v-if="$store.messageCount"></span>
        </div>
        <div v-else class="comicon-11 l_p" @click="$router.push('/login')"></div>
        <div class="user_items" v-show="user_items_flag">
            <div class="user_item" @click="user_items_flag=false;$router.push('/updateUser')" :style="{background: $store.state.themeColor}">
                <i class="iconfont comicon-11"></i>
                <span>我的资料</span>
            </div>
            <div class="user_item" @click="user_items_flag=false;$router.push('/msgNotice')" :style="{background: $store.state.themeColor}">
                <i class="iconfont comicon-19"></i>
                <span>招办回复</span>
                <s v-if="$store.messageCount"></s>
            </div>
            <!-- <div class="user_item" @click="user_items_flag=false;" :style="{background: $store.state.themeColor}">
                <i class="iconfont usericon-webicon-46"></i>
                <span>意见反馈</span>
            </div> -->
            <div class="user_item" @click="showFlag=true" :style="{background: $store.state.themeColor}">
                <i class="iconfont comicon-14"></i>
                <span>退出登录</span>
            </div>
            <b class="triangle_up" :style="{'border-bottom': '0.13333rem solid '+$store.state.themeColor}"></b>
        </div>
        <div class="flag" v-show="showFlag">
            <div class="flag-content">
                <div class="message">
                    是否退出登录？
                </div>
                <div class="confirm">
                    <p @click="showFlag=false" :style="{color: $store.state.themeColor}" class="cancle">取消</p>
                    <p @click="logOut" :style="{color: $store.state.themeColor}" class="out">退出</p>
                </div>
            </div>
        </div>
    </header>
</template>
<script type="text/javascript">
import "../css/header.scss"
export default {
    data() {
            return {
                user_items_flag:false,
                showFlag:false
            }
        },
        computed:{
            isLogin:function(){
                return this.$store.state.isLogin 
            },
            user:function(){
                if(this.isLogin){
                    return true
                }else if(localStorage.user&&JSON.parse(localStorage.user).sCode==this.$store.state.scode){
                    return true
                }else{
                    return false
                }
            }
        },
        methods:{
            logOut:function(){
                this.showFlag=false;
                this.user_items_flag=false;
                localStorage.removeItem('user')
                localStorage.removeItem('uid')
                this.$store.commit('CHANGE_ISLOGIN',0)

                sessionStorage.setItem('isLogin',0);

                this.$router.push('/')
            }
        },
        created(){
            // var reg = new RegExp("(^|&)scode=([^&]*)(&|$)");
            // var r = window.location.search.substr(1).match(reg);
            // if(r!=null){
            //     localStorage.scode = unescape(r[2])
            //     this.$store.commit('CHANGE_SCODE', unescape(r[2]))
            // }
        },
        mounted(){
            // if(!this.$store.state.scholl){
            //     var uid = localStorage.uid?'&uid='+localStorage.uid:''
            //     this.$router.push('/?scode='+localStorage.scode+uid)
            // }
            window.addEventListener('touchstart', () => {
                if(this.user_items_flag){
                    setTimeout(()=>{
                        this.user_items_flag = false
                    },300)
                }
            })
        }
}
</script>
<style lang="scss" scoped>
    @import "../css/common.scss";
    .flag{
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        z-index:888;
        background:rgba(0,0,0,.5);
        display:flex;
        align-items:center;
        justify-content: center;
        .flag-content{
            background-color:#fff;
            width:pxToRem(540);
            height:pxToRem(220);
            text-align:center;
            border-radius:pxToRem(16);
            .message{
                height:pxToRem(140);
                font-size:pxToRem(34);
                color:#444;
                display:flex;
                align-items:center;
                justify-content: center;
                font-weight:bold;
                border-bottom:pxToRem(1) solid #ddd;
            }
            .confirm{
                display:flex;
                .cancle{
                    height:pxToRem(80);
                    line-height:pxToRem(80);
                    border-right:pxToRem(1) solid #ddd;
                    font-size:pxToRem(30);
                    flex:1;
                }
                .out{
                    height:pxToRem(80);
                    line-height:pxToRem(80);
                    flex:1;
                    font-size:pxToRem(30);
                }
            }
        }
    }
</style>
