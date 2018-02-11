<!--修改日期：2017/6/20  11:00-->

<template>
    <div class="table_list" :key="(new Date()).getTime()">
        <div v-if="pick_items">
            <div class="title" v-if="$store.state.scode=='NLGYFE'">
                <span :class="title_idx==1?'active':''" :style="{background: title_idx==1?$store.state.themeColor:''}"
                      @click="title_idx=1;url=$store.state.host + $store.state.baseUrl + '/findEnrollPlanDetail'"> 专业历年招生计划 </span>
                <span :class="title_idx==0?'active':''" :style="{background: title_idx==0?$store.state.themeColor:''}"
                      @click="title_idx=0;url=$store.state.host + $store.state.baseUrl + '/findEnrollPlan'"> 学校历年招生计划 </span>
            </div>
            <div class="title" v-if="$store.state.scholl.code!='NLGYFE'">
                <span :class="title_idx==0?'active':''" :style="{background: title_idx==0?$store.state.themeColor:''}"
                      @click="title_idx=0;url=$store.state.host + $store.state.baseUrl + '/findEnrollPlan'"> 学校历年招生计划 </span>
                <span :class="title_idx==1?'active':''" :style="{background: title_idx==1?$store.state.themeColor:''}"
                      @click="title_idx=1;url=$store.state.host + $store.state.baseUrl + '/findEnrollPlanDetail'"> 专业历年招生计划 </span>
            </div>
            <div class="pick_items">
                <div class="pick_item">
                    <span class="pick_name">生&#32;源&#32;地：</span>
                    <select v-model="city">
                        <option v-for="x of pick_items.cityList" v-text="x.name"></option>
                    </select>
                </div>
                <div class="pick_item">
                    <span class="pick_name">科&#12288;&#12288;类：</span>
                    <select v-model="science">
                        <option selected>全部</option>
                        <option v-for="x of pick_items.scienceList" v-text="x">文科</option>
                    </select>
                </div>
                <div class="pick_item">
                    <span class="pick_name">年&#12288;&#12288;度：</span>
                    <select v-model="year">
                        <option v-for="x of pick_items.yearList" v-text="x"></option>
                    </select>
                </div>
                <div class="pick_item">
                    <span class="pick_name">招生类型：</span>
                    <select v-model="etype">
                        <option value="全部" selected>全部</option>
                        <option v-for="x of pick_items.typeList" v-text="x"></option>
                    </select>
                </div>
                <div class="pick_item">
                    <span class="pick_name">录取批次：</span>
                    <select v-model="batch">
                        <option value="全部" selected>全部</option>
                        <option v-for="x of pick_items.batchList" v-text="x"></option>
                    </select>
                </div>
                <div v-show="title_idx==1" class="pick_item">
                    <span class="pick_name">专&#12288;&#12288;业：</span>
                    <select v-model="major">
                        <option value="" selected>全部</option>
                        <option v-for="x of pick_items.majorList" v-text="x"></option>
                    </select>
                </div>
            </div>
        </div>
        <h3>(表格可滑动)</h3>
        <div class="t_table">
            <div class="t_head">
                <div class="left">
                    <span class="x" :style="{background: $store.state.themeColor,color:'#fff'}">
                        <b>年度</b>
                        <b>详情</b>
                    </span>
                </div>
                <div class="right" ref="tright" id="tright">
                    <div class="main" id="tmain" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"
                         ref="tmain" :key="(new Date()).getTime()">
                        <span :style="{background: $store.state.themeColor,color:'#fff'}"
                              v-show="title_idx==1">专业</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">计划招生人数</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">招生类型</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">录取批次</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">生源地</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">科类</span>
                    </div>
                </div>
            </div>
            <!-- <div class="t_body" @touchstart="touchstart2" @touchmove.prevent="touchmove2" @touchend="touchend2" ref="tbody" :key="(new Date()).getTime()"> -->
            <div class="t_body">
                <div class="left">
                    <span v-for="x of yDataList" :style="{background: $store.state.themeColor,color:'#fff'}"
                          v-text="x.year?x.year:noneData"></span>
                </div>
                <div class="right">
                    <div class="main" id="smain" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"
                         ref="smain" :key="(new Date()).getTime()">
                        <div class="mitem" v-for="x of yDataList">
                            <span v-show="title_idx==1" v-text="x.majorName?x.majorName:noneData"></span>
                            <span v-text="title_idx==0?(x.totalNum?x.totalNum:noneData):(x.enrollNum?x.enrollNum:noneData)"></span>
                            <span v-text="x.enrollType?x.enrollType:noneData"></span>
                            <span v-text="x.batch?x.batch:noneData"></span>
                            <span v-text="x.cityName?x.cityName:noneData"></span>
                            <span v-text="x.science?x.science:noneData"></span>
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
//    import $ from '../lib/jquery-1.11.3.js';

    var translateXFlag = false
    var x = 0
    var translateX = 0
    var translateXFlag2 = false
    var x2 = 0
    var translateX2 = 0
    export default {
        components: {loadingImg},
        data() {
            return {
                noneData: '-',  //此处为新增
                picksFlag: false,
                tableFlag: false,
                barFlag: false,
                lineFlag: false,
                title_idx: this.$store.state.scode == 'NLGYFE' ? 1 : 0,
                table_idx: this.$store.state.scode == 'NLGYFE' ? 1 : 0,
                // x:0,
                // translateX:0,
                // translateXFlag:false,
                tx: 0,
                pick_items: null,
                city: '',
                science: '',
                year: '',
                etype: '',
                batch: '',
                major: '',
                yDataList: null,
                url: this.$store.state.scode == 'NLGYFE' ? (this.$store.state.host + this.$store.state.baseUrl + '/findEnrollPlanDetail') : (this.$store.state.host + this.$store.state.baseUrl + '/findEnrollPlan'),
            }
        },
        computed: {
            yData: function () {
                return {
                    sCode: this.$store.state.scode,
                    year: this.year,
                    needPage: false,
                    cityName: this.city,
                    enrollType: this.etype == '全部' ? '' : this.etype,
                    science: this.science=='全部'?'':this.science,
                    batch: this.batch == '全部' ? '' : this.batch,
                    majorName: this.title_idx == 1 ? this.major : ''
                }
            }
        },
        watch: {
            yData: function () {
                this.getYData()
                translateX = 0
            },
            url: function () {
                this.getYData()
                translateX = 0
            },
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
                        console.log(this.yDataList);
                    })
            },
        },
        mounted() {
            var state = this.$store.state
            var url = state.host + state.baseUrl + '/enrollPlan?scode=' + state.scode
            this.$http.get(url)
                .then(res => {
                    this.pick_items = res.data
                    this.city = res.data.cityList[0].name
//                    this.science = res.data.scienceList[0]
                    this.science='全部'
                    this.year = res.data.yearList[0]
                    //this.etype = res.data.typeList[0]
                    //this.batch = res.data.batchList[0]
                    //this.major = res.data.majorList[0]
                    this.etype = '全部'
                    this.batch = '全部'
                    this.major = ''

                })



        },
        props: ['infoId']
    }
</script>
<style lang="scss" scoped>
    @import "../css/common.scss";

    * {
        box-sizing: border-box
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
            width: pxToRem(300);
            float: left;
            margin: 0 pxToRem(35) pxToRem(10) 0;
            .pick_name {
                float: left;
                width: pxToRem(150);
                font-size: pxToRem(28);
                white-space: nowrap;
            }
            select {
                float: left;
                width: pxToRem(150);
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
                        /*border: pxToRem(2) solid #ddd;*/
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
                width: pxToRem(170);
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
                font-size: pxToRem(28); //此处为新增
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
                height: pxToRem(200);
                /*这里需要自己调整，根据td的宽度和高度*/
                top: 0;
                left: 0;
                background-color: #fff;;
                display: block;
                transform: rotate(-68deg);
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
