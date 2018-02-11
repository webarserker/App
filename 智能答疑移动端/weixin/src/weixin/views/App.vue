<template>
    <div>
        <router-view></router-view>
        <div class="propaganda-wrapper" v-show="showPropaganda">
            <div class="propaganda">
                <p class="cha-container" @click="close">
                    <img src="../img/chacha.png" alt="">
                </p>
                <h1>{{words}}</h1>
                <div class="img-container">
                    <img :src="imgSrc" >
                </div>
                <img src="../img/zhiwen.png" class="zhiwen" v-show="isWeixin">
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
    import "../font/common/style.css"
    import "../font/user/style.css"
    import "../font/icon/iconfont.css"
    import "../lib/swiper.min.css"
    import "../lib/swiper.min.js"


    //v2版本的icon文件引入   ----刘洋
    import "./v3/css/style.css"

    export default {
        created(){
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                this.isWeixin=1;
                this.words='请长按识别二维码，关注公众号，方便再次访问哟！'
            } else {

            }

            if(!sessionStorage.getItem('spreadToken')){
                this.$http.get(this.$store.state.host+'/front/template/findSchool/'+localStorage.scode).then(res=>{
                    res=res.body;
                    this.imgSrc=this.$store.state.imgHost + '/imgServer/qrcode/' + res.identify + '.jpg'
                })
            }else{
                this.$http.get(this.$store.state.host+'/front/template/wxqrcodeBySpreadUser?spreadToken='+sessionStorage.spreadToken+'&sCode='+localStorage.scode).then(res=>{
                    res=res.body;
                    this.imgSrc=res.data;
                })
            }

//            一下是弹窗的逻辑
            var _this=this;
            var i = window.location.href.indexOf('scode=');
            if (i == -1) {
                _this.showPropaganda = 0;
                clearInterval(_this.showPropagandaTimer);
                _this.showPropagandaTimer=null;
            }else{
                var user=localStorage.user;
                if(user){
                    _this.$http.get(_this.$store.state.host+'/weixin/api/user/getUserIsSub?id='+JSON.parse(user).id).then(res=>{
                        res=res.body;
                        if(res.data){
                            _this.showPropaganda = 0;
                            clearInterval(_this.showPropagandaTimer);
                            _this.showPropagandaTimer=null;
                        }
                    })
                }
//                this.checkIdTimer=setInterval(function(){
//
//                    var user=localStorage.user;
//                    if(user){
//                        _this.$http.get(_this.$store.state.host+'/weixin/api/user/getUserIsSub?id='+JSON.parse(user).id).then(res=>{
//                            res=res.body;
//                            if(res.data){
//                                _this.showPropaganda = 0;
//                                clearInterval(_this.showPropagandaTimer);
//                                _this.showPropagandaTimer=null;
//                            }
//                        })
//                    }
//                },5000)
            }


        },
        data(){
          return {
              showPropaganda:1,
              isWeixin:0,
              words:'请保存此二维码，发送到微信中，并长按识别，方便再次访问哟！',
              imgSrc:'',
              checkIdTimer:null,
              showPropagandaTimer:null
          }
        },
        computed:{
            isLogin:function(){
                return this.$store.state.isLogin
            }
        },
        watch:{
          isLogin(){
              var user = localStorage.user;
              if (user) {
                  _this.$http.get(_this.$store.state.host + '/weixin/api/user/getUserIsSub?id=' + JSON.parse(user).id).then(res => {
                      res = res.body;
                      if (res.data) {
                          _this.showPropaganda = 0;
                          clearInterval(_this.showPropagandaTimer);
                          _this.showPropagandaTimer = null;
                      }
                  })
              }else{

              }
          }
        },
        methods: {
            close(){
                var _this=this;
                _this.showPropaganda = 0;
                var user=localStorage.user;
                if(!user){
                    _this.showPropagandaTimer=setTimeout(function(){
                        _this.showPropaganda=1;
                    },60000)
                }else{
                    _this.$http.get(_this.$store.state.host+'/weixin/api/user/getUserIsSub?id='+JSON.parse(user).id).then(res=>{
                        res=res.body;
                        if(!res.data){
                            _this.showPropagandaTimer=setTimeout(function(){
                                _this.showPropaganda=1;
                            },60000)
                        }
                    })
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "../css/common.scss";
    .propaganda-wrapper{
        padding:0 pxToRem(90);
        position:fixed;
        z-index:10000;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background:rgba(0,0,0,.5);
        display:flex;
        align-items:center;
        justify-content: center;

        .propaganda{
            text-align:center;
            position:relative;
            .cha-container{
                position:absolute;
                z-index:9999;
                width:pxToRem(46);
                height:pxToRem(46);
                right:pxToRem(-46);
                top:pxToRem(-46);
                display:flex;
                align-items:center;
                justify-content: center;
                img{
                    width:100%;
                    height:100%;
                }
            }
            &>h1{
                color:#fff;
                font-size:pxToRem(36);
            }
            .img-container{
                margin-top:pxToRem(60);
                width:pxToRem(280);
                height:pxToRem(280);
                display:flex;
                align-items:center;
                justify-content: center;
                margin-left:auto;
                margin-right:auto;
                img{
                    box-sizing:content-box;
                    width:100%;
                }
            }
            img.zhiwen{
                margin-top:pxToRem(60);
                width:pxToRem(260);
                height:pxToRem(260);
            }
        }
    }
</style>
