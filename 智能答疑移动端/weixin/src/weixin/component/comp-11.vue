<!--修改日期：2017/6/20  11:00-->

<template>
    <div class="table_list" :key="(new Date()).getTime()">
        <div v-if="pick_items">
            <div class="title">
                <span :class="title_idx==0?'active':''" :style="{background: title_idx==0?$store.state.themeColor:''}"
                      @click="title_idx=0;url=$store.state.host + $store.state.baseUrl + '/findMajorScoreCompareList'"> 各年度分专业录取情况 </span>
                <span :class="title_idx==1?'active':''" :style="{background: title_idx==1?$store.state.themeColor:''}"
                      @click="title_idx=1;url=$store.state.host + $store.state.baseUrl + '/findMajorScoreList'"> 单个专业不同年度录取情况 </span>
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
                        <option v-for="x of pick_items.scienceList" v-text="x">文科</option>
                    </select>
                </div>
                <div v-show="title_idx==0" class="pick_item">
                    <span class="pick_name">年&#12288;&#12288;度：</span>
                    <select v-model="year">
                        <option v-for="x of pick_items.yearList" v-text="x"></option>
                    </select>
                </div>
                <div class="pick_item">
                    <span class="pick_name">招生类型：</span>
                    <select v-model="etype">
                        <option v-for="x of pick_items.typeList" v-text="x"></option>
                    </select>
                </div>
                <div class="pick_item">
                    <span class="pick_name">录取批次：</span>
                    <select v-model="batch">
                        <option v-for="x of pick_items.batchList" v-text="x"></option>
                    </select>
                </div>
                <div v-show="title_idx==1" class="pick_item">
                    <span class="pick_name">专&#12288;&#12288;业：</span>
                    <select v-model="major">
                        <option v-for="x of pick_items.majorList" v-text="x"></option>
                    </select>
                </div>
            </div>
            <div class="table_picks">
                <span :style="{'border-color': table_idx==0?$store.state.themeColor:''}"
                      @click="table_idx=0">学校录取信息横向列表</span>
                <span :style="{'border-color': table_idx==1?$store.state.themeColor:''}" @click="table_idx=1">学校录取分差纵向走势图</span>
            </div>
        </div>
        <h3 v-show="table_idx==0">(表格可滑动)</h3>
        <div v-show="table_idx==0" class="t_table">
            <div class="t_head">
                <div class="left" :style="{background: $store.state.themeColor,color:'#fff'}">
                    <span class="x" :style="{background: $store.state.themeColor,color:'#fff'}">
                        <b>专业</b>
                        <b>详情</b>
                    </span>
                </div>
                <div class="right" ref="tright" id="tright">
                    <div class="main" id="tmain" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"
                         ref="tmain" :key="(new Date()).getTime()">
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">年度</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">省线</span>
                        <!--<span :style="{background: $store.state.themeColor,color:'#fff'}">招生计划</span>-->
                        <!--<span :style="{background: $store.state.themeColor,color:'#fff'}">实际录取</span>-->
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">最低分</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">平均分</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">最高分</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">最低分分差</span>
                        <span :style="{background: $store.state.themeColor,color:'#fff'}">平均分分差</span>
                    </div>
                </div>
            </div>
            <!--<div class="t_body" @touchstart="touchstart2" @touchmove.prevent="touchmove2" @touchend="touchend2"-->
                 <!--ref="tbody" :key="(new Date()).getTime()">-->
            <div class="t_body">
                <div class="left">
                    <span v-for="x of yDataList" :style="{background: $store.state.themeColor,color:'#fff'}"
                          v-text="x.majorName"></span>
                </div>
                <div class="right">
                    <div class="main" id="smain" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"
                         ref="smain" :key="(new Date()).getTime()">
                        <div class="mitem" v-for="x of yDataList">
                            <span v-text="x.year?x.year:noneData"></span>
                            <span v-text="x.scoreLine?x.scoreLine:noneData"></span>
                            <!--<span v-text="x.enrollPlan"></span>-->
                            <!--<span v-text="x.enrollNum"></span>-->
                            <span v-text="x.lowScore?x.lowScore:noneData"></span>
                            <span v-text="x.avgScore?parseInt(x.avgScore):noneData"></span>
                            <span v-text="x.hightScore?x.hightScore:noneData"></span>
                            <span v-text="(x.lowScore&&x.scoreLine)?parseInt(x.lowScore-x.scoreLine):noneData"></span>
                            <span v-text="(x.avgScore&&x.scoreLine)?parseInt(x.avgScore-x.scoreLine):noneData"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="title_idx==0&&table_idx==1" id="main"></div>
        <div v-show="title_idx==1&&table_idx==1" id="main2"></div>
        <loading-img></loading-img>
    </div>
</template>
<script type="text/javascript">
    import loadingImg from './loadingImg2.vue'
    //import $ from '../lib/jquery-1.11.3.js';
    var translateXFlag = false
    var x = 0
    var translateX = 0
    var translateXFlag2 = false
    var x2 = 0
    var translateX2 = 0
    export default {
        props: ['infoId'],
        components: {loadingImg},
        data() {
            return {
                noneData: '-',
                picksFlag: false,
                tableFlag: false,
                barFlag: false,
                lineFlag: false,
                title_idx: 0,
                table_idx: 0,
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
                url: this.$store.state.host + this.$store.state.baseUrl + '/findMajorScoreCompareList'
            }
        },
        computed: {
            yData: function () {
                return {
                    sCode: this.$store.state.scode,
                    year: this.year,
                    needPage: false,
                    cityName: this.city,
                    type: this.etype,
                    scienceClass: this.science,
                    batch: this.batch,
                    majorName: this.major
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
            table_idx: function (v) {
                if (v == 1) {
                    if (this.title_idx == 0) {
                        setTimeout(() => {
                            this.drawBar()
                        }, 0)
                    } else {
                        setTimeout(() => {
                            this.drawLine()
                        }, 0)
                    }
                }
            },
            title_idx: function (v) {
                this.table_idx = 0
                // if(this.table_idx==1){
                //     if(v==0){

                //     }else{
                //         setTimeout(() => {
                //             this.drawLine()
                //         }, 0)
                //     }
                // }
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
                    // var w = parseInt(this.$refs.tbody.offsetHeight)
                    if (e.targetTouches[0].clientY - x2 > 0 || e.targetTouches[0].clientY - x2 < -(1500 / 64 * parseInt(document.documentElement.style.fontSize))) return;
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
                        // console.log(res.data)
                        this.yDataList = res.data

                        if (this.table_idx == 1) {
                            if (this.title_idx == 0) {
                                setTimeout(() => {
                                    this.drawBar()
                                }, 0)
                            } else {
                                setTimeout(() => {
                                    this.drawLine()
                                }, 0)
                            }
                        }
                    })
            },
            drawLine: function () {
                var myChart2 = echarts.init(document.getElementById('main2'));
                var option2 = {
                    title: {
                        // text: '1111'
                    },
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            fontSize: 24 / 64 * parseInt(document.documentElement.style.fontSize)
                        },
                        padding: 5 / 64 * parseInt(document.documentElement.style.fontSize),
                        formatter: function (params) {
                            var res = params[0].name + '<br/>';
                            for (var i = 0; i < params.length; i++) {
                                res += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:0.2rem;height:0.2rem;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ':' + params[i].value + '<br/>';

                            }
                            return res;
                        }
                    },
                    legend: {
                        data: ['平均分分差'],
                        itemWidth: 20 / 64 * parseInt(document.documentElement.style.fontSize),
                        itemHeight: 20 / 64 * parseInt(document.documentElement.style.fontSize),
                    },
                    textStyle: {
                        fontSize: 24 / 64 * parseInt(document.documentElement.style.fontSize)
                    },
                    grid: {
                        width: '90%',
                        height: '90%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    toolbox: {
                        // feature: {
                        //     saveAsImage: {}
                        // }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.yDataList.map(function (x) {
                            return x.year
                        }),
                        axisLabel: {
                            textStyle: {
                                fontSize: 24 / 64 * parseInt(document.documentElement.style.fontSize)
                            },

                        },
                        splitLine: {
                            lineStyle: {
                                width: 2 / 64 * parseInt(document.documentElement.style.fontSize),
                                type: 'dashed'
                            },

                        },
                        axisLine: {
                            lineStyle: {
                                width: 3 / 64 * parseInt(document.documentElement.style.fontSize),
                            }
                        },
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                fontSize: 24 / 64 * parseInt(document.documentElement.style.fontSize)
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                width: 2 / 64 * parseInt(document.documentElement.style.fontSize),
                                type: 'dashed'
                            },

                        },
                        axisLine: {
                            lineStyle: {
                                width: 3 / 64 * parseInt(document.documentElement.style.fontSize),
                            }
                        },
                    },
                    series: [{
                        name: '平均分分差',
                        type: 'line',
                        // stack: '总量',
                        data: this.yDataList.map(function (x) {
                            return parseInt(x.avgScore - x.scoreLine)
                        }),
                        lineStyle: {
                            normal: {
                                width: 3 / 64 * parseInt(document.documentElement.style.fontSize),
                            }
                        },
                        symbolSize: 15 / 64 * parseInt(document.documentElement.style.fontSize),
                    }]

                }
                myChart2.setOption(option2);
            },
            drawBar: function () {
                var main = document.getElementById('main')
                main.style.height = 50 * this.yDataList.length + 'px';
                var myChart = echarts.init(main);
                // 指定图表的配置项和数据
                var option = {
                    title: {
                        // text: ''
                    },
                    tooltip: {
                        textStyle: {
                            fontSize: 24 / 64 * parseInt(document.documentElement.style.fontSize)
                        },
                        padding: 5 / 64 * parseInt(document.documentElement.style.fontSize),
                        formatter: '{b}<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:0.2rem;height:0.2rem;background-color:#ffc89d"></span>{a0}:{c0}',
                    },
                    legend: {
                        data: ['人数'],
                        width: '80%',
                        itemWidth: 30 / 64 * parseInt(document.documentElement.style.fontSize),
                        itemHeight: 30 / 64 * parseInt(document.documentElement.style.fontSize),
                    },
                    xAxis: {
                        type: 'value',

                        axisLabel: {
                            textStyle: {
                                fontSize: 24 / 64 * parseInt(document.documentElement.style.fontSize)
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                width: 2 / 64 * parseInt(document.documentElement.style.fontSize),
                                type: 'dashed'
                            },

                        },
                        axisLine: {
                            lineStyle: {
                                width: 3 / 64 * parseInt(document.documentElement.style.fontSize),
                            }
                        },
                        // max:'dataMax',
                    },
                    yAxis: {
                        type: 'category',
                        data: this.yDataList.map(function (x) {
                            return x.majorName.length > 5 ? x.majorName.substr(0, 5) + '...' : x.majorName
                        }),
                        axisLabel: {
                            textStyle: {
                                fontSize: 24 / 64 * parseInt(document.documentElement.style.fontSize)
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                width: 2 / 64 * parseInt(document.documentElement.style.fontSize),
                                type: 'dashed'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                width: 3 / 64 * parseInt(document.documentElement.style.fontSize),
                            }
                        }
                    },
                    series: [{
                        name: '平均分分差',
                        type: 'bar',
                        data: this.yDataList.map(function (x) {
                            return parseInt(x.avgScore - x.scoreLine)
                        }),
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                    }],
                    color: ['#ffc89d'],
                    textStyle: {
                        fontSize: 24 / 64 * parseInt(document.documentElement.style.fontSize)
                    },
                    grid: {
                        tooltip: {
                            textStyle: {
                                fontSize: 24 / 64 * parseInt(document.documentElement.style.fontSize)
                            }
                        },
                        width: '90%',
                        height: '90%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                        borderWidth: 10 / 64 * parseInt(document.documentElement.style.fontSize)

                    }
                };
                myChart.setOption(option);
            },
        },
        mounted() {
            var state = this.$store.state
            var url = state.host + state.baseUrl + '/majorScore'
            this.$http.post(url, {
                scode: state.scode
            }, {
                emulateJSON: true
            })
                .then(res => {
                    // console.log(res.data)
                    this.pick_items = res.data
                    this.city = res.data.cityList[0].name
                    this.science = res.data.scienceList[0]
                    this.year = res.data.yearList[0]
                    this.etype = res.data.typeList[0]
                    this.batch = res.data.batchList[0]
                    this.major = res.data.majorList[0]

                    // this.getYData()
                })

        }
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
        // height: pxToRem(800);
        margin-top: pxToRem(40);
        span {
            width: .2rem;
            height: .2rem;
        }
    }

    #main2 {
        height: pxToRem(800);
    }
</style>
