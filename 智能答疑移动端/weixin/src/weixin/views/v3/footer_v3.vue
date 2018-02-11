<template>
    <footer class="footer-v2"  id="m-footer">
        <div :class="footer_tab==0?'footer_tab_item active':'footer_tab_item'" @click="$router.push('/')">
            <i class="icon-f1-v2"
               :style="{backgroundImage: footer_tab==0?'-webkit-gradient(linear, 0 0, 0 90, from('+$store.state.themeColor+'), to(#fff))':'','-webkit-background-clip':  footer_tab==0?'text':'','-webkit-text-fill-color':  footer_tab==0?'transparent':''}"></i>
            <span :style="{color: footer_tab==0?$store.state.themeColor:''}">首页</span>
        </div>
        <div :class="footer_tab==1?'footer_tab_item active':'footer_tab_item'"
             @click="CHANGE_FOOTERTAB(1);$router.push('/articleList?catId='+$store.state.scholl.quickId);">
            <i class="icon-f2-v2"
               :style="{backgroundImage: footer_tab==1?'-webkit-gradient(linear, 0 0, 0 90, from('+$store.state.themeColor+'), to(#fff))':'','-webkit-background-clip':  footer_tab==1?'text':'','-webkit-text-fill-color':  footer_tab==1?'transparent':''}"></i>
            <span :style="{color: footer_tab==1?$store.state.themeColor:''}">快捷查询</span>
        </div>
        <div v-if="$store.state.footerMenu.length==2" :class="footer_tab==4?'footer_tab_item active':'footer_tab_item'"
             @click="CHANGE_FOOTERTAB(4);$router.push('/articleList?catId='+$store.state.footerMenu[1].id)">
            <i v-if="$store.state.footerMenu[1].icon" :class="'iconfont '+$store.state.footerMenu[1].icon"
               :style="{backgroundImage: footer_tab==4?'-webkit-gradient(linear, 0 0, 0 90, from('+$store.state.themeColor+'), to(#fff))':'','-webkit-background-clip':  footer_tab==4?'text':'','-webkit-text-fill-color':  footer_tab==4?'transparent':''}"></i>
            <img v-else :src="$store.state.footerMenu[1].imgUrl">
            <span v-text="$store.state.footerMenu[1].title"  :style="{color: footer_tab==4?$store.state.themeColor:''}"></span>
        </div>
        <div v-if="$store.state.footerMenu.length>2" class="footer_tab_item footer_tabs_item footer_tab_center">


            <div class="bulge">

                <i :class="[{'icon-fcenter-v2':!footer_hide_item_flag,'icon-close-v2':footer_hide_item_flag},'ellipsisIcon']"
                   :style="{background: $store.state.themeColor}" @click="toggleMore" ref="ellipsisIcon"></i>

            </div>
            <div class="white">

            </div>


        </div>
        <div v-if="$store.state.footerMenu.length>0" :class="footer_tab==2?'footer_tab_item active':'footer_tab_item'"
             @click="CHANGE_FOOTERTAB(2);$router.push('/articleList?catId='+$store.state.footerMenu[0].id)">
            <i v-if="$store.state.footerMenu[0].icon"  :class="'iconfont '+$store.state.footerMenu[0].icon"
               :style="{backgroundImage: footer_tab==2?'-webkit-gradient(linear, 0 0, 0 90, from('+$store.state.themeColor+'), to(#fff))':'','-webkit-background-clip':  footer_tab==2?'text':'','-webkit-text-fill-color':  footer_tab==2?'transparent':''}"></i>
            <img v-else :src="$store.state.footerMenu[0].imgUrl">
            <span v-text="$store.state.footerMenu[0].title"
                  :style="{color: footer_tab==2?$store.state.themeColor:''}"></span>
        </div>
        <div :class="footer_tab==3?'footer_tab_item active':'footer_tab_item'"
             @click="$router.push('/normalQuestion?contentType=3');">
            <i class="icon-f4-v2"
               :style="{backgroundImage: footer_tab==3?'-webkit-gradient(linear, 0 0, 0 90, from('+$store.state.themeColor+'), to(#fff))':'','-webkit-background-clip':  footer_tab==3?'text':'','-webkit-text-fill-color':  footer_tab==3?'transparent':''}"></i>
            <span :style="{color: footer_tab==3?$store.state.themeColor:''}">常见问题</span>
        </div>
        <div v-for="x of $store.state.footerMenu.slice(1,4)" class="footer_hide_item" v-show="footer_hide_item_flag"
             @click="CHANGE_FOOTERTAB(-1);gotoUrl('/articleList?catId='+x.id)">
            <i v-if="x.icon" :class="'children-icon iconfont '+x.icon"
               :style="{background: $store.state.themeColor,color:'#fff'}"></i>
            <img v-else :src="x.imgUrl">
            <span class="children-span" v-text="x.title"></span>
        </div>
        <!-- <div class="footer_hide_item" v-show="footer_hide_item_flag" @click="CHANGE_FOOTERTAB(-1);gotoUrl('/articleList')">
            <i class="iconfont usericon-webicon-07" :style={background:$store.state.themeColor}></i>
            <span>招生信息</span>
        </div>
        <div class="footer_hide_item" v-show="footer_hide_item_flag" @click="CHANGE_FOOTERTAB(-1);gotoUrl('/articleList')">
            <i class="iconfont usericon-webicon-22" :style={background:$store.state.themeColor}></i>
            <span>硕士研究生招生</span>
        </div> -->
        <div class="footer_mask" v-show="footer_hide_item_flag"></div>
    </footer>
</template>
<script type="text/javascript">
    import "./css/footer_v3.scss"
    import {
        mapState,
        mapActions
    } from "vuex"

    export default {
        data() {
            return {
                footer_hide_item_flag: false,
            }
        },
        computed: {
            ...mapState(['footer_tab'])
        },
        methods: {
            ...mapActions(['CHANGE_FOOTERTAB']),
            toggleMore: function () {
                this.footer_hide_item_flag = !this.footer_hide_item_flag

            },
            gotoUrl: function (path) {
                this.$refs.ellipsisIcon.className = 'icon-fcenter-v3 ellipsisIcon'
                this.footer_hide_item_flag = false
                this.$router.push({
                    path: path
                })
            }
        },
        mounted() {
            var _this = this;
            window.addEventListener('touchstart', function (e) {
                if (e.target.className.indexOf('ellipsisIcon') == -1
                    && e.target.className.indexOf('children-icon') == -1
                    && e.target.className.indexOf('footer_mask') == -1
                    && e.target.className.indexOf('footer_hide_item') == -1
                    && e.target.className.indexOf('children-span') == -1) {
                    _this.footer_hide_item_flag = false
                }
            });
        }
    }
</script>
