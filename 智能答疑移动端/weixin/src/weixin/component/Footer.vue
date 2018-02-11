<template>
    <footer id="m-footer">
        <div :class="footer_tab==0?'footer_tab_item active':'footer_tab_item'"
             :style="{background: footer_tab==0?$store.state.themeColor:''}" @click="$router.push('/')">
            <i class="iconfont comicon-01"></i>
            <span>首页</span>
        </div>
        <div :class="footer_tab==1?'footer_tab_item active':'footer_tab_item'"
             :style="{background: footer_tab==1?$store.state.themeColor:''}"
             @click="CHANGE_FOOTERTAB(1);$router.push('/articleList?catId='+$store.state.scholl.quickId);">
            <i class="iconfont comicon-02"></i>
            <span>快捷查询</span>
        </div>
        <div v-if="$store.state.footerMenu.length==2" :class="footer_tab==4?'footer_tab_item active':'footer_tab_item'"
             :style="{background: footer_tab==4?$store.state.themeColor:''}"
             @click="CHANGE_FOOTERTAB(4);$router.push('/articleList?catId='+$store.state.footerMenu[1].id)">
            <i v-if="$store.state.footerMenu[1].icon" :class="'iconfont '+$store.state.footerMenu[1].icon"></i>
            <!--<img v-else :src="$store.state.footerMenu[1].imgUrl">-->
            <i v-else :class="['usericon-webicon-01','iconfont']"></i>
            <span v-text="$store.state.footerMenu[1].title"></span>
        </div>
        <div v-if="$store.state.footerMenu.length>2" class="footer_tab_item footer_tabs_item">
            <i :class="['iconfont','comicon-05','ellipsisIcon',{'active_ellipsisIcon':footer_hide_item_flag}]"
               :style="{background: footer_hide_item_flag?$store.state.themeColor:''}" @click="toggleMore"
               ref="ellipsisIcon"></i>
        </div>
        <div v-if="$store.state.footerMenu.length>0" :class="footer_tab==2?'footer_tab_item active':'footer_tab_item'"
             :style="{background: footer_tab==2?$store.state.themeColor:''}"
             @click="CHANGE_FOOTERTAB(2);$router.push('/articleList?catId='+$store.state.footerMenu[0].id)">
            <i v-if="$store.state.footerMenu[0].icon" :class="'iconfont '+$store.state.footerMenu[0].icon"></i>
            <!--<img v-else :src="$store.state.footerMenu[0].imgUrl">-->
            <i v-else :class="['usericon-webicon-01','iconfont']"></i>
            <span v-text="$store.state.footerMenu[0].title"></span>
        </div>
        <div :class="footer_tab==3?'footer_tab_item active':'footer_tab_item'"
             :style="{background: footer_tab==3?$store.state.themeColor:''}"
             @click="$router.push('/normalQuestion?contentType=3');">
            <i class="iconfont comicon-04"></i>
            <span>常见问题</span>
        </div>
        <div v-for="x of $store.state.footerMenu.slice(1,4)" class="footer_hide_item" v-show="footer_hide_item_flag"
             @click="CHANGE_FOOTERTAB(-1);gotoUrl('/articleList?catId='+x.id)">
            <i v-if="x.icon" :class="'children-icon iconfont '+x.icon"
               :style="{background: $store.state.themeColor,color:'#fff'}"></i>
            <!--<img v-else :src="x.imgUrl">-->
            <i v-else :class="['children-icon','usericon-webicon-01','iconfont']" :style="{background: $store.state.themeColor,color:'#fff'}"></i>
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
    import "../css/footer.scss"
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
            toggleMore: function (e) {
//                var cn = e.target.className
//                // if (cn.indexOf('active_ellipsisIcon') > -1) {
//                if (this.footer_hide_item_flag) {
//                    e.target.className = 'iconfont comicon-05 ellipsisIcon'
//                    this.footer_hide_item_flag = false
//                } else {
//                    e.target.className = 'iconfont comicon-05 ellipsisIcon active_ellipsisIcon'
//                    this.fo_thisoter_hide_item_flag = true
//                }
                this.footer_hide_item_flag = !this.footer_hide_item_flag;
            },
            gotoUrl: function (path) {
                this.$refs.ellipsisIcon.className = 'iconfont comicon-05 ellipsisIcon'
                this.footer_hide_item_flag = false
                this.$router.push({
                    path: path
                })
            }
        },
        mounted() {
            var _this=this;
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
