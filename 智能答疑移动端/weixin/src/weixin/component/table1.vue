<template>
    <div class="table_list">
        <div v-if="picksFlag">
            <div class="title">
                <span :class="title_idx==0?'active':''" :style="{background: title_idx==0?$store.state.themeColor:''}" @click="title_idx=0">各年度分专业录取情况</span>
                <span :class="title_idx==1?'active':''" :style="{background: title_idx==1?$store.state.themeColor:''}" @click="title_idx=1">单个专业不同年度录取情况</span>
            </div>
            <div class="pick_items">
                <div class="pick_item">
                    <span class="pick_name">生&#32;源&#32;地：</span>
                    <select>
                        <option>湖北</option>
                        <option>上海</option>
                        <option>北京</option>
                    </select>
                </div>
                <div class="pick_item">
                    <span class="pick_name">科&#12288;&#12288;类：</span>
                    <select>
                        <option>文科</option>
                        <option>理科</option>
                        <option>艺术生</option>
                        <option>体育生</option>
                    </select>
                </div>
                <div class="pick_item">
                    <span class="pick_name">年&#12288;&#12288;度：</span>
                    <select>
                        <option>2016</option>
                        <option>2015</option>
                        <option>2014</option>
                    </select>
                </div>
                <div class="pick_item">
                    <span class="pick_name">招生类型：</span>
                    <select>
                        <option>普通招生</option>
                        <option>特长生</option>
                        <option>艺术生</option>
                    </select>
                </div>
                <div class="pick_item">
                    <span class="pick_name">录取批次：</span>
                    <select>
                        <option>本科一批</option>
                        <option>本科二批</option>
                        <option>专科</option>
                    </select>
                </div>
            </div>
            <div class="table_picks">
                <span :style="{'border-color': table_idx==0?$store.state.themeColor:''}" @click="table_idx=0">多个专业横向展示</span>
                <span :style="{'border-color': table_idx==1?$store.state.themeColor:''}" @click="table_idx=1">多个专业横向比较</span>
            </div>
        </div>
        <div v-if="tableFlag" class="t_table">
            <div class="t_head">
                <div class="left">
                    <span class="x" :style="{background: $store.state.themeColor,color:'#fff'}">
                    	<b>专业</b>
                    	<b>详情</b>
                    </span>
                </div>
                <div class="right" ref="tright" id="tright">
                    <div class="main" id="tmain" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" ref="tmain">
                        <span :style="{background: $store.state.themeColor,color:'#fff'}" v-for="x of 7" v-text="'item'+x"></span>
                    </div>
                </div>
            </div>
            <div class="t_body">
                <div class="left">
                    <span v-for="x of 7" :style="{background: $store.state.themeColor,color:'#fff'}">保险学</span>
                </div>
                <div class="right">
                    <div class="main" id="smain" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" ref="smain">
                        <div class="mitem" v-for="i of 7">
                            <span v-for="n of 7"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="barFlag" id="main"></div>
        <div id="main2"></div>
    </div>
</template>
<script type="text/javascript">
import $ from '../lib/jquery-1.11.3.js';
var translateXFlag = false
var x = 0
var translateX = 0
export default {
    data() {
            return {
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
            }
        },
        methods: {
            touchstart: function(e) {
                translateXFlag = true;
                x = -translateX + e.targetTouches[0].clientX
            },
            touchmove: function(e) {
                if (translateXFlag) {
                    translateX = (e.targetTouches[0].clientX - x)
                    var w = parseInt(this.$refs.tright.offsetWidth) - parseInt(this.$refs.tmain.offsetWidth)
                    if (translateX > 0 || translateX < w) return
                    this.$refs.tmain.style.transform = 'translateX(' + translateX + 'px)'
                    this.$refs.smain.style.transform = 'translateX(' + translateX + 'px)'
                }
            },
            touchend: function(e) {
                translateXFlag = false;
            }
        },
        props: ['specType'],
        watch: {
            specType: function(v) {
                var state = this.$store.state
                var url = state.host + state.baseUrl
                if (v == 6) {
                    url += '/getMajorConf?scode=' + state.scode
                } else if (v == 8) {
                    url += '/enrollPlan?scode=' + state.scode
                }
                this.$http.get(url)
                    .then(res => {
                        console.log(res.data)
                    })
            }
        },
        mounted() {
            // 基于准备好的dom，初始化echarts实例
            // var myChart = echarts.init(document.getElementById('main'));
            var myChart2 = echarts.init(document.getElementById('main2'));

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
                    formatter: '{b}<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:0.2rem;height:0.2rem;background-color:#ffc89d"></span>{a0}:{c0}%',
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
                    data: ['保险学', '保险学2', '保险学3', '保险学4', '保险学5', '保险学6', '保险学7'],
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
                    name: '人数',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20, 30],
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


            var option2 = {
                title: {
                    // text: ''
                },
                tooltip: {
                    trigger: 'axis',
                    textStyle: {
                        fontSize: 24 / 64 * parseInt(document.documentElement.style.fontSize)
                    },
                    padding: 5 / 64 * parseInt(document.documentElement.style.fontSize),
                    formatter: function(params) {
                        var res = params[0].name + '<br/>';
                        for (var i = 0; i < params.length; i++) {
                            res += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:0.2rem;height:0.2rem;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ':' + params[i].value + '<br/>';

                        }
                        return res;
                    }
                },
                legend: {
                    data: ['最低分分差', '平均分分差'],
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
                    data: ['2013', '2014', '2015', '2016'],
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
                    name: '最低分分差',
                    type: 'line',
                    // stack: '总量',
                    data: [70, 52, 61, 74],
                    lineStyle: {
                        normal: {
                            width: 3 / 64 * parseInt(document.documentElement.style.fontSize),
                        }
                    },
                    symbolSize: 15 / 64 * parseInt(document.documentElement.style.fontSize),
                }, {
                    name: '平均分分差',
                    type: 'line',
                    // stack: '总量',
                    data: [100, 112, 91, 104],
                    lineStyle: {
                        normal: {
                            width: 3 / 64 * parseInt(document.documentElement.style.fontSize),
                        }
                    },
                    symbolSize: 15 / 64 * parseInt(document.documentElement.style.fontSize),
                }]

            }

            // 使用刚指定的配置项和数据显示图表。
            // myChart.setOption(option);
            myChart2.setOption(option2);
        }
}
</script>
<style lang="scss" scoped>
@import "../css/common.scss";
.table_list {
    padding: 0 pxToRem(40);
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
            overflow: hidden;
            display: flex;
            .left {
                span {
                    float: left;
                    margin-bottom: pxToRem(2);
                }
            }
            .mitem {
                float: left;
                height: inherit;
                margin-bottom: pxToRem(2);
                &:nth-of-type(2n) {
                    background: #e2f1f9;
                }
                span {
                    border: pxToRem(2) solid #ddd;
                    border-top: 0;
                    border-left: 0;
                }
            }
        }
        .t_body {
            .main,
            .right {
                overflow: visible!important;
            }
        }
        .left,
        .right {
            float: left;
        }
        .left {
            width: pxToRem(170);
            z-index: 999;
        }
        .right {
            flex: 1;
            position: relative;
            overflow: hidden;
            height: pxToRem(70);
            .main {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                overflow: hidden;
                white-space: nowrap;
                span {
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
            border-right: pxToRem(1) solid #fff;
            height: pxToRem(70);
            line-height: pxToRem(70);
            width: pxToRem(170);
            font-weight: 300;
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
            background-color: #fff;
            ;
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
