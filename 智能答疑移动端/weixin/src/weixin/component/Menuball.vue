<template>
    <div ref="menuball" :class="flag?'menuball active':'menuball'" :style="{background: $store.state.themeColor,top:moveFlag?top:'30%'}" @click.stop @touchstart="touchstartAction" @touchend="touchendAction" @touchmove.prevent.stop="touchmoveAction">
        <i v-show="!flag" class="iconfont comicon-05 icon_init"></i>
        <i v-show="flag" class="iconfont comicon-27 icon_close"></i>
        <i :style="{background: $store.state.themeColor}" :class="flag?'iconfont comicon-10 icon_robot active':'iconfont icon-yidongduanicon-18 icon_robot'" @click="gotoRobot"></i>
        <a v-if="$store.state.scholl" :href="'tel:'+$store.state.scholl.phoneNum">
            <i :style="{background: $store.state.themeColor}" :class="flag?'iconfont usericon-webicon-62 icon_phone active':'iconfont icon-webicon-60 icon_phone'"></i>
        </a>
        <i :style="{background: $store.state.themeColor}" :class="flag?'iconfont usericon-webicon-68 icon_msg active':'iconfont icon-yidongduanicon-6 icon_msg'" @click="gotoSendQuestion"></i>
        <i :style="{background: $store.state.themeColor}" :class="flag?'iconfont comicon-32 icon2_decode active':'iconfont icon-yidongduanicon-54 icon2_decode'" @click="gottt"></i>
    </div>
</template>
<script type="text/javascript">
import "../css/menuball.scss"
export default {
    data() {
            return {
                flag: false,
                startTime: 0,
                endTime: 0,
                moveFlag: false,
                top: 0
            }
        },
        computed: {
            menuballTop: function() {
                return this.top / window.innerWidth * 10 + 'rem';
            }
        },
        components: {

        },
        methods: {
            touchstartAction: function(e) {
                this.startTime = (new Date()).getTime()
            },
            touchendAction: function() {
                this.endTime = (new Date()).getTime()
                if (this.endTime - this.startTime < 500) {
                    this.flag = !this.flag;
                } else {
                    this.moveFlag = true
                }

            },
            touchmoveAction: function(e) {
                if (!this.flag) {



                    var _this=this;
                    var headerHeight=parseFloat(getComputedStyle(document.getElementById('m-header')).height);
                    var footerHeight=parseFloat(getComputedStyle(document.getElementById('m-footer')).height);
                    var ballHeight=parseFloat(getComputedStyle(_this.$refs.menuball).height);
                    var windowHeight=parseFloat(window.innerHeight);

                    var yToTop=headerHeight;
                    var yLeaveTop=windowHeight-footerHeight;
                    console.log(yToTop+','+yLeaveTop)
                    if(e.touches[0].pageY>yToTop&&e.touches[0].pageY<yLeaveTop){
                        this.top = e.touches[0].pageY+'px'
                        console.log(this.top);
                    }else if(e.touches[0].pageY<=yToTop){
                        this.top = yToTop+'px'
                    }else if(e.touches[0].pageY>=yLeaveTop){
                        this.top = yLeaveTop-ballHeight+'px'
                    }


                }
            },
            gotoRobot: function() {
                if(this.flag) return;
                if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
                    var user = JSON.parse(localStorage.user)
                    var state = this.$store.state
                    location.href = state.talkHost + '/users?source=1&id=' + user.id + '&sCode='+state.scode+'&name='+user.nickName+'&professor='+state.scholl.professor+'&school=' + state.scholl.name
                } else {
                    this.$router.push('/login')
                }
            },
            gotoSendQuestion:function(){
                if(this.flag) return;
                if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
                    this.$router.push('/sendQuestion')
                }else{
                    this.$router.push('/login')
                }
            },
            gottt:function(){
                if(this.flag) return;
                this.$store.state.sdecode2=true
            },
        },
        mounted(){
            window.addEventListener('touchstart', () => {
                if(this.flag){
                    setTimeout(()=>{
                        this.flag = false
                    },300)
                }
            })
        }
}
</script>
