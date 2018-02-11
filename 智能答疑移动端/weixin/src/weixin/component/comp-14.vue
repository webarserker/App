<!--修改日期：2017/6/20  22:00-->

<template>
    <div id="comp14" class="table_list" :key="(new Date()).getTime()">
        <!--<h3>(表格可滑动)</h3>-->


        <!--<div class="t_table">-->
        <!--<div class="t_head">-->
        <!--<div class="left">-->
        <!--<span class="x" :style="{background: $store.state.themeColor,color:'#fff'}">-->
        <!--<b>院系</b>-->
        <!--<b>详情</b>-->
        <!--</span>-->
        <!--</div>-->
        <!--<div class="right" ref="tright" id="tright">-->
        <!--<div class="main" id="tmain" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" ref="tmain" :key="(new Date()).getTime()">-->
        <!--<span :style="{background: $store.state.themeColor,color:'#fff'}">专业</span>-->
        <!--<span :style="{background: $store.state.themeColor,color:'#fff'}">授予学位</span>-->
        <!--<span :style="{background: $store.state.themeColor,color:'#fff'}">招生计划</span>-->
        <!--<span :style="{background: $store.state.themeColor,color:'#fff'}">历史录取</span>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--&lt;!&ndash; <div class="t_body" @touchstart="touchstart2" @touchmove.prevent="touchmove2" @touchend="touchend2" ref="tbody" :key="(new Date()).getTime()"> &ndash;&gt;-->
        <!--<div class="t_body">-->
        <!--<div class="left">-->
        <!--<span class="underline" v-for="x of rList" :style="{background: $store.state.themeColor,color:'#fff'}"-->
        <!--v-text="x.departName?x.departName:noneData"-->
        <!--@click="$router.push('/articleDetail2?specType=schoolDetail&sId='+x.departId+'&name='+x.departName)">-->
        <!--</span>-->
        <!--</div>-->
        <!--<div class="right">-->
        <!--<div class="main" id="smain" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" ref="smain" :key="(new Date()).getTime()">-->
        <!--<div class="mitem" v-for="x of rList">-->

        <!--<span class="underline" v-text="x.name!=''?x.name:noneData"-->
        <!--@click="$router.push('/articleDetail2?specType=0&tid='+x.id+'&name='+x.name)">-->
        <!--</span>-->
        <!--<span v-text="x.degree?x.degree:noneData"></span>-->
        <!--<span v-if="showEntroll" @click="$router.push('/articleDetail2?specType=8')">详情</span>-->
        <!--<span v-if="showEntrollHistory"-->
        <!--@click="$router.push('/articleDetail2?specType=11')">详情</span>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->

        <!---------------------------------------------------------------------------------------------------------->
        <div class="scroll-wrap">
            <table class="table1">
                <thead>
                <tr>
                    <th width="50%" :style="{background: $store.state.themeColor,color:'#fff'}">院系</th>
                    <th width="50%" :style="{background: $store.state.themeColor,color:'#fff'}">专业</th>
                    <!--<th width="15%" :style="{background: $store.state.themeColor,color:'#fff'}">学制</th>-->
                    <!--<th width="20%" :style="{background: $store.state.themeColor,color:'#fff'}">授予学位</th>-->
                    <!--&lt;!&ndash;<th class="min-width" :style="{background: $store.state.themeColor,color:'#fff'}">学费标准</th>&ndash;&gt;-->
                    <!--<th width="15%" :style="{background: $store.state.themeColor,color:'#fff'}">招生计划</th>-->
                    <!--<th width="15%" :style="{background: $store.state.themeColor,color:'#fff'}">历史录取</th>-->
                </tr>
                </thead>

                <tbody>
                <tr v-for="x of rList">
                    <td class="row-span underline" v-if="x.show" :rowspan="x.rowSpanNum" width="50%"
                        :style="{background: $store.state.themeColor,color:'#fff'}"
                        v-text="x.departName!=''?x.departName:noneData"
                        @click="$router.push('/articleDetail2?specType=schoolDetail&sId='+x.departId+'&name='+x.departName)"></td>
                    <td width="50%" class="underline" v-text="x.name!=''?x.name:noneData"
                        @click="$router.push('/articleDetail2?specType=0&tid='+x.id+'&name='+x.name)"></td>
                    <!--<td width="15%" v-text="x.schoolYear!=''?x.schoolYear:noneData"></td>-->
                    <!--<td width="20%" v-text="x.degree!=''?x.degree:noneData"></td>-->
                    <!--&lt;!&ndash;<td class="min-width" v-text="x.tuitionStandard!=''?x.tuitionStandard:noneData"></td>&ndash;&gt;-->
                    <!--<td width="15%" v-if="showEntroll" @click="$router.push('/articleDetail2?specType=8')">-->
                    <!--招生计划详情-->
                    <!--</td>-->
                    <!--<td width="15%" v-if="showEntrollHistory"-->
                    <!--@click="$router.push('/articleDetail2?specType=11')">历史录取详情-->
                    <!--</td>-->
                </tr>
                </tbody>
            </table>
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
                showDetail: 0,
                showEntroll: 0,
                showEntrollHistory: 0,
                sList: null,
                major: '',
                rList: '',
            }
        },
        computed: {},
        watch: {
            major: function (v) {
                if (v != '') {
                    this.rList = this.sList.filter(function (x) {
                        return x.name == v
                    })
                } else {
                    this.rList = this.sList
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
                        this.rList = res.data.data
                    })
            },
        },
        mounted() {
            var state = this.$store.state
            var url = state.host + state.baseUrl + '/getMajorConf?scode=' + state.scode
            var url2 = state.host + state.baseUrl + '/getMajorList'
            this.$http.get(url)
                .then(res => {
                    this.showEntrollHistory = res.data.showEntrollHistory
                    this.showEntroll = res.data.showEntroll
                    this.showDetail = res.data.showDetail
                    this.$http.post(url2, {sCode: state.scode, needPage: false}, {emulateJSON: true})
                        .then(res => {
                            this.sList = res.data.data
                            this.rList = res.data.data

                            /**********************排序的业务逻辑************************/
                            /*******先给每条数据加上show:true这个属性*******/
                            for (let i = 0; i < this.rList.length; i++) {
                                this.rList[i].show = true;
                            }

                            /*************然后进行过滤和行合并**************/
                            var rowSpanIndex = 0, rowSpanNum = 1;

                            var currentSchool = this.rList[rowSpanIndex];
                            for (let i = 1; i < this.rList.length; i++) {
                                if (this.rList[i].departName == currentSchool.departName) {
                                    rowSpanNum++;
                                    this.rList[rowSpanIndex].rowSpanNum = rowSpanNum;
                                    this.rList[i].show = false;
                                } else {
                                    rowSpanIndex = i;
                                    currentSchool = this.rList[i];
                                    rowSpanNum = 1;
                                }
                            }

                            /********************************************/

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

    table {
        border-collapse: collapse;
    }

    .table_list {
        padding:pxToRem(40);
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

        .scroll-wrap {
            width: 100%;
            border-bottom: 1px solid #ddd;
            .table1 {
                width: 100%;
                thead {
                    th {
                        text-align: center;
                        padding: pxToRem(12) pxToRem(20);
                        font-weight: normal;
                        border: 1px solid #eee;
                        font-size: pxToRem(28);
                    }
                }
                tbody {
                    td {
                        text-align: center;
                        border: 1px solid #ddd;
                        padding: pxToRem(12) pxToRem(20);
                        font-size: pxToRem(28);
                        &.row-span {
                            border: 1px solid #fff;
                        }
                        &.underline {
                            text-decoration: underline;
                        }
                    }
                }
            }

        }

    }

</style>
