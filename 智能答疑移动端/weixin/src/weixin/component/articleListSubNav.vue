<template>
    <div>
        <div class="swiper-container sub_navs_swiper" :style="{background:$store.state.themeColor}">
            <div class="swiper-wrapper" ref="sub_navs_swiper_wrap">
                <div v-for="(x,idx) in subNavData" @click="tapAction(idx,x.name)"
                     :class="tapIndex==idx?'swiper-slide sub_active':'swiper-slide'">
                    <i v-if="x.icon" :class="x.icon"></i>
                    <img v-else-if="x.imgUrl" :src="$store.state.imgHost+x.imgUrl"/>
                    <i v-else></i>
                    <span v-text="x.name"></span>
                </div>

            </div>
        </div>
        <v-subCon :flag="flag"
                  :subConData2="clickData.length?clickData:(mySubConData2.length?mySubConData2:subConData2)"></v-subCon>
    </div>
</template>

<script type="text/javascript">
    import "../css/articleListSubNav.scss";
    // import $ from "../lib/jquery-1.11.3.js";
    import {mapActions} from 'vuex'

    export default {
        created(){
//            sessionStorage.setItem('threeCatName',(this.$store.state.subNavData.name?this.$store.state.subNavData.name:''));
        },
        computed: {
            subNavData: function () {
                return this.$store.state.subNavData
            },
            flag: function () {
                return this.subNavData.length > 0
            }
        },
        data() {
            return {
                clickData: [],
//                tapIndex: 0,
                subConData2: this.$store.state.subConData
            }
        },
        methods: {
            tapAction: function (idx,name) {

                sessionStorage.setItem('threeCatName',(name?name:''));

                sessionStorage.setItem('tapIndex', idx);

                this.$parent.endFlag = false
                this.$parent.curPage = 1
                this.tapIndex = idx;
                this.$children[0].$refs.article_list.scrollTop = 0
                // ajax请求 this.subConData
                var state = this.$store.state
                this.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentlist?curPage=1&pageSize=20&catId=' + this.subNavData[idx].catId)
                    .then(res => {
//                            this.CHANGE_SUBCONDATA(res.data.data);
                        this.subConData2 = res.data.data;
                        this.clickData = res.data.data;
                        var _this = this;
                        sessionStorage.setItem('subConData2', JSON.stringify(_this.subConData2));
                    }, err => {
                        console.log(err)
                    })
            },
            ...mapActions(['CHANGE_SUBCONDATA']),
        },
        components: {
            "v-subCon": require("../component/articleListSubCon.vue"),
        },
        props: ['tapIndex', 'mySubConData2']
//        mounted:function(){
//            this.tapIndex = 0
//        }
    }
</script>