<!--修改日期：2017/6/20  11:00-->

<template>
    <div class="table_list" :key="(new Date()).getTime()">
        <div>
            <div class="pick_items">
                <div class="pick_item">
                    <span class="pick_name">专业名称：</span>
                    <select v-model="major">
                        <option></option>
                        <option v-for="x of sList" v-text="x.name"></option>
                    </select>
                </div>
            </div>
        </div>
        <h3>(表格可滑动)</h3>
        <div class="t_table">
            <div class="t_head">
                <div class="left">
                    <span class="x majorWidth" :style="{background: $store.state.themeColor,color:'#fff'}">
                        <b>专业</b>
                        <b>详情</b>
                    </span>
                </div>
                <div class="right" ref="tright" id="tright">
                    <div class="main" id="tmain" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"
                         ref="tmain" :key="(new Date()).getTime()+1">
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">代码</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">专业</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">院系</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">研究方向</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">导师</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">类型</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">指南</span>
                    </div>
                </div>
            </div>
            <!--<div class="t_body" @touchstart="touchstart2" @touchmove.prevent="touchmove2" @touchend="touchend2"-->
                 <!--ref="tbody" :key="(new Date()).getTime()">-->
            <div class="t_body">
                <div class="left">
                    <span class="majorWidth" v-for="x of rList" :style="{background: $store.state.themeColor,color:'#fff'}"
                          v-text="x.name?x.name:noneData"></span>
                </div>
                <div class="right">
                    <div class="main" id="smain" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"
                         ref="smain" :key="(new Date()).getTime()+2">
                        <div class="mitem" v-for="x of rList">
                            <span v-text="x.majorCode?x.majorCode:noneData"></span>
                            <span v-text="x.majorName?x.majorName:noneData"></span>
                            <span v-text="x.department?x.department:noneData"></span>
                            <span v-text="x.name?x.name:noneData"></span>
                            <span v-text="x.mentors?x.mentors:noneData"></span>
                            <span v-text="x.typeStr?x.typeStr:noneData"></span>
                            <span @click="$router.push('/articleDetail2?specType=research-detail&id='+x.id)">详情</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loading-img></loading-img>
    </div>
</template>
<script type="text/javascript">
    import loadingImg from './loadingImg2.vue'

    var translateXFlag = false
    var x = 0
    var translateX = 0
    var translateXFlag2 = false
    var x2 = 0
    var translateX2 = 0
    export default {
        components: {loadingImg},
        props: ['infoId'],
        data() {
            return {
                noneData: '-',
                sList: null,
                major: '',
                rList: '',
            }
        },
        computed: {},
        watch: {
            major: function (v) {
                console.log(v)
                if (v != '') {
                    var state = this.$store.state
                    var url2 = state.host + state.baseUrl + '/getMajorResearchList'
                    this.$http.post(url2, {scode: state.scode, majorName: v, needPage: false}, {emulateJSON: true})
                        .then(res => {
                            this.rList = res.data.data
                        })
                }
            }
        },
        methods: {
            touchstart: function (e) {
                translateXFlag = true;
                x = -translateX + e.targetTouches[0].clientX
            },
            touchmove: function (e) {
                if (translateXFlag) {
                    var w = parseInt(this.$refs.tright.offsetWidth) - parseInt(this.$refs.tmain.offsetWidth)
                    if (e.targetTouches[0].clientX - x > 0 || e.targetTouches[0].clientX - x < w) return;
                    translateX = (e.targetTouches[0].clientX - x)

                    // console.log(translateX,w)
                    // console.log(this.$refs.tmain.style.transform)
                    this.$refs.tmain.style.transform = 'translateX(' + translateX + 'px)'
                    this.$refs.smain.style.transform = 'translateX(' + translateX + 'px)'

                }
            },
            touchend: function (e) {
                translateXFlag = false;
            },
            touchstart2: function (e) {
                translateXFlag2 = true;
                x2 = -translateX2 + e.targetTouches[0].clientY
            },
            touchmove2: function (e) {
                if (translateXFlag2) {
                    // if (e.targetTouches[0].clientY - x2 > 0 || e.targetTouches[0].clientY - x2 < -(1500/64*parseInt(document.documentElement.style.fontSize))) return;
                    if (e.targetTouches[0].clientY - x2 > 0 || e.targetTouches[0].clientY - x2 < -this.$refs.tbody.offsetHeight * 0.9) return;
                    translateX2 = (e.targetTouches[0].clientY - x2)
                    // console.log(translateX,w)
                    // console.log(this.$refs.tmain.style.transform)
                    this.$refs.tbody.style.transform = 'translateY(' + translateX2 + 'px)'

                }
            },
            touchend2: function (e) {
                translateXFlag2 = false;
            },
            getYData: function () {
                this.$http.post(this.url, this.yData, {
                    emulateJSON: true
                })
                    .then(res => {
                        this.yDataList = res.data.data
                    })
            },
        },
        mounted() {
            var state = this.$store.state
            var url = state.host + state.baseUrl + '/getMajorList?needPage=false&sCode=' + state.scode
            var url2 = state.host + state.baseUrl + '/getMajorResearchList'
            this.$http.get(url)
                .then(res => {
                    this.sList = res.data.data
                    this.$http.post(url2, {scode: state.scode, needPage: false}, {emulateJSON: true})
                        .then(res => {
                            this.rList = res.data.data
                        })
                })

        }
    }
</script>
<style lang="scss" scoped>
    @import "../css/common.scss";

    * {
        box-sizing: border-box
    }

    .majorWidth{
        width:pxToRem(280) !important;
    }

    .table_list {
        padding: pxToRem(40);
        h3 {
            text-align: right;
            color: #999;
            margin-bottom: pxToRem(20);
        }
        .title {
            height: pxToRem(60);
            display: flex;
            margin-bottom: pxToRem(20);
            span {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #e5e5e5;
                white-space: nowrap;
                font-size: pxToRem(24);
                &.active {
                    color: #fff;
                }
            }
        }
        .pick_items {
            overflow: hidden;
        }
        .pick_item {
            width: pxToRem(600);
            float: left;
            margin: 0 pxToRem(35) pxToRem(30) 0;
            .pick_name {
                float: left;
                width: pxToRem(150);
                font-size: pxToRem(28);
                white-space: nowrap;
            }
            select {
                float: left;
                width: pxToRem(450);
            }
        }
        .table_picks {
            margin-top: pxToRem(30);
            margin-bottom: pxToRem(15);
            display: flex;
            justify-content: space-between;
            span {
                font-size: pxToRem(28);
                border-bottom: pxToRem(3) solid #ddd;
                width: pxToRem(320);
                text-align: center;
                padding-bottom: pxToRem(15);
            }
        }
        .t_table {
            .t_head,
            .t_body {
                font-size: 0; //此处为新增
                overflow: hidden;
                display: flex;
                .left {
                    /***************************影响左侧方格*********************************/

                    span {
                        /*float: left;*/
                        /*margin-bottom: pxToRem(2);*/
                        position: relative;
                        &:after {
                            content: '';
                            width: 100%;
                            height: 1px;
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            background: #eee;
                            z-index: 1000;
                        }
                    }
                }
                .mitem {
                    /*float: left;*/
                    /*height: inherit;*/
                    /*margin-bottom: pxToRem(2);*/
                    &:nth-of-type(2n) {
                        background: #e2f1f9;
                    }
                    /**********************************影响右侧方格****************************/

                    span {
                        /*border: pxToRem(3) solid #ddd;*/
                        /*border-top: 0;*/
                        /*border-left: 0;*/
                        border-right: 1px solid #ddd;
                        border-bottom: 1px solid #ddd;
                    }
                }
            }
            .t_body {
                .main,
                .right {
                    overflow: visible !important;
                }
            }
            .left,
            .right {
                float: left;
            }
            .left {
                width: pxToRem(280);
                z-index: 998;
            }
            .right {
                flex: 1;
                position: relative;
                overflow: hidden;
                height: pxToRem(70);
                font-size: 0;
                .main {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    span {
                        font-size: pxToRem(28);
                        // float: left;
                    }
                }
            }
            /*************************************影响所有方格的******************************/

            span {
                display: inline-block;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                border-right: 1px solid #fff;
                height: pxToRem(70);
                line-height: pxToRem(70);
                width: pxToRem(170);
                font-weight: 300;
                font-size: pxToRem(28);
            }
            .x {
                display: flex;
                width: pxToRem(170);
                position: relative;
                box-sizing: border-box;
                justify-content: space-between;
                align-items: center;
                b {
                    font-weight: 300;
                    position: relative;
                }
                b:first-child {
                    top: pxToRem(11);
                }
                b:last-child {
                    top: pxToRem(-11);
                }
            }
            .x:before {
                content: "";
                position: absolute;
                width: pxToRem(1);
                height: pxToRem(400);
                /*这里需要自己调整，根据td的宽度和高度*/
                top: 0;
                left: 0;
                background-color: #fff;;
                display: block;
                transform: rotate(-76deg);
                /*这里需要自己调整，根据线的位置*/
                transform-origin: top;
            }
        }
    }

    #main,
    #main2 {
        width: 100%;
        height: pxToRem(800);
        margin-top: pxToRem(40);
        span {
            width: .2rem;
            height: .2rem;
        }
    }
</style>
